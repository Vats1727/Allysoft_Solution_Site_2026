import { useLayoutEffect, useRef } from "react";
import { reveal } from "../lib/motion";

export default function Reveal({ children, className = "", as: Tag = "div", ...opts }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const tween = reveal(ref.current, opts);
    return () => tween?.scrollTrigger?.kill();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
