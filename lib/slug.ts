export function generateSlug(text: string): string {
  // Try to create a slug from latin characters
  let slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // If slug is empty or too short (non-latin chars), generate a unique hash-based slug
  if (!slug || slug.length < 3) {
    const hash = text
      .split("")
      .reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0)
      .toString(36);
    slug = `topic-${Math.abs(parseInt(hash, 36)).toString(36)}-${Date.now().toString(36)}`;
  }

  return slug;
}

export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
