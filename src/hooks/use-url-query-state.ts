import { z, ZodSchema } from "zod";
import queryString from "query-string";
import { useCallback, useState } from "react";

const localStorageKey = "github-repos-state";

// This hooks allows you to store state in the URL.
// It takes a Zod schema as an argument to validate the URL query.
// The state is automatically parsed from the URL query,
// And automatically stringified to update the URL query.
// It also optionally persists the state in local storage.
export function useURLQueryState<TSchema extends ZodSchema>(
  defaultSchema: TSchema,
  options: { persistInLocalStorage?: boolean } = {}
) {
  const { persistInLocalStorage } = options;

  const [state, setState] = useState<z.infer<typeof defaultSchema>>(
    defaultSchema.parse(
      queryString.parse(
        window.location.search ||
          (persistInLocalStorage
            ? window.localStorage.getItem(localStorageKey)
            : "") ||
          ""
      )
    )
  );

  const setQueryState = useCallback(
    (updater: (prevState: typeof state) => typeof state) => {
      const newState = updater(state);
      setState(newState);
      const newQuery = queryString.stringify(newState);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${newQuery}`
      );
      if (persistInLocalStorage) {
        window.localStorage.setItem(localStorageKey, newQuery);
      }
    },
    [state, persistInLocalStorage]
  );

  return [state, setQueryState] as const;
}
