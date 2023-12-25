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
    onSecondaryRateLimit: (retryAfter, options, octokit) => {
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
  lang?: "javascript" | "scale" | "python";
  sort?: "stars" | "forks" | "updated";
  order?: "desc" | "asc";
  per_page?: number;
  page?: number;
}) {
  return myOctokit.search.repos({
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
