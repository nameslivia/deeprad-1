"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";

export function FilesUploadedCard() {
    const filesUploaded = 42;
    const changeFromLastMonth = 8;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Files Uploaded This Month</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="font-display text-3xl leading-6">{filesUploaded}</div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                    <FileUp className="h-3 w-3 text-green-600 dark:text-green-500" />
                    <span className="text-green-600 dark:text-green-500">
                        +{changeFromLastMonth} from last month
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
