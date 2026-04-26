import { describe, expect, it } from "vitest";
import {
  buildExerciseImportTemplateRows,
  previewExerciseImport,
  resolveExerciseImportMapping,
} from "./exerciseImport.js";

describe("exerciseImport", () => {
  it("infere mapeamento basico", () => {
    const result = resolveExerciseImportMapping({
      headers: ["Nome", "Grupo muscular", "Imagem URL"],
    });

    expect(result.mapping).toMatchObject({
      name: "Nome",
      muscleGroup: "Grupo muscular",
      imageUrl: "Imagem URL",
    });
  });

  it("identifica duplicidade no arquivo e no banco", () => {
    const result = previewExerciseImport({
      rows: [
        { Nome: "Prancha", "Grupo muscular": "Core" },
        { Nome: "Prancha", "Grupo muscular": "Core" },
      ],
      existingExercises: [{ name: "Agachamento", muscleGroup: "Pernas" }],
    });

    expect(result.summary.validRows).toBe(1);
    expect(result.summary.invalidRows).toBe(1);
    expect(result.rows[1].errors[0].message).toMatch(/duplicado no arquivo/i);
  });

  it("retorna linha modelo", () => {
    expect(buildExerciseImportTemplateRows()[0]).toHaveProperty("Nome");
  });
});
