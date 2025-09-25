"use client";

import { format } from "date-fns";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { removeUnderscores } from "@/lib/utils";
import type { DiscipleRecord } from "@/types/globals";

export function ExportDisciplesButton({ data }: { data: DiscipleRecord[] }) {
  function handleExportToXLSX() {
    try {
      const rows = data.map((d) => ({
        Name: d.name,
        Address: d.address,
        Birthdate: d.birthdate
          ? format(new Date(d.birthdate), "yyyy-MM-dd")
          : "--",
        Gender: d.gender,
        "Member Type": removeUnderscores(d.memberType).toUpperCase(),
        "Network Leader": d.leader?.name ?? "N/A",
        "Cell Status": removeUnderscores(d.cellStatus).toUpperCase(),
        "Church Status": removeUnderscores(d.churchStatus).toUpperCase(),
        "Process Level": removeUnderscores(d.processLevel).toUpperCase(),
        "Process Status": removeUnderscores(d.processLevelStatus).toUpperCase(),
        "Handled By": d.handledBy?.name ?? "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      const columnKeys = Object.keys(rows[0] || {});

      const columnWidths = columnKeys.map((key) => {
        const maxWidth = rows.reduce(
          (w, r) =>
            Math.max(w, String(r[key as keyof (typeof rows)[number]]).length),
          10,
        );
        return { wch: maxWidth + 4 };
      });

      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Disciples");

      XLSX.writeFile(workbook, "Disciples.xlsx", { compression: true });

      toast.success("Export successful!");
    } catch (error) {
      console.log(`Error exporting disciple data: `, error);
      toast.error(`Error exporting disciple data`);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondaryOutline"
      disabled={data.length === 0}
      onClick={handleExportToXLSX}
    >
      Export <DownloadIcon />
    </Button>
  );
}
