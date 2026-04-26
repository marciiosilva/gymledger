const STUDENT_IMPORT_FIELD_DEFINITIONS = [
  { key: "name", label: "Nome", required: true, aliases: ["nome", "name", "aluno"] },
  { key: "email", label: "Email", aliases: ["email", "e-mail", "mail"] },
  { key: "phone", label: "Telefone", aliases: ["telefone", "phone", "celular", "whatsapp"] },
  { key: "document", label: "Documento", aliases: ["documento", "cpf", "document"] },
  { key: "planName", label: "Plano", aliases: ["plano", "plan", "nome do plano"] },
  { key: "startDate", label: "Data de inicio", required: true, aliases: ["data de inicio", "inicio", "start date", "startDate"] },
  { key: "operationalStatus", label: "Status operacional", aliases: ["status", "status operacional", "operational status"] },
  { key: "goal", label: "Objetivo", aliases: ["objetivo", "goal"] },
  { key: "level", label: "Nivel", aliases: ["nivel", "level"] },
  { key: "address", label: "Endereco", aliases: ["endereco", "address"] },
  { key: "emergencyContact", label: "Contato de emergencia", aliases: ["contato de emergencia", "emergency contact"] },
  { key: "medicalNotes", label: "Observacoes medicas", aliases: ["observacoes medicas", "medical notes", "restricoes"] },
];

const STATUS_ALIASES = new Map([
  ["ativo", "ACTIVE"],
  ["active", "ACTIVE"],
  ["inativo", "INACTIVE"],
  ["inactive", "INACTIVE"],
]);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeDocument(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function trimToNull(value) {
  const nextValue = String(value ?? "").trim();
  return nextValue ? nextValue : null;
}

function parseImportDate(value) {
  const raw = trimToNull(value);

  if (!raw) {
    return { ok: false, reason: "Data de inicio obrigatoria." };
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [day, month, year] = raw.split("/").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day
    ) {
      return { ok: true, value: parsedDate };
    }
  }

  const parsedDate = new Date(raw);

  if (Number.isNaN(parsedDate.getTime())) {
    return { ok: false, reason: "Data de inicio invalida." };
  }

  return { ok: true, value: parsedDate };
}

function inferMapping(headers) {
  const nextMapping = {};

  for (const definition of STUDENT_IMPORT_FIELD_DEFINITIONS) {
    const match = headers.find((header) => definition.aliases.includes(normalizeText(header)));

    if (match) {
      nextMapping[definition.key] = match;
    }
  }

  return nextMapping;
}

function normalizeStatus(value) {
  const raw = normalizeText(value);

  if (!raw) {
    return { ok: true, value: "ACTIVE" };
  }

  const normalized = STATUS_ALIASES.get(raw);
  if (!normalized) {
    return { ok: false, reason: "Status operacional invalido. Use Ativo ou Inativo." };
  }

  return { ok: true, value: normalized };
}

function collectHeaders(rows) {
  const headers = new Set();

  for (const row of rows) {
    for (const key of Object.keys(row ?? {})) {
      headers.add(key);
    }
  }

  return Array.from(headers);
}

function getMappedValue(row, mapping, fieldKey) {
  const sourceColumn = mapping[fieldKey];
  return sourceColumn ? row?.[sourceColumn] : undefined;
}

export function getStudentImportFields() {
  return STUDENT_IMPORT_FIELD_DEFINITIONS.map(({ aliases, ...field }) => field);
}

export function buildStudentImportTemplateRows() {
  return [
    {
      Nome: "Ana Silva",
      Email: "ana.silva@example.com",
      Telefone: "+55 11 99999-0001",
      Documento: "12345678900",
      Plano: "Studio Mensal",
      "Data de inicio": "01/05/2026",
      "Status operacional": "Ativo",
      Objetivo: "Hipertrofia",
      Nivel: "Intermediario",
      Endereco: "Rua Exemplo, 100",
      "Contato de emergencia": "Maria Silva - +55 11 98888-0000",
      "Observacoes medicas": "Nenhuma",
    },
  ];
}

export function resolveStudentImportMapping({ headers, mapping = {} }) {
  const inferredMapping = inferMapping(headers);
  const nextMapping = { ...inferredMapping, ...mapping };
  const missingRequiredFields = STUDENT_IMPORT_FIELD_DEFINITIONS
    .filter((field) => field.required && !nextMapping[field.key])
    .map((field) => field.key);

  return {
    mapping: nextMapping,
    missingRequiredFields,
    fields: getStudentImportFields(),
  };
}

