import { generateMeta } from "@/lib/utils";
import { FileManager } from "@/app/[locale]/dashboard/(auth)/file-manager/components/file-manager";

export async function generateMetadata() {
  return generateMeta({
    title: "Library",
    description: "Manage your uploaded files, organize content and control access",
    canonical: "/apps/file-manager"
  });
}

export default function Page() {
  return <FileManager />;
}
