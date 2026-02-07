import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const InteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number>(0);
  const isDarkRef = useRef(false);

  const PARTICLE_COUNT = 80;
  const MOUSE_RADIUS = 200;
  const RETURN_SPEED = 0.015;
  const MOUSE_FORCE = 0.08;

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.5 ? 24 : 172, // primary orange or accent teal
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const checkTheme = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    checkTheme();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dark = isDarkRef.current;

      particlesRef.current.forEach((p, i) => {
        // Distance to mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Mouse attraction / push
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          // Alternate between attract and repel for organic feel
          const direction = i % 3 === 0 ? -1 : 0.6;
          p.vx += Math.cos(angle) * force * MOUSE_FORCE * direction;
          p.vy += Math.sin(angle) * force * MOUSE_FORCE * direction;
        }

        // Drift back to base position
        p.vx += (p.baseX - p.x) * RETURN_SPEED;
        p.vy += (p.baseY - p.y) * RETURN_SPEED;

        // Gentle ambient drift
        p.vx += Math.sin(time * 0.005 + i) * 0.01;
        p.vy += Math.cos(time * 0.004 + i * 0.7) * 0.01;

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Pulse glow
        const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase);
        const glowIntensity = dist < MOUSE_RADIUS ? 0.6 + (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.4 : 0.3 + pulse * 0.15;
        const currentSize = p.size + pulse * 0.8;

        // Draw glow
        const saturation = dark ? "90%" : "70%";
        const lightness = dark ? "60%" : "55%";
        const glowAlpha = glowIntensity * (dark ? 0.5 : 0.35);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 6);
        gradient.addColorStop(0, `hsla(${p.hue}, ${saturation}, ${lightness}, ${glowAlpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, ${saturation}, ${lightness}, ${glowAlpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${p.hue}, ${saturation}, ${lightness}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${saturation}, ${dark ? "75%" : "65%"}, ${glowIntensity})`;
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * (dark ? 0.12 : 0.08);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${a.hue}, 60%, ${dark ? "55%" : "50%"}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default InteractiveParticles;
