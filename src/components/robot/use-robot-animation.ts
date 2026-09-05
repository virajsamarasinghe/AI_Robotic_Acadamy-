import { useFrame, useThree } from "@react-three/fiber";
import { useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { Group, MathUtils } from "three";
import { robotMotionConfig } from "./robot-motion";
import type { RobotPartId, RobotProgress } from "./robot-types";

const animationParts = robotMotionConfig.map((config) => ({
  ...config,
  parent: config.follows ? robotMotionConfig.find((part) => part.id === config.follows) : undefined,
}));

function phaseAmount(progress: number, [start, end]: readonly [number, number]) {
  const t = MathUtils.clamp((progress - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Demand rendering; the scroll path only mutates existing Three transforms. */
export function useRobotAnimation(progress: RobotProgress, reduceMotion: boolean) {
  const worldRef = useRef<Group>(null);
  const partRefs = useRef<Partial<Record<RobotPartId, Group | null>>>({});
  const previousProgress = useRef(Number.NaN);
  const requestedProgress = useRef(Number.NaN);
  const invalidate = useThree((state) => state.invalidate);
  const registerPart = useCallback((id: RobotPartId, group: Group | null) => {
    partRefs.current[id] = group;
  }, []);

  // Do not pass the numeric Motion value into R3F's optional frame-count argument.
  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion) return;
    const next = MathUtils.clamp(latest, 0, 1);
    if (Math.abs(next - requestedProgress.current) < 0.0001) return;
    requestedProgress.current = next;
    invalidate();
  });

  useEffect(() => {
    previousProgress.current = Number.NaN;
    requestedProgress.current = reduceMotion ? 0 : MathUtils.clamp(progress.get(), 0, 1);
    invalidate();
  }, [progress, reduceMotion, invalidate]);

  useFrame(() => {
    const p = reduceMotion ? 0 : MathUtils.clamp(progress.get(), 0, 1);
    if (p === previousProgress.current) return;
    previousProgress.current = p;
    const world = worldRef.current;
    if (world) {
      world.rotation.y = -0.38 + p * Math.PI * 2;
      world.scale.setScalar(MathUtils.lerp(1.34, 0.82, MathUtils.smoothstep(p, 0, 0.45)));
    }

    for (const part of animationParts) {
      const group = partRefs.current[part.id];
      if (!group) continue;
      const amount = phaseAmount(p, part.phase);
      const parentAmount = part.parent ? phaseAmount(p, part.parent.phase) : 0;
      group.position.set(
        part.basePosition[0] + (part.position?.[0] ?? 0) * amount + (part.parent?.position?.[0] ?? 0) * parentAmount,
        part.basePosition[1] + (part.position?.[1] ?? 0) * amount + (part.parent?.position?.[1] ?? 0) * parentAmount,
        part.basePosition[2] + (part.position?.[2] ?? 0) * amount + (part.parent?.position?.[2] ?? 0) * parentAmount,
      );
      group.rotation.set(
        (part.rotation?.[0] ?? 0) * amount,
        (part.rotation?.[1] ?? 0) * amount,
        (part.rotation?.[2] ?? 0) * amount,
      );
    }
  });

  return { worldRef, registerPart };
}
