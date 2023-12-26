import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { searchRepos } from "@/services/gh";

export function useSearchRepos({
  query,
  lang = "javascript",
  sort = "stars",
  order = "desc",
  per_page = 10,
  page = 1,
}: {
  query: string;
  lang?: "javascript" | "scala" | "python";
  sort?: "stars" | "forks" | "updated";
  order?: "desc" | "asc";
  per_page?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["searchRepos", query, lang, sort, order, per_page, page],
    queryFn: () => searchRepos({ query, lang, sort, order, per_page, page }),
    staleTime: 10000,
    placeholderData: keepPreviousData,
  });
}
