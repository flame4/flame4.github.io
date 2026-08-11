import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/locales";
import { useTranslations } from "@/i18n";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import config from "@/config";

export async function createRss(locale: Locale) {
  const posts = getPostsByLocale(await getCollection("posts"), locale);
  const sortedPosts = getSortedPosts(posts);
  const t = useTranslations(locale);

  return rss({
    title: config.site.title,
    description: t.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, locale),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
