export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export function normalizeLocale(locale: string | undefined): Locale {
  return locale === "en" ? "en" : defaultLocale;
}

export function getPostLocale(id: string): Locale {
  return id.split("/")[0] === "en" ? "en" : defaultLocale;
}

export function getTranslationKey(id: string): string {
  const segments = id.split("/").filter(Boolean);
  if (segments[0] === "en") segments.shift();
  return segments.join("/");
}
