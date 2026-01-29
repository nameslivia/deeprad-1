import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // 在呼叫 intlMiddleware 之前修改 URL
  const url = request.nextUrl.clone();
  url.pathname = "/dashboard/default"; // 修改路徑
  // 或修改其他 URL 屬性
  // url.searchParams.set("key", "value");

  // 使用修改後的 URL 建立新的 request
  const modifiedRequest = new NextRequest(url, request);

  const response = intlMiddleware(modifiedRequest);
  if (response) {
    console.log("***response:", response);

    // const url = request.nextUrl.clone();
    // console.log("***url:", url);
    // url.pathname = "/your/new/path"; // 修改路徑
    // 或者修改其他 URL 屬性
    // url.searchParams.set("key", "value");

    // return NextResponse.redirect(url);
    return response;
  }

  // const url = request.nextUrl.clone();
  // url.pathname = "/dashboard/default";
  // return NextResponse.rewrite(url);

  // return NextResponse.redirect(new URL("/dashboard/default", request.url));
}

export const config = {
  matcher: ["/dashboard", "/"]
};
