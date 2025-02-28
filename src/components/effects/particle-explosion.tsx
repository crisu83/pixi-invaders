import { Graphics, useTick } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useState, useEffect } from "react";
import { Point } from "@/types";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  initialPosition: Point;
};

type ParticleExplosionProps = {
  initialPosition: Point;
  color: number;
};

export function ParticleExplosion({
  initialPosition,
  color,
}: ParticleExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>(() => {
    const count = 16;
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.25 + Math.random() * 2.25;
      const maxLife = 32 + Math.random() * 15;
      return {
        x: initialPosition[0],
        y: initialPosition[1],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: 1.6 + Math.random(),
        initialPosition,
      };
    });
  });

  // Update particle positions when the initial position changes
  useEffect(() => {
    setParticles((currentParticles) =>
      currentParticles.map((p) => ({
        ...p,
        x: p.x - p.initialPosition[0] + initialPosition[0],
        y: p.y - p.initialPosition[1] + initialPosition[1],
        initialPosition,
      }))
    );
  }, [initialPosition]);

  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      particles.forEach((p) => {
        if (p.life <= 0) return;

        const alpha = (p.life / p.maxLife) * 0.8;
        g.beginFill(color, alpha);
        g.drawCircle(p.x, p.y, p.size * alpha);
        g.endFill();
      });
    },
    [particles, color]
  );

  useTick((delta) => {
    setParticles((currentParticles) =>
      currentParticles
        .filter((p) => p.life > 0)
        .map((p) => ({
          ...p,
          x: p.x + p.vx * delta,
          y: p.y + p.vy * delta,
          life: p.life - delta,
        }))
    );
  });

  return <Graphics draw={draw} />;
}
