import { Container, Text, useTick } from "@pixi/react";
import { useEffect, useRef } from "react";
import { useTextStyle } from "../hooks/use-text-style";
import { useCollisionStore } from "../stores/collision-store";
import { Point } from "../types";

type PerformanceStatsProps = {
  renderTick: number;
  position: Point;
  visible: boolean;
};

export function PerformanceStats({
  renderTick,
  position,
  visible,
}: PerformanceStatsProps) {
  const style = useTextStyle({ fontSize: 10 });
  const lastTime = useRef(performance.now());
  const frameCount = useRef(0);
  const updateTime = useRef(0);
  const renderCount = useRef(0);
  const collisionCount = useRef(0);
  const fps = useRef(0);
  const ups = useRef(0);
  const rps = useRef(0);
  const cps = useRef(0);
  const lastRenderTick = useRef(renderTick);
  const rafId = useRef<number>();

  const { checksPerformed } = useCollisionStore();

  // Reset counters when visible is toggled
  useEffect(() => {
    if (!visible) {
      frameCount.current = 0;
      updateTime.current = 0;
      renderCount.current = 0;
      collisionCount.current = 0;
      fps.current = 0;
      ups.current = 0;
      rps.current = 0;
      cps.current = 0;
    }
  }, [visible]);

  // Track React render ticks
  useEffect(() => {
    if (renderTick !== lastRenderTick.current) {
      renderCount.current++;
      lastRenderTick.current = renderTick;
    }
  }, [renderTick]);

  // Track frames using requestAnimationFrame
  useEffect(() => {
    if (!visible) return;

    const countFrame = () => {
      frameCount.current++;
      rafId.current = requestAnimationFrame(countFrame);
    };
    rafId.current = requestAnimationFrame(countFrame);

    return () => {
      if (rafId.current !== undefined) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
    };
  }, [visible]);

  // Track game updates
  useTick((delta) => {
    if (!visible) return;
    updateTime.current += delta;
  });

  // Track collision checks
  useEffect(() => {
    if (!visible) return;
    collisionCount.current = checksPerformed;
  }, [visible, checksPerformed]);

  // Calculate stats
  useEffect(() => {
    if (!visible) return;

    const intervalId = setInterval(() => {
      const time = performance.now();
      const timeDelta = time - lastTime.current;

      fps.current = Math.round((frameCount.current * 1000) / timeDelta);
      ups.current = Math.round((updateTime.current * 1000) / timeDelta);
      rps.current = Math.round((renderCount.current * 1000) / timeDelta);
      cps.current = Math.round(collisionCount.current * (1000 / timeDelta));

      frameCount.current = 0;
      updateTime.current = 0;
      renderCount.current = 0;
      collisionCount.current = 0;
      lastTime.current = time;
    }, 250); // Update 4 times per second

    return () => clearInterval(intervalId);
  }, [visible]);

  return (
    visible && (
      <Container position={position}>
        <Text text={`FPS: ${fps.current}`} style={style} anchor={[1, 0]} />
        <Text
          text={`UPS: ${ups.current}`}
          style={style}
          anchor={[1, 0]}
          y={15}
        />
        <Text
          text={`RPS: ${rps.current}`}
          style={style}
          anchor={[1, 0]}
          y={30}
        />
        <Text
          text={`CPS: ${cps.current}`}
          style={style}
          anchor={[1, 0]}
          y={45}
        />
      </Container>
    )
  );
}
