import type { CollectionEntry } from "astro:content";
import { getPostLocale, type Locale } from "@/i18n/locales";

export function getPostsByLocale(
  posts: CollectionEntry<"posts">[],
  locale: Locale
): CollectionEntry<"posts">[] {
  return posts.filter(post => getPostLocale(post.id) === locale);
}
