import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchField } from "@/components/ui/search-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImportDisciplesDialog } from "@/features/disciples/import-disciples-dialog";

export const metadata: Metadata = {
  title: "Disciples",
};

export default function DisciplesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <h2 className="font-bold">Disciples</h2>
        <div className="flex items-center gap-3 ml-auto">
          <ImportDisciplesDialog />
          <Button size="sm">Add Disciple</Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SearchField />
      </div>
      <div className="bg-background overflow-hidden flex-1 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-card bg-card">
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <TableRow key={item}>
                <TableCell>
                  <Checkbox id={`table-checkbox-${item}`} />
                </TableCell>
                <TableCell className="font-medium">
                  Name Lastname {item}
                </TableCell>
                <TableCell>email@example.com</TableCell>
                <TableCell>Location Somewhere</TableCell>
                <TableCell>Active</TableCell>
                <TableCell className="text-right">100</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
