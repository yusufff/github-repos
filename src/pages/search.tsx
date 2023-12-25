import { RepoTable } from "@/components/views/repos";
import { useSearchRepos } from "@/services/queries";

export default function Search() {
  const { data: searchResult } = useSearchRepos({
    query: "react",
  });

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
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
        <RepoTable data={searchResult?.data?.items || []} />
      </div>
    </div>
  );
}
