// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mvpSeedData } from "./mvpSeedData.js";

function ids(items) {
  return new Set(items.map((item) => item.id));
}

describe("mvp seed data", () => {
  it("covers every MVP module", () => {
    expect(mvpSeedData.users.length).toBeGreaterThan(0);
    expect(mvpSeedData.plans.length).toBeGreaterThan(0);
    expect(mvpSeedData.students.length).toBeGreaterThan(0);
    expect(mvpSeedData.payments.length).toBeGreaterThan(0);
    expect(mvpSeedData.exercises.length).toBeGreaterThan(0);
    expect(mvpSeedData.workouts.length).toBeGreaterThan(0);
    expect(mvpSeedData.workoutDays.length).toBeGreaterThan(0);
    expect(mvpSeedData.workoutExercises.length).toBeGreaterThan(0);
    expect(mvpSeedData.workoutAssignments.length).toBeGreaterThan(0);
    expect(mvpSeedData.checkIns.length).toBeGreaterThan(0);
    expect(mvpSeedData.importBatches.length).toBeGreaterThan(0);
    expect(mvpSeedData.importErrors.length).toBeGreaterThan(0);
  });

  it("keeps relations coherent", () => {
    const userIds = ids(mvpSeedData.users);
    const planIds = ids(mvpSeedData.plans);
    const studentIds = ids(mvpSeedData.students);
    const exerciseIds = ids(mvpSeedData.exercises);
    const workoutIds = ids(mvpSeedData.workouts);
    const workoutDayIds = ids(mvpSeedData.workoutDays);
    const importBatchIds = ids(mvpSeedData.importBatches);

    for (const student of mvpSeedData.students) {
      expect(planIds.has(student.planId)).toBe(true);
    }

    for (const payment of mvpSeedData.payments) {
      expect(studentIds.has(payment.studentId)).toBe(true);
      expect(planIds.has(payment.planId)).toBe(true);
    }

    for (const workout of mvpSeedData.workouts) {
      expect(userIds.has(workout.createdByUserId)).toBe(true);
    }

    for (const workoutDay of mvpSeedData.workoutDays) {
      expect(workoutIds.has(workoutDay.workoutId)).toBe(true);
    }

    for (const workoutExercise of mvpSeedData.workoutExercises) {
      expect(workoutDayIds.has(workoutExercise.workoutDayId)).toBe(true);
      expect(exerciseIds.has(workoutExercise.exerciseId)).toBe(true);
    }

    for (const assignment of mvpSeedData.workoutAssignments) {
      expect(studentIds.has(assignment.studentId)).toBe(true);
      expect(workoutIds.has(assignment.workoutId)).toBe(true);
    }

    for (const checkIn of mvpSeedData.checkIns) {
      expect(studentIds.has(checkIn.studentId)).toBe(true);
    }

    for (const importError of mvpSeedData.importErrors) {
      expect(importBatchIds.has(importError.importBatchId)).toBe(true);
    }
  });
});
