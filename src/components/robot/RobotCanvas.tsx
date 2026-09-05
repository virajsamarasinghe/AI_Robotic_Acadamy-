"use client";

import { createRoot, extend, useThree } from "@react-three/fiber";
import type { Catalogue } from "@react-three/fiber";
import { memo, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { RobotProgress } from "./robot-types";
import RobotWorld from "./RobotModel";

extend(THREE as unknown as Catalogue);

type RobotCanvasProps = {
  progress: RobotProgress;
  reduceMotion: boolean;
  onContextLost?: () => void;
  onReady?: () => void;
};

function WebGLContextMonitor({ onContextLost }: { onContextLost?: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      // R3F intentionally releases an old context during React Strict Mode and
      // Fast Refresh. Only use the static fallback when the active, connected
      // canvas is still lost after the browser has had a chance to restore it.
      fallbackTimer = setTimeout(() => {
        const context = gl.getContext();
        if (canvas.isConnected && context.isContextLost()) onContextLost?.();
      }, 1200);
    };
    const handleContextRestored = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored, false);
    };
  }, [gl, onContextLost]);

  return null;
}

function CameraSetup({ onReady }: { onReady?: () => void }) {
  const { camera, invalidate } = useThree();

  useEffect(() => {
    camera.position.set(7.4, 6.1, 9.4);
    camera.lookAt(0, 0.65, 0);
    camera.updateProjectionMatrix();
    invalidate();
    onReady?.();
  }, [camera, invalidate, onReady]);

  return null;
}

function StableCanvas({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!rootRef.current) {
      const rect = canvas.getBoundingClientRect();
      const highQuality = rect.width >= 640;
      rootRef.current = createRoot(canvas);
      void rootRef.current.configure({
        shadows: highQuality ? "percentage" : false,
        dpr: [1, 1.25],
        frameloop: "demand",
        camera: { position: [7.4, 6.1, 9.4], fov: 38, near: 0.1, far: 100 },
        gl: { antialias: true, alpha: true, powerPreference: "high-performance" },
        size: { width: rect.width, height: rect.height, top: 0, left: 0 },
      });
    }
    rootRef.current.render(children);
  });

  useEffect(() => {
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => {
      if (!canvas || !rootRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const highQuality = rect.width >= 640;
      void rootRef.current.configure({
        shadows: highQuality ? "percentage" : false,
        frameloop: "demand",
        dpr: [1, 1.25],
        size: { width: rect.width, height: rect.height, top: 0, left: 0 },
      });
    });
    if (canvas) observer.observe(canvas);

    return () => {
      observer.disconnect();
      // React development mode immediately remounts effects once. Deferring
      // disposal lets that remount cancel cleanup and keep the active context.
      cleanupTimer.current = setTimeout(() => {
        rootRef.current?.unmount();
        rootRef.current = null;
      }, 100);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function RobotCanvas({ progress, reduceMotion, onContextLost, onReady }: RobotCanvasProps) {
  return (
    <StableCanvas>
      <WebGLContextMonitor onContextLost={onContextLost} />
      <CameraSetup onReady={onReady} />
      <RobotWorld progress={progress} reduceMotion={reduceMotion} />
    </StableCanvas>
  );
}

export default memo(RobotCanvas);