export function previewStudentImport({
  rows,
  mapping = {},
  existingStudents = [],
  plans = [],
}) {
  const headers = collectHeaders(rows);
  const mappingResult = resolveStudentImportMapping({ headers, mapping });
  const errors = [];
  const previewRows = [];
  const fileEmailSet = new Set();
  const fileDocumentSet = new Set();
  const existingEmailSet = new Set(
    existingStudents
      .map((student) => normalizeText(student.email))
      .filter(Boolean)
  );
  const existingDocumentSet = new Set(
    existingStudents
      .map((student) => normalizeDocument(student.document))
      .filter(Boolean)
  );
  const activePlansByName = new Map(
    plans
      .filter((plan) => plan.isActive)
      .map((plan) => [normalizeText(plan.name), plan])
  );

  if (mappingResult.missingRequiredFields.length > 0) {
    for (const fieldKey of mappingResult.missingRequiredFields) {
      const field = STUDENT_IMPORT_FIELD_DEFINITIONS.find((entry) => entry.key === fieldKey);
      errors.push({
        rowNumber: 1,
        fieldName: fieldKey,
        message: `Mapeie a coluna obrigatoria "${field?.label ?? fieldKey}".`,
      });
    }
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors = [];
    const name = trimToNull(getMappedValue(row, mappingResult.mapping, "name"));
    const email = trimToNull(getMappedValue(row, mappingResult.mapping, "email"));
    const phone = trimToNull(getMappedValue(row, mappingResult.mapping, "phone"));
    const document = normalizeDocument(getMappedValue(row, mappingResult.mapping, "document"));
    const planName = trimToNull(getMappedValue(row, mappingResult.mapping, "planName"));
    const startDateResult = parseImportDate(getMappedValue(row, mappingResult.mapping, "startDate"));
    const statusResult = normalizeStatus(getMappedValue(row, mappingResult.mapping, "operationalStatus"));
    const normalizedEmail = normalizeText(email);
    const normalizedPlanName = normalizeText(planName);

    if (!name) {
      rowErrors.push({ rowNumber, fieldName: "name", message: "Nome obrigatorio." });
    }

    if (!email && !document) {
      rowErrors.push({
        rowNumber,
        fieldName: "email",
        message: "Informe email ou documento para identificar o aluno.",
      });
    }

    if (email && !emailRegex.test(email)) {
      rowErrors.push({ rowNumber, fieldName: "email", message: "Email invalido." });
    }

    if (normalizedEmail) {
      if (fileEmailSet.has(normalizedEmail)) {
        rowErrors.push({ rowNumber, fieldName: "email", message: "Email duplicado no arquivo." });
      }

      if (existingEmailSet.has(normalizedEmail)) {
        rowErrors.push({ rowNumber, fieldName: "email", message: "Email ja cadastrado nesta academia." });
      }
    }

    if (document) {
      if (fileDocumentSet.has(document)) {
        rowErrors.push({ rowNumber, fieldName: "document", message: "Documento duplicado no arquivo." });
      }

      if (existingDocumentSet.has(document)) {
        rowErrors.push({
          rowNumber,
          fieldName: "document",
          message: "Documento ja cadastrado nesta academia.",
        });
      }
    }

    if (!startDateResult.ok) {
      rowErrors.push({ rowNumber, fieldName: "startDate", message: startDateResult.reason });
    }

    if (!statusResult.ok) {
      rowErrors.push({ rowNumber, fieldName: "operationalStatus", message: statusResult.reason });
    }

    let plan = null;
    if (planName) {
      plan = activePlansByName.get(normalizedPlanName) ?? null;

      if (!plan) {
        rowErrors.push({
          rowNumber,
          fieldName: "planName",
          message: "Plano nao encontrado ou inativo.",
        });
      }
    }

    if (!rowErrors.length) {
      if (normalizedEmail) fileEmailSet.add(normalizedEmail);
      if (document) fileDocumentSet.add(document);
    }

    errors.push(...rowErrors);
    previewRows.push({
      rowNumber,
      source: row,
      isValid: rowErrors.length === 0,
      errors: rowErrors,
      normalized: rowErrors.length
        ? null
        : {
            name,
            email,
            phone,
            document: document || null,
            planId: plan?.id ?? null,
            planName,
            startDate: startDateResult.value.toISOString(),
            operationalStatus: statusResult.value,
            goal: trimToNull(getMappedValue(row, mappingResult.mapping, "goal")),
            level: trimToNull(getMappedValue(row, mappingResult.mapping, "level")),
            address: trimToNull(getMappedValue(row, mappingResult.mapping, "address")),
            emergencyContact: trimToNull(getMappedValue(row, mappingResult.mapping, "emergencyContact")),
            medicalNotes: trimToNull(getMappedValue(row, mappingResult.mapping, "medicalNotes")),
          },
    });
  });

  const validRows = previewRows.filter((row) => row.isValid);
  const invalidRows = previewRows.length - validRows.length;

  return {
    fields: mappingResult.fields,
    headers,
    mapping: mappingResult.mapping,
    errors,
    rows: previewRows,
    summary: {
      totalRows: previewRows.length,
      validRows: validRows.length,
      invalidRows,
      readyToImport: invalidRows === 0 && previewRows.length > 0 && mappingResult.missingRequiredFields.length === 0,
    },
  };
}
