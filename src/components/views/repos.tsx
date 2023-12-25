import { useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortableHeader } from "@/components/sortable-header";
import { Pagination } from "@/components/pagination";

import { RepoResult } from "@/services/gh";

const columns: ColumnDef<RepoResult>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Button asChild variant="link" size="sm" className="px-0">
        <a href={row.original.html_url} target="_blank">
          {row.getValue("id")}
        </a>
      </Button>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      const ownerName = row.original.owner?.login || "";
      const ownerUrl = row.original.owner?.html_url || "";
      const repoName = row.original.name || "";
      const repoUrl = row.original.html_url || "";

      return (
        <div>
          <Button asChild variant="ghost" size="sm" className="px-1">
            <a href={ownerUrl} target="_blank">
              {ownerName}
            </a>
          </Button>
          <span>/</span>
          <Button asChild variant="ghost" size="sm" className="px-1">
            <a href={repoUrl} target="_blank">
              {repoName}
            </a>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "stargazers_count",
    header: ({ column }) => <SortableHeader column={column} title="Stars" />,
  },
  {
    accessorKey: "forks_count",
    header: ({ column }) => <SortableHeader column={column} title="Forks" />,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <SortableHeader column={column} title="Last Update" />
    ),
  },
];

export function RepoTable({
  data,

  searchQuery,
  onSearchQueryChange,

  pageCount,
  itemCount,
  pageIndex,
  pageSize,
  onPageSizeChange,
}: {
  data: RepoResult[];

  searchQuery: string;
  onSearchQueryChange: (query: string) => void;

  pageCount: number;
  itemCount: number;
  pageIndex: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: ({ pageSize }) => {
      a;
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search repositories..."
          value={searchQuery ?? ""}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="space-x-2 py-4">
        <Pagination table={table} />
      </div>
    </div>
  );
}
