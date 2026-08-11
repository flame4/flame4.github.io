import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://flame4.github.io/",
    title: "lewis",
    description: "个人博客——记录、代码与写作。",
    author: "lewis",
    profile: "https://github.com/flame4",
    ogImage: "default-og.jpg",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  // Fill in the URLs below and uncomment the entries you want to show.
  // Twitter uses the existing X icon; Zhihu needs a matching zhihu.svg icon.
  socials: [
    { name: "github", url: "https://github.com/flame4" },
    { name: "x", url: "https://x.com/arknights60", linkTitle: "Twitter" },
    {
      name: "zhihu",
      url: "https://www.zhihu.com/people/chu-shi-ma-huang",
      linkTitle: "知乎",
    },
    { name: "mail", url: "mailto:flame0743@gmail.com", linkTitle: "Email" },
  ],
  shareLinks: [
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
  ],
});
