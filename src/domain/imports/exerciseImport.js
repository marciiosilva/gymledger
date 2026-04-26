import { buildExerciseUniqueKey, normalizeExercisePayload } from "../exercises/exerciseValidation.js";

const EXERCISE_IMPORT_FIELD_DEFINITIONS = [
  { key: "name", label: "Nome", required: true, aliases: ["nome", "name", "exercicio", "exercise"] },
  { key: "muscleGroup", label: "Grupo muscular", required: true, aliases: ["grupo muscular", "muscle group", "musculatura"] },
  { key: "description", label: "Descricao", aliases: ["descricao", "description"] },
  { key: "imageUrl", label: "Imagem URL", aliases: ["imagem", "image", "image url", "imagem url"] },
  { key: "videoUrl", label: "Video URL", aliases: ["video", "video url", "url video"] },
  { key: "technicalNotes", label: "Notas tecnicas", aliases: ["notas tecnicas", "technical notes", "observacoes"] },
  { key: "isActive", label: "Status", aliases: ["status", "ativo"] },
];

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function collectHeaders(rows) {
  const headers = new Set();

  for (const row of rows) {
    for (const key of Object.keys(row ?? {})) headers.add(key);
  }

  return Array.from(headers);
}

function inferMapping(headers) {
  const nextMapping = {};

  for (const definition of EXERCISE_IMPORT_FIELD_DEFINITIONS) {
    const match = headers.find((header) => definition.aliases.includes(normalizeText(header)));
    if (match) nextMapping[definition.key] = match;
  }

  return nextMapping;
}

function getMappedValue(row, mapping, fieldKey) {
  const sourceColumn = mapping[fieldKey];
  return sourceColumn ? row?.[sourceColumn] : undefined;
}

export function getExerciseImportFields() {
  return EXERCISE_IMPORT_FIELD_DEFINITIONS.map(({ aliases, ...field }) => field);
}

export function buildExerciseImportTemplateRows() {
  return [
    {
      Nome: "Levantamento terra romeno",
      "Grupo muscular": "Posterior de coxa",
      Descricao: "Hinge para posterior de coxa e gluteos.",
      "Imagem URL": "https://example.com/exercises/terra-romeno.jpg",
      "Video URL": "https://example.com/exercises/terra-romeno.mp4",
      "Notas tecnicas": "Manter coluna neutra e joelhos semi-flexionados.",
      Status: "Ativo",
    },
  ];
}

export function resolveExerciseImportMapping({ headers, mapping = {} }) {
  const inferredMapping = inferMapping(headers);
  const nextMapping = { ...inferredMapping, ...mapping };
  const missingRequiredFields = EXERCISE_IMPORT_FIELD_DEFINITIONS
    .filter((field) => field.required && !nextMapping[field.key])
    .map((field) => field.key);

  return {
    mapping: nextMapping,
    missingRequiredFields,
    fields: getExerciseImportFields(),
  };
}

export function previewExerciseImport({ rows, mapping = {}, existingExercises = [] }) {
  const headers = collectHeaders(rows);
  const mappingResult = resolveExerciseImportMapping({ headers, mapping });
  const errors = [];
  const previewRows = [];
  const existingKeys = new Set(existingExercises.map((exercise) => buildExerciseUniqueKey(exercise)));
  const fileKeys = new Set();

  if (mappingResult.missingRequiredFields.length > 0) {
    for (const fieldKey of mappingResult.missingRequiredFields) {
      const field = EXERCISE_IMPORT_FIELD_DEFINITIONS.find((entry) => entry.key === fieldKey);
      errors.push({
        rowNumber: 1,
        fieldName: fieldKey,
        message: `Mapeie a coluna obrigatoria "${field?.label ?? fieldKey}".`,
      });
    }
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const payload = {
      name: getMappedValue(row, mappingResult.mapping, "name"),
      muscleGroup: getMappedValue(row, mappingResult.mapping, "muscleGroup"),
      description: getMappedValue(row, mappingResult.mapping, "description"),
      imageUrl: getMappedValue(row, mappingResult.mapping, "imageUrl"),
      videoUrl: getMappedValue(row, mappingResult.mapping, "videoUrl"),
      technicalNotes: getMappedValue(row, mappingResult.mapping, "technicalNotes"),
      isActive: getMappedValue(row, mappingResult.mapping, "isActive"),
    };

    const normalizedResult = normalizeExercisePayload(payload);
    const rowErrors = [...normalizedResult.errors].map((error) => ({ rowNumber, ...error }));

    if (!rowErrors.length) {
      const uniqueKey = buildExerciseUniqueKey(normalizedResult.normalized);

      if (fileKeys.has(uniqueKey)) {
        rowErrors.push({
          rowNumber,
          fieldName: "name",
          message: "Exercicio duplicado no arquivo para o mesmo grupo muscular.",
        });
      }

      if (existingKeys.has(uniqueKey)) {
        rowErrors.push({
          rowNumber,
          fieldName: "name",
          message: "Exercicio ja cadastrado para este grupo muscular.",
        });
      }

      if (!rowErrors.length) fileKeys.add(uniqueKey);
    }

    errors.push(...rowErrors);
    previewRows.push({
      rowNumber,
      source: row,
      isValid: rowErrors.length === 0,
      errors: rowErrors,
      normalized: rowErrors.length ? null : normalizedResult.normalized,
    });
  });

  const validRows = previewRows.filter((row) => row.isValid).length;
  const invalidRows = previewRows.length - validRows;

  return {
    fields: mappingResult.fields,
    headers,
    mapping: mappingResult.mapping,
    errors,
    rows: previewRows,
    summary: {
      totalRows: previewRows.length,
      validRows,
      invalidRows,
      readyToImport: invalidRows === 0 && previewRows.length > 0 && mappingResult.missingRequiredFields.length === 0,
    },
  };
}
