import { createPrismaClient } from "./db/prisma.js";
import { previewStudentImport } from "../domain/imports/studentImport.js";

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
    throw new Error("Nenhuma academia encontrada para importar alunos.");
  }

  return gym;
}

export async function listPlans(prismaClient = getPrismaClient()) {
  const gym = await resolveGym(prismaClient);
  const plans = await prismaClient.plan.findMany({
    where: { gymId: gym.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      isActive: true,
      periodicity: true,
      amountInCents: true,
    },
  });

  return { gym, plans };
}

export async function listImportBatches({ type = "STUDENTS" } = {}, prismaClient = getPrismaClient()) {
  const gym = await resolveGym(prismaClient);
  const batches = await prismaClient.importBatch.findMany({
    where: { gymId: gym.id, type },
    orderBy: [{ createdAt: "desc" }],
    include: {
      errors: {
        orderBy: [{ rowNumber: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          rowNumber: true,
          fieldName: true,
          message: true,
        },
      },
    },
  });

  return { gym, batches };
}

async function buildPreviewPayload({ rows, mapping }, prismaClient) {
  const gym = await resolveGym(prismaClient);
  const [plans, existingStudents] = await Promise.all([
    prismaClient.plan.findMany({
      where: { gymId: gym.id },
      select: { id: true, name: true, isActive: true },
      orderBy: { name: "asc" },
    }),
    prismaClient.student.findMany({
      where: { gymId: gym.id },
      select: { email: true, document: true },
    }),
  ]);

  return {
    gym,
    preview: previewStudentImport({
      rows: Array.isArray(rows) ? rows : [],
      mapping: mapping && typeof mapping === "object" ? mapping : {},
      plans,
      existingStudents,
    }),
  };
}

export async function previewStudentRows({ rows, mapping }, prismaClient = getPrismaClient()) {
  return buildPreviewPayload({ rows, mapping }, prismaClient);
}

export async function confirmStudentImport({ fileName, rows, mapping }, prismaClient = getPrismaClient()) {
  const { gym, preview } = await buildPreviewPayload({ rows, mapping }, prismaClient);
  const normalizedRows = preview.rows.filter((row) => row.isValid).map((row) => row.normalized);

  if (!preview.summary.readyToImport) {
    const failedBatch = await prismaClient.importBatch.create({
      data: {
        gymId: gym.id,
        type: "STUDENTS",
        status: "FAILED",
        fileName: fileName || "importacao-alunos",
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
      include: {
        errors: {
          orderBy: [{ rowNumber: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    return { gym, batch: failedBatch, preview };
  }

  const completedBatch = await prismaClient.$transaction(async (tx) => {
    const batch = await tx.importBatch.create({
      data: {
        gymId: gym.id,
        type: "STUDENTS",
        status: "COMPLETED",
        fileName: fileName || "importacao-alunos",
        totalRows: preview.summary.totalRows,
        validRows: preview.summary.validRows,
        invalidRows: preview.summary.invalidRows,
        completedAt: new Date(),
      },
    });

    for (const student of normalizedRows) {
      await tx.student.create({
        data: {
          gymId: gym.id,
          planId: student.planId,
          name: student.name,
          email: student.email,
          phone: student.phone,
          document: student.document,
          startDate: new Date(student.startDate),
          operationalStatus: student.operationalStatus,
          goal: student.goal,
          level: student.level,
          address: student.address,
          emergencyContact: student.emergencyContact,
          medicalNotes: student.medicalNotes,
        },
      });
    }

    return tx.importBatch.findUniqueOrThrow({
      where: { id: batch.id },
      include: {
        errors: true,
      },
    });
  });

  return { gym, batch: completedBatch, preview };
}
