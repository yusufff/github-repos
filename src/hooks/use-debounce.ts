import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

export function useDebounce(callback: (...args: unknown[]) => void) {
  const ref = useRef<(...args: unknown[]) => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
}
