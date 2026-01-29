// src/i18n/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing"; // 你的 routing 設定檔

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
