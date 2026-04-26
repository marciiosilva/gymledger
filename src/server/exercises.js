import { createPrismaClient } from "./db/prisma.js";
import { normalizeExercisePayload, buildExerciseUniqueKey } from "../domain/exercises/exerciseValidation.js";
import { previewExerciseImport } from "../domain/imports/exerciseImport.js";

let prismaSingleton;

function getPrismaClient() {
  prismaSingleton ??= createPrismaClient();
  return prismaSingleton;
}

async function resolveGym(prismaClient) {
  const gym = await prismaClient.gym.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  if (!gym) {
    throw new Error("Nenhuma academia encontrada para gerenciar exercicios.");
  }

  return gym;
}

async function assertUniqueExercise({ prismaClient, gymId, name, muscleGroup, ignoreId }) {
  const existing = await prismaClient.exercise.findFirst({
    where: {
      gymId,
      name,
      muscleGroup,
      ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    const error = new Error("Ja existe um exercicio com este nome para o grupo muscular informado.");
    error.statusCode = 409;
    throw error;
  }
}

export async function listExercises(filters = {}, prismaClient = getPrismaClient()) {
  const gym = await resolveGym(prismaClient);
  const search = String(filters.search ?? "").trim();
  const muscleGroup = String(filters.muscleGroup ?? "").trim();
  const status = String(filters.status ?? "all").trim();

  const exercises = await prismaClient.exercise.findMany({
    where: {
      gymId: gym.id,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { muscleGroup: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(muscleGroup ? { muscleGroup: { equals: muscleGroup, mode: "insensitive" } } : {}),
      ...(status === "active" ? { isActive: true } : {}),
      ...(status === "inactive" ? { isActive: false } : {}),
    },
    orderBy: [{ isActive: "desc" }, { muscleGroup: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          workoutExercises: true,
        },
      },
    },
  });

  const muscleGroups = await prismaClient.exercise.findMany({
    where: { gymId: gym.id },
    distinct: ["muscleGroup"],
    orderBy: { muscleGroup: "asc" },
    select: { muscleGroup: true },
  });

  return {
    exercises,
    filters: {
      muscleGroups: muscleGroups.map((item) => item.muscleGroup),
    },
  };
}

export async function createExercise(payload, prismaClient = getPrismaClient()) {
  const gym = await resolveGym(prismaClient);
  const result = normalizeExercisePayload(payload);

  if (result.errors.length) {
    const error = new Error(result.errors[0].message);
    error.statusCode = 400;
    error.details = result.errors;
    throw error;
  }

  await assertUniqueExercise({
    prismaClient,
    gymId: gym.id,
    name: result.normalized.name,
    muscleGroup: result.normalized.muscleGroup,
  });

  return prismaClient.exercise.create({
    data: {
      gymId: gym.id,
      ...result.normalized,
    },
    include: {
      _count: {
        select: { workoutExercises: true },
      },
    },
  });
}

export async function updateExercise(id, payload, prismaClient = getPrismaClient()) {
  const gym = await resolveGym(prismaClient);
  const currentExercise = await prismaClient.exercise.findFirst({
    where: { id, gymId: gym.id },
  });

  if (!currentExercise) {
    const error = new Error("Exercicio nao encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const result = normalizeExercisePayload({ ...currentExercise, ...payload });

  if (result.errors.length) {
    const error = new Error(result.errors[0].message);
    error.statusCode = 400;
    error.details = result.errors;
    throw error;
  }

  await assertUniqueExercise({
    prismaClient,
    gymId: gym.id,
    name: result.normalized.name,
    muscleGroup: result.normalized.muscleGroup,
    ignoreId: id,
  });

  return prismaClient.exercise.update({
    where: { id },
    data: result.normalized,
    include: {
      _count: {
        select: { workoutExercises: true },
      },
    },
  });
}

async function buildPreviewPayload({ rows, mapping }, prismaClient) {
  const gym = await resolveGym(prismaClient);
  const existingExercises = await prismaClient.exercise.findMany({
    where: { gymId: gym.id },
    select: { name: true, muscleGroup: true },
  });

  return {
    gym,
    preview: previewExerciseImport({
      rows: Array.isArray(rows) ? rows : [],
      mapping: mapping && typeof mapping === "object" ? mapping : {},
      existingExercises,
    }),
  };
}

export async function previewExerciseRows({ rows, mapping }, prismaClient = getPrismaClient()) {
  return buildPreviewPayload({ rows, mapping }, prismaClient);
}

export async function confirmExerciseImport({ fileName, rows, mapping }, prismaClient = getPrismaClient()) {
  const { gym, preview } = await buildPreviewPayload({ rows, mapping }, prismaClient);
  const normalizedRows = preview.rows.filter((row) => row.isValid).map((row) => row.normalized);

  if (!preview.summary.readyToImport) {
    const failedBatch = await prismaClient.importBatch.create({
      data: {
        gymId: gym.id,
        type: "EXERCISES",
        status: "FAILED",
        fileName: fileName || "importacao-exercicios",
        totalRows: preview.summary.totalRows,
        validRows: preview.summary.validRows,
        invalidRows: preview.summary.invalidRows,
        completedAt: new Date(),
        errors: {
          create: preview.errors.map((error) => ({
            rowNumber: error.rowNumber,
            fieldName: error.fieldName ?? null,
            message: error.message,
          })),
        },
      },
      include: { errors: true },
    });

    return { batch: failedBatch, preview };
  }

  const completedBatch = await prismaClient.$transaction(async (tx) => {
    const batch = await tx.importBatch.create({
      data: {
        gymId: gym.id,
        type: "EXERCISES",
        status: "COMPLETED",
        fileName: fileName || "importacao-exercicios",
        totalRows: preview.summary.totalRows,
        validRows: preview.summary.validRows,
        invalidRows: preview.summary.invalidRows,
        completedAt: new Date(),
      },
    });

    for (const exercise of normalizedRows) {
      await tx.exercise.create({
        data: {
          gymId: gym.id,
          ...exercise,
        },
      });
    }

    return tx.importBatch.findUniqueOrThrow({
      where: { id: batch.id },
      include: { errors: true },
    });
  });

  return { batch: completedBatch, preview };
}
