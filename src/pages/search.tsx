import { useCallback, useState } from "react";
import { z } from "zod";

import { RepoTable } from "@/components/views/repos";
import { useURLQueryState } from "@/hooks/use-url-query-state";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchRepos } from "@/services/queries";
import { PaginationState, SortingState } from "@tanstack/react-table";

export default function Search() {
  // I like to use URL query params for state management
  // so that the user can easily share the current state
  const [params, setParams] = useURLQueryState(
    z.object({
      page: z.coerce.number().min(1).optional().default(1),
      per_page: z.coerce.number().min(1).max(100).optional().default(10),
      sort: z
        .enum(["stars", "forks", "updated"])
        .optional()
        .default("stars")
        .catch("stars"),
      order: z.enum(["desc", "asc"]).optional().default("desc").catch("desc"),
      lang: z
        .enum(["javascript", "scala", "python"])
        .optional()
        .default("javascript")
        .catch("javascript"),
      q: z.coerce.string().optional().default("react"),
    }),
    { persistInLocalStorage: true }
  );

  const {
    data: searchResult,
    isLoading,
    isPlaceholderData,
  } = useSearchRepos({
    page: params.page,
    per_page: params.per_page,
    sort: params.sort,
    order: params.order,
    lang: params.lang,
    query: params.q,
  });

  const [searchQuery, setSearchQuery] = useState(params.q);
  const debouncedSetQuery = useDebounce(() => {
    setParams((prev) => ({ ...prev, q: searchQuery }));
  });

  const handleSortingChange = useCallback(
    (state: SortingState) => {
      const [sorting] = state;
      if (!sorting) return;
      setParams((prev) => ({
        ...prev,
        sort: sorting.id as typeof prev.sort,
        order: sorting.desc ? "desc" : "asc",
      }));
    },
    [setParams]
  );

  const handlePaginationChange = useCallback(
    (state: PaginationState) => {
      setParams((prev) => ({
        ...prev,
        page: state.pageIndex + 1,
        per_page: state.pageSize,
      }));
    },
    [setParams]
  );

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome to GitHub Repo Search!
          </h2>
          <p className="text-muted-foreground">
            Search for a repo in the search bar for your favorite language!
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <RepoTable
          isLoading={isLoading || isPlaceholderData}
          data={searchResult?.data?.items || []}
          searchQuery={searchQuery}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            debouncedSetQuery();
          }}
          onSearchQueryBlur={() => {
            setParams((prev) => ({ ...prev, q: searchQuery }));
          }}
          language={params.lang}
          onLanguageChange={(value) => {
            setParams((prev) => ({
              ...prev,
              lang: value as typeof params.lang,
            }));
          }}
          sorting={[{ id: params.sort, desc: params.order === "desc" }]}
          onSortingChange={handleSortingChange}
          itemCount={searchResult?.data?.total_count || 0}
          pageCount={
            searchResult?.data?.total_count
              ? Math.min(
                  Math.ceil(searchResult.data.total_count / params.per_page),
                  Math.ceil(1000 / params.per_page)
                )
              : 0
          }
          pageIndex={params.page - 1}
          pageSize={params.per_page}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
