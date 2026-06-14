"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   CENTRAL: Robot Head — blinks, looks side to side
   ═══════════════════════════════════════════════════ */
function RobotHead() {
  const head   = useRef<THREE.Group>(null);
  const eyeL   = useRef<THREE.Mesh>(null);
  const eyeR   = useRef<THREE.Mesh>(null);
  const antTip = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (head.current) head.current.rotation.y = Math.sin(t * 0.45) * 0.35;
    // Blink
    const blink = Math.sin(t * 2.8) > 0.93 ? 0.08 : 1;
    if (eyeL.current) eyeL.current.scale.y = blink;
    if (eyeR.current) eyeR.current.scale.y = blink;
    // Antenna tip pulse
    if (antTip.current) {
      const mat = antTip.current.material as THREE.MeshBasicMaterial;
      mat.color.setHSL(0.13, 1, 0.5 + Math.sin(t * 3) * 0.15);
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.06} floatIntensity={0.32}>
      <group ref={head}>
        {/* ── Head body ── */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshStandardMaterial color="#1e40af" metalness={0.88} roughness={0.12} />
        </mesh>
        {/* Top panel */}
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[1.58, 0.1, 1.58]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* ── Visor background ── */}
        <mesh position={[0, 0.2, 0.91]}>
          <boxGeometry args={[1.42, 0.56, 0.03]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* ── Eyes ── */}
        <mesh ref={eyeL} position={[-0.38, 0.2, 0.93]}>
          <boxGeometry args={[0.36, 0.29, 0.02]} />
          <meshBasicMaterial color="#00ff99" />
        </mesh>
        <mesh ref={eyeR} position={[0.38, 0.2, 0.93]}>
          <boxGeometry args={[0.36, 0.29, 0.02]} />
          <meshBasicMaterial color="#00ff99" />
        </mesh>
        {/* Eye glow halos */}
        <mesh position={[-0.38, 0.2, 0.91]}>
          <boxGeometry args={[0.5, 0.4, 0.01]} />
          <meshBasicMaterial color="#00ff99" transparent opacity={0.1} />
        </mesh>
        <mesh position={[0.38, 0.2, 0.91]}>
          <boxGeometry args={[0.5, 0.4, 0.01]} />
          <meshBasicMaterial color="#00ff99" transparent opacity={0.1} />
        </mesh>
        {/* ── Mouth LED strip ── */}
        <mesh position={[0, -0.28, 0.91]}>
          <boxGeometry args={[0.92, 0.1, 0.02]} />
          <meshBasicMaterial color="#1d4ed8" />
        </mesh>
        {[-0.32, -0.16, 0, 0.16, 0.32].map((x, i) => (
          <mesh key={i} position={[x, -0.28, 0.92]}>
            <boxGeometry args={[0.08, 0.07, 0.01]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#60a5fa" : "#93c5fd"} />
          </mesh>
        ))}
        {/* ── Antennae ── */}
        <mesh position={[0, 1.06, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.48, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh ref={antTip} position={[0, 1.33, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* ── Ear panels ── */}
        <mesh position={[-0.96, 0.08, 0]}>
          <boxGeometry args={[0.11, 0.72, 0.72]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.96, 0.08, 0]}>
          <boxGeometry args={[0.11, 0.72, 0.72]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Ear indicator lights */}
        {[-0.3, 0, 0.3].map((z, i) => (
          <mesh key={i} position={[-0.93, 0.08, z * 0.4]}>
            <boxGeometry args={[0.03, 0.1, 0.07]} />
            <meshBasicMaterial color={["#22d3ee", "#a78bfa", "#34d399"][i]} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ═══════════════════════════════
   ORBIT 1: Spinning Gear (Mechanical Design)
   ═══════════════════════════════ */
function Gear() {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (spin.current) spin.current.rotation.z += dt * 1.1; });
  const TEETH = 10;
  return (
    <group scale={0.6}>
      <group ref={spin}>
        {/* Ring */}
        <mesh>
          <torusGeometry args={[0.54, 0.1, 8, 26]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.25} metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Spokes × 4 */}
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} rotation={[0, 0, (i / 4) * Math.PI * 2]}>
            <boxGeometry args={[0.065, 0.46, 0.065]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}
        {/* Teeth */}
        {Array.from({ length: TEETH }).map((_, i) => {
          const a = (i / TEETH) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.64, Math.sin(a) * 0.64, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.12, 0.16, 0.12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* ═══════════════════════════════
   ORBIT 2: Arduino Board (IoT & Coding)
   ═══════════════════════════════ */
function ArduinoBoard() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.6; });
  return (
    <group ref={ref} scale={0.52}>
      {/* PCB */}
      <mesh>
        <boxGeometry args={[1.1, 0.07, 0.72]} />
        <meshStandardMaterial color="#16a34a" roughness={0.55} metalness={0.12} />
      </mesh>
      {/* Mounting holes */}
      {[[-0.46, 0.05, 0.3], [0.46, 0.05, 0.3], [-0.46, 0.05, -0.3], [0.46, 0.05, -0.3]].map(([x, y, z], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
          <meshStandardMaterial color="#052e16" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
      {/* CPU chip */}
      <mesh position={[0.08, 0.07, 0]}>
        <boxGeometry args={[0.32, 0.06, 0.32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Chip circuit lines */}
      {[-1, 0, 1].map(i => (
        <mesh key={i} position={[0.08, 0.1, i * 0.07]}>
          <boxGeometry args={[0.28, 0.01, 0.012]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Pin header rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.08, 0.08, 0.36]}>
          <boxGeometry args={[0.028, 0.14, 0.028]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.08, 0.08, -0.36]}>
          <boxGeometry args={[0.028, 0.14, 0.028]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}
      {/* Status LEDs */}
      <mesh position={[-0.38, 0.09, 0.22]}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      <mesh position={[-0.38, 0.09, 0.1]}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* USB port */}
      <mesh position={[0.54, 0.07, 0]}>
        <boxGeometry args={[0.09, 0.13, 0.24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0.555, 0.07, 0]}>
        <boxGeometry args={[0.01, 0.09, 0.18]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      {/* Power connector */}
      <mesh position={[0.52, 0.07, -0.27]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 10]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════
   ORBIT 3: Ultrasonic Sensor (Robotics)
   ═══════════════════════════════ */
function UltrasonicSensor() {
  const ref  = useRef<THREE.Group>(null);
  const wavL = useRef<THREE.Mesh>(null);
  const wavR = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.4;
    const ping = (Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2;
    if (wavL.current) { (wavL.current.material as THREE.MeshBasicMaterial).opacity = ping * 0.55; wavL.current.scale.setScalar(1 + ping * 0.4); }
    if (wavR.current) { (wavR.current.material as THREE.MeshBasicMaterial).opacity = ping * 0.55; wavR.current.scale.setScalar(1 + ping * 0.4); }
  });
  return (
    <group ref={ref} scale={0.58}>
      {/* PCB body */}
      <mesh>
        <boxGeometry args={[0.8, 0.28, 0.44]} />
        <meshStandardMaterial color="#0891b2" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Label */}
      <mesh position={[0.02, 0.11, 0.23]}>
        <boxGeometry args={[0.62, 0.06, 0.01]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.45} />
      </mesh>
      {/* Left eye (emitter) */}
      <mesh position={[0.19, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.2, 16]} />
        <meshStandardMaterial color="#0c4a6e" metalness={0.88} roughness={0.1} />
      </mesh>
      <mesh position={[0.19, 0, 0.37]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.115, 0.02, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>
      {/* Right eye (receiver) */}
      <mesh position={[-0.19, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.2, 16]} />
        <meshStandardMaterial color="#0c4a6e" metalness={0.88} roughness={0.1} />
      </mesh>
      <mesh position={[-0.19, 0, 0.37]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.115, 0.02, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>
      {/* Sonar ping waves */}
      <mesh ref={wavL} position={[0.19, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.015, 6, 20]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>
      <mesh ref={wavR} position={[-0.19, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.015, 6, 20]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>
      {/* Pins (4) */}
      {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
        <mesh key={i} position={[x, -0.21, -0.09]}>
          <cylinderGeometry args={[0.022, 0.022, 0.17, 6]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════
   ORBIT 4: Neural Network (AI)
   ═══════════════════════════════ */
function NeuralNetwork() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.55;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.18;
    }
  });
  const NODES = useMemo<[number, number, number][]>(() => [
    [-0.52,  0.28, 0], // 0 input
    [-0.52, -0.28, 0], // 1 input
    [ 0,    0.42, 0],  // 2 hidden
    [ 0,    0,    0],  // 3 hidden (center)
    [ 0,   -0.42, 0],  // 4 hidden
    [ 0.52, 0.2,  0],  // 5 output
    [ 0.52,-0.2,  0],  // 6 output
  ], []);
  const CONNECTIONS = [[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,5],[2,6],[3,5],[3,6],[4,5],[4,6]];
  const linePositions = useMemo(() => {
    const pts: number[] = [];
    CONNECTIONS.forEach(([a, b]) => pts.push(...NODES[a], ...NODES[b]));
    return new Float32Array(pts);
  }, [NODES]);
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  return (
    <group ref={ref} scale={0.72}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.38} />
      </lineSegments>
      {/* Nodes */}
      {NODES.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i === 3 ? 0.13 : 0.095, 10, 10]} />
          <meshStandardMaterial
            color={i < 2 ? "#7c3aed" : i < 5 ? "#a78bfa" : "#4c1d95"}
            emissive={i < 2 ? "#5b21b6" : i < 5 ? "#7c3aed" : "#3b0764"}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      ))}
      {/* Outer glow on center node */}
      <mesh position={NODES[3]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════
   ORBIT 5: WiFi Signal (IoT)
   ═══════════════════════════════ */
function WiFiSignal() {
  const ref = useRef<THREE.Group>(null);
  const arcs = useRef<THREE.Mesh[]>([]);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.1) * 0.18;
    const t = state.clock.elapsedTime;
    arcs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.abs(Math.sin(t * 1.8 - i * 0.5)) * 0.5;
    });
  });
  return (
    <group ref={ref} scale={0.62}>
      {[0.25, 0.42, 0.6].map((r, i) => (
        <mesh key={i} ref={el => { if (el) arcs.current[i] = el; }} rotation={[0, 0, -Math.PI / 2]} position={[0, r * 0.08, 0]}>
          <torusGeometry args={[r, 0.038, 8, 22, Math.PI]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.4} roughness={0.2} metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, -0.11, 0]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════
   ORBIT 6: LED (Electronics)
   ═══════════════════════════════ */
function LED() {
  const glow = useRef<THREE.Mesh>(null);
  const dome = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const pulse = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 2.4)) * 0.5;
    if (glow.current) (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + pulse * 0.18;
    if (dome.current) (dome.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse * 0.6;
  });
  return (
    <group scale={0.65}>
      {/* Lead wire */}
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.3, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Body cylinder */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 10]} />
        <meshStandardMaterial color="#14532d" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Dome */}
      <mesh ref={dome} position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.9} roughness={0.12} metalness={0.1} />
      </mesh>
      {/* Flat dome base ring */}
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.015, 8, 20]} />
        <meshStandardMaterial color="#15803d" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Glow sphere */}
      <mesh ref={glow} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.32, 10, 10]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════
   Orbital wrapper — any component orbits
   ═══════════════════════════════════ */
type OrbitalProps = {
  children: React.ReactNode;
  radius: number;
  speed: number;
  yOffset: number;
  initAngle: number;
};

function Orbital({ children, radius, speed, yOffset, initAngle }: OrbitalProps) {
  const ref = useRef<THREE.Group>(null);
  const ang = useRef(initAngle);
  useFrame((_, dt) => {
    ang.current += dt * speed;
    if (!ref.current) return;
    ref.current.position.x = Math.cos(ang.current) * radius;
    ref.current.position.z = Math.sin(ang.current) * radius;
    ref.current.position.y = yOffset + Math.sin(ang.current * 2.1) * 0.38;
  });
  return <group ref={ref}>{children}</group>;
}

/* ═══════════════════════════════
   Orbital ring decorations
   ═══════════════════════════════ */
function Rings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (r1.current) r1.current.rotation.z += dt * 0.2;
    if (r2.current) r2.current.rotation.z -= dt * 0.14;
    if (r3.current) r3.current.rotation.x += dt * 0.16;
  });
  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.0, 0.022, 6, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[3.45, 0.017, 6, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
      <mesh ref={r3} rotation={[0, Math.PI / 4, Math.PI / 5]}>
        <torusGeometry args={[3.8, 0.012, 6, 100]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.28} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════
   Full scene
   ═══════════════════════════════ */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[5,  5, 4]}  color="#60a5fa" intensity={5} />
      <pointLight position={[-5,-4, 2]}  color="#a78bfa" intensity={4} />
      <pointLight position={[0,  0, 7]}  color="#ffffff" intensity={1.5} />
      <pointLight position={[3, -3, -2]} color="#34d399" intensity={2} />

      <RobotHead />
      <Rings />

      <Orbital radius={3.05} speed={ 0.48} yOffset={ 0.3}  initAngle={0}>               <Gear />              </Orbital>
      <Orbital radius={3.55} speed={-0.36} yOffset={-0.2}  initAngle={1.05}>             <ArduinoBoard />      </Orbital>
      <Orbital radius={2.82} speed={ 0.58} yOffset={ 0.45} initAngle={2.1}>              <UltrasonicSensor />  </Orbital>
      <Orbital radius={3.72} speed={-0.40} yOffset={ 0.05} initAngle={3.14}>             <NeuralNetwork />     </Orbital>
      <Orbital radius={3.22} speed={ 0.52} yOffset={-0.4}  initAngle={4.19}>             <WiFiSignal />        </Orbital>
      <Orbital radius={2.95} speed={-0.46} yOffset={ 0.22} initAngle={5.24}>             <LED />               </Orbital>

      <Sparkles count={110} scale={14} size={1.1} speed={0.28} color="#bfdbfe" noise={0.6} />
    </>
  );
}

/* ═══════════════════════════════
   Canvas export
   ═══════════════════════════════ */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 48 }}
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
