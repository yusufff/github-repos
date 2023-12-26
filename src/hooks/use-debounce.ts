import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

export function useDebounce(callback: (...args: unknown[]) => void) {
  const ref = useRef<(...args: unknown[]) => void>();

  useEffect(() => {
    // we store the callback in a ref so we can use latest callback without triggering a re-render
    ref.current = callback;
  }, [callback]);

  // this useMemo ensures that we only create the debounced function once, notice the empty dependency array
  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
}
