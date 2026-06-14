"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Knot() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.55;
    ref.current.rotation.y += dt * 0.80;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.04;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.1, 0.32, 120, 18]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#1d4ed8"
        emissiveIntensity={0.55}
        roughness={0.08}
        metalness={0.9}
      />
    </mesh>
  );
}

function FloatingRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (r1.current) r1.current.rotation.z += dt * 0.6;
    if (r2.current) r2.current.rotation.x -= dt * 0.5;
  });

  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 6, 80]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.45} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <torusGeometry args={[2.6, 0.016, 6, 80]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3,  3, 3]}  color="#3b82f6" intensity={6} />
      <pointLight position={[-3,-3, 3]}  color="#8b5cf6" intensity={5} />
      <pointLight position={[0,  0, 5]}  color="#ffffff" intensity={1.5} />
      <Knot />
      <FloatingRings />
      <Sparkles count={70} scale={10} size={1.5} speed={0.5} color="#93c5fd" noise={0.4} />
    </>
  );
}

export default function LoadingCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 52 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
