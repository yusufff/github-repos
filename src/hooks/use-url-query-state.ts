import { z, ZodSchema } from "zod";
import queryString from "query-string";
import { useCallback, useState } from "react";

export function useURLQueryState<TSchema extends ZodSchema>(
  defaultSchema: TSchema
) {
  const [state, setState] = useState<z.infer<typeof defaultSchema>>(
    defaultSchema.parse(queryString.parse(window.location.search))
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
    },
    [state]
  );

  return [state, setQueryState] as const;
}
