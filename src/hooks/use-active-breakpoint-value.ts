import { useEffect, useState } from "react";

export const breakpoints = {
  xs: 512,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1400,
};
export type Breakpoint = keyof typeof breakpoints;

const getActiveBreakpointValue = () => {
  const windowWidth = window.innerWidth;
  return (
    Object.values(breakpoints)
      .reverse()
      .find((value) => windowWidth >= value) || 0
  );
};

export default function useActiveBreakpointValue() {
  const [activeBreakpoint, setActiveBreakpoint] = useState(
    getActiveBreakpointValue()
  );

  useEffect(() => {
    const resizeHandler = () => {
      setActiveBreakpoint(getActiveBreakpointValue());
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return activeBreakpoint;
}
