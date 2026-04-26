const statusAliases = new Map([
  ["ativo", true],
  ["active", true],
  ["inativo", false],
  ["inactive", false],
]);

function trimToNull(value) {
  const nextValue = String(value ?? "").trim();
  return nextValue ? nextValue : null;
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isValidUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeExercisePayload(payload = {}) {
  const normalizedStatus = normalizeText(payload.isActive);
  const normalized = {
    name: trimToNull(payload.name),
    muscleGroup: trimToNull(payload.muscleGroup),
    description: trimToNull(payload.description),
    imageUrl: trimToNull(payload.imageUrl),
    videoUrl: trimToNull(payload.videoUrl),
    technicalNotes: trimToNull(payload.technicalNotes),
    isActive:
      typeof payload.isActive === "boolean"
        ? payload.isActive
        : normalizedStatus
          ? statusAliases.get(normalizedStatus)
          : true,
  };

  const errors = [];

  if (!normalized.name) {
    errors.push({ fieldName: "name", message: "Nome do exercicio obrigatorio." });
  }

  if (!normalized.muscleGroup) {
    errors.push({ fieldName: "muscleGroup", message: "Grupo muscular obrigatorio." });
  }

  if (normalized.imageUrl && !isValidUrl(normalized.imageUrl)) {
    errors.push({ fieldName: "imageUrl", message: "URL da imagem invalida." });
  }

  if (normalized.videoUrl && !isValidUrl(normalized.videoUrl)) {
    errors.push({ fieldName: "videoUrl", message: "URL do video invalida." });
  }

  if (typeof normalized.isActive !== "boolean") {
    errors.push({ fieldName: "isActive", message: "Status invalido. Use ativo ou inativo." });
  }

  return { normalized, errors };
}

export function buildExerciseUniqueKey({ name, muscleGroup }) {
  return `${normalizeText(name)}::${normalizeText(muscleGroup)}`;
}
