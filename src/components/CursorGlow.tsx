import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty("--glow-x", `${e.clientX}px`);
        glowRef.current.style.setProperty("--glow-y", `${e.clientY}px`);
        glowRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), hsl(24 95% 55% / 0.07), hsl(172 60% 42% / 0.04) 40%, transparent 70%)",
      }}
    />
  );
};

export default CursorGlow;
