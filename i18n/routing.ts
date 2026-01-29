export const routing = {
  locales: ["en", "zh-TW"] as const,
  // 瀏覽器語言是 zh-TW,就會自動使用繁體中文
  localeDetection: false,
  defaultLocale: "en" as const,
  // 所有語言都使用相同的路由路徑
  pathnames: {
    "/": "/",
    "/dashboard": "/dashboard",
    "/communities": "/communities",
    "/chat": "/chat"
  }
};
