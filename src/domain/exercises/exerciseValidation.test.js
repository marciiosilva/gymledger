import { describe, expect, it } from "vitest";
import { buildExerciseUniqueKey, normalizeExercisePayload } from "./exerciseValidation.js";

describe("exerciseValidation", () => {
  it("normaliza payload valido", () => {
    const result = normalizeExercisePayload({
      name: " Supino reto ",
      muscleGroup: " Peito ",
      imageUrl: "https://example.com/image.jpg",
      videoUrl: "https://example.com/video.mp4",
      isActive: "Ativo",
    });

    expect(result.errors).toEqual([]);
    expect(result.normalized).toMatchObject({
      name: "Supino reto",
      muscleGroup: "Peito",
      isActive: true,
    });
  });

  it("rejeita campos obrigatorios e urls invalidas", () => {
    const result = normalizeExercisePayload({
      name: "",
      muscleGroup: "",
      imageUrl: "ftp://example.com/image.jpg",
      videoUrl: "nao-e-url",
    });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fieldName: "name" }),
        expect.objectContaining({ fieldName: "muscleGroup" }),
        expect.objectContaining({ fieldName: "imageUrl" }),
        expect.objectContaining({ fieldName: "videoUrl" }),
      ])
    );
  });

  it("monta chave unica ignorando caixa e acento", () => {
    expect(buildExerciseUniqueKey({ name: "Prancha", muscleGroup: "Córé" })).toBe("prancha::core");
  });
});
