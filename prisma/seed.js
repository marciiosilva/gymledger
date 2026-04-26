import { createPrismaClient } from "../src/server/db/prisma.js";
import { mvpSeedData } from "../src/domain/fixtures/mvpSeedData.js";

const prisma = createPrismaClient();
const { gym } = mvpSeedData;

function date(value) {
  return value ? new Date(value) : null;
}

async function upsertById(model, id, data) {
  return model.upsert({
    where: { id },
    create: data,
    update: data,
  });
}

async function main() {
  await upsertById(prisma.gym, gym.id, gym);

  for (const user of mvpSeedData.users) {
    await upsertById(prisma.user, user.id, {
      ...user,
      gymId: gym.id,
    });
  }

  for (const plan of mvpSeedData.plans) {
    await upsertById(prisma.plan, plan.id, {
      ...plan,
      gymId: gym.id,
    });
  }

  for (const student of mvpSeedData.students) {
    await upsertById(prisma.student, student.id, {
      ...student,
      gymId: gym.id,
      startDate: date(student.startDate),
    });
  }

  for (const payment of mvpSeedData.payments) {
    await upsertById(prisma.payment, payment.id, {
      ...payment,
      gymId: gym.id,
      dueDate: date(payment.dueDate),
      paidAt: date(payment.paidAt),
    });
  }

  for (const exercise of mvpSeedData.exercises) {
    await upsertById(prisma.exercise, exercise.id, {
      ...exercise,
      gymId: gym.id,
    });
  }

  for (const workout of mvpSeedData.workouts) {
    await upsertById(prisma.workout, workout.id, {
      ...workout,
      gymId: gym.id,
    });
  }

  for (const workoutDay of mvpSeedData.workoutDays) {
    await upsertById(prisma.workoutDay, workoutDay.id, workoutDay);
  }

  for (const workoutExercise of mvpSeedData.workoutExercises) {
    await upsertById(prisma.workoutExercise, workoutExercise.id, workoutExercise);
  }

  for (const assignment of mvpSeedData.workoutAssignments) {
    await upsertById(prisma.workoutAssignment, assignment.id, {
      ...assignment,
      gymId: gym.id,
      assignedAt: date(assignment.assignedAt),
    });
  }

  for (const checkIn of mvpSeedData.checkIns) {
    await upsertById(prisma.checkIn, checkIn.id, {
      ...checkIn,
      gymId: gym.id,
      checkedAt: date(checkIn.checkedAt),
    });
  }

  for (const importBatch of mvpSeedData.importBatches) {
    await upsertById(prisma.importBatch, importBatch.id, {
      ...importBatch,
      gymId: gym.id,
      createdAt: date(importBatch.createdAt),
      completedAt: date(importBatch.completedAt),
    });
  }

  for (const importError of mvpSeedData.importErrors) {
    await upsertById(prisma.importError, importError.id, importError);
  }

  const counts = await Promise.all([
    prisma.user.count({ where: { gymId: gym.id } }),
    prisma.plan.count({ where: { gymId: gym.id } }),
    prisma.student.count({ where: { gymId: gym.id } }),
    prisma.payment.count({ where: { gymId: gym.id } }),
    prisma.exercise.count({ where: { gymId: gym.id } }),
    prisma.workout.count({ where: { gymId: gym.id } }),
    prisma.checkIn.count({ where: { gymId: gym.id } }),
    prisma.importBatch.count({ where: { gymId: gym.id } }),
  ]);

  console.log(
    [
      `Seed concluido para ${gym.name}.`,
      `users=${counts[0]}`,
      `plans=${counts[1]}`,
      `students=${counts[2]}`,
      `payments=${counts[3]}`,
      `exercises=${counts[4]}`,
      `workouts=${counts[5]}`,
      `checkIns=${counts[6]}`,
      `imports=${counts[7]}`,
    ].join(" ")
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
