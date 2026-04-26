import { describe, expect, it } from "vitest";
import {
  buildStudentImportTemplateRows,
  previewStudentImport,
  resolveStudentImportMapping,
} from "./studentImport.js";

describe("studentImport", () => {
  it("infere mapeamento basico a partir dos cabecalhos", () => {
    const result = resolveStudentImportMapping({
      headers: ["Nome", "Email", "Plano", "Data de inicio"],
    });

    expect(result.mapping).toMatchObject({
      name: "Nome",
      email: "Email",
      planName: "Plano",
      startDate: "Data de inicio",
    });
    expect(result.missingRequiredFields).toEqual([]);
  });

  it("marca duplicidades e planos invalidos no preview", () => {
    const result = previewStudentImport({
      rows: [
        {
          Nome: "Ana Silva",
          Email: "ana@example.com",
          Documento: "12345678900",
          Plano: "Studio Mensal",
          "Data de inicio": "01/05/2026",
        },
        {
          Nome: "Bia Souza",
          Email: "ana@example.com",
          Documento: "12345678900",
          Plano: "Plano Fantasma",
          "Data de inicio": "32/05/2026",
        },
      ],
      plans: [{ id: "plan_1", name: "Studio Mensal", isActive: true }],
      existingStudents: [],
    });

    expect(result.summary.totalRows).toBe(2);
    expect(result.summary.validRows).toBe(1);
    expect(result.summary.invalidRows).toBe(1);
    expect(result.rows[1].errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fieldName: "email", message: "Email duplicado no arquivo." }),
        expect.objectContaining({ fieldName: "document", message: "Documento duplicado no arquivo." }),
        expect.objectContaining({ fieldName: "planName", message: "Plano nao encontrado ou inativo." }),
        expect.objectContaining({ fieldName: "startDate", message: "Data de inicio invalida." }),
      ])
    );
  });

  it("detecta duplicidade contra alunos ja cadastrados", () => {
    const result = previewStudentImport({
      rows: [
        {
          Nome: "Ana Silva",
          Email: "ana@example.com",
          Documento: "12345678900",
          "Data de inicio": "2026-05-01",
        },
      ],
      existingStudents: [{ email: "ana@example.com", document: "12345678900" }],
      plans: [],
    });

    expect(result.rows[0].isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fieldName: "email", message: "Email ja cadastrado nesta academia." }),
        expect.objectContaining({ fieldName: "document", message: "Documento ja cadastrado nesta academia." }),
      ])
    );
  });

  it("exponibiliza uma linha modelo para download", () => {
    expect(buildStudentImportTemplateRows()).toHaveLength(1);
    expect(buildStudentImportTemplateRows()[0]).toHaveProperty("Nome");
  });
});
