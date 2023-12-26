import { Octokit } from "@octokit/rest";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";

const MyOctokit = Octokit.plugin(retry, throttling);

const myOctokit = new MyOctokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter, options) => {
      myOctokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (options.request.retryCount === 0) {
        // only retries once
        myOctokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (_retryAfter, options, octokit) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `Secondary quota detected for request ${options.method} ${options.url}`
      );
    },
  },
  retry: {
    doNotRetry: ["429"],
  },
});

export function searchRepos({
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
  return myOctokit.search.repos({
    // GitHub API search results are sometimes inconsistent
    // This due to Github's limits about long running queries
    // https://stackoverflow.com/a/56268302
    // https://docs.github.com/en/rest/reference/search#timeouts-and-incomplete-results
    // To improve the results, we can add a qualifier like `stars:>1600`
    // q: `${query} language:${lang} stars:>1600`,
    q: `${query} language:${lang}`,
    sort,
    order,
    per_page,
    page,
  });
}

export type RepoResult = Awaited<
  ReturnType<typeof searchRepos>
>["data"]["items"][number];
