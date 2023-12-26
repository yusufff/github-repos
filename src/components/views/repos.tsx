import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance } from "date-fns";

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
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    id: "stars",
    accessorKey: "stargazers_count",
    header: ({ column }) => <SortableHeader column={column} title="Stars" />,
  },
  {
    id: "forks",
    accessorKey: "forks_count",
    header: ({ column }) => <SortableHeader column={column} title="Forks" />,
  },
  {
    id: "updated",
    accessorKey: "updated_at",
    header: ({ column }) => (
      <SortableHeader column={column} title="Last Update" />
    ),
    cell: ({ row }) => {
      const updatedAt = new Date(row.original.updated_at);
      const now = new Date();
      return formatDistance(updatedAt, now, { addSuffix: true });
    },
  },
];

export function RepoTable({
  isLoading,
  data,

  searchQuery,
  onSearchQueryChange,
  onSearchQueryBlur,

  language,
  onLanguageChange,

  sorting,
  onSortingChange,

  itemCount,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPaginationChange,
}: {
  isLoading: boolean;
  data: RepoResult[];

  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchQueryBlur: () => void;

  language: "javascript" | "scala" | "python";
  onLanguageChange: (language: string) => void;

  sorting: SortingState;
  onSortingChange: (state: SortingState) => void;

  itemCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPaginationChange: (state: PaginationState) => void;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageSize, pageIndex })
          : updater;
      onPaginationChange(newState);
    },
    onSortingChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange(newState);
    },
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
      <div className="flex items-center justify-between py-4">
        <Input
          autoFocus
          placeholder="Search repositories..."
          value={searchQuery ?? ""}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          onBlur={onSearchQueryBlur}
          className="max-w-sm"
        />
        <Tabs value={language} onValueChange={onLanguageChange}>
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="scala">Scala</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
        </Tabs>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="h-24 flex items-center justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
        <Pagination table={table} itemCount={itemCount} />
      </div>
    </div>
  );
}
