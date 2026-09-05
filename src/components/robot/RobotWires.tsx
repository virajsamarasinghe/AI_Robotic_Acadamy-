import { useEffect, useMemo } from "react";
import { BoxGeometry, CatmullRomCurve3, Vector3 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

type Point = readonly [number, number, number];

// Ends align with the actual UNO header sockets and L298N control pins.
// Positions are relative to the wire group's assembled height of 1.12.
const wirePaths = [
  { color: "#b24a30", start: [-0.711, 0.28, -0.045], end: [1.199, 0.21, 1.149], arch: 0.82 },
  { color: "#354f70", start: [-0.625, 0.28, -0.045], end: [1.278, 0.21, 1.149], arch: 0.91 },
  { color: "#b89b3c", start: [-0.539, 0.28, -0.045], end: [1.357, 0.21, 1.149], arch: 0.88 },
  { color: "#3d614b", start: [-0.453, 0.28, -0.045], end: [1.436, 0.21, 1.149], arch: 0.77 },
] as const;

function Wire({ color, start, end, arch }: { color: string; start: Point; end: Point; arch: number }) {
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(...start),
    new Vector3(start[0] + 0.04, 0.58, start[2]),
    new Vector3(0.4, arch, 0.32),
    new Vector3(end[0], 0.52, end[2]),
    new Vector3(...end),
  ]), [start, end, arch]);

  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 32, 0.014, 6, false]} />
      <meshStandardMaterial color={color} roughness={0.52} />
    </mesh>
  );
}

export default function JumperWires() {
  const connectors = useMemo(() => {
    const shapes = wirePaths.flatMap(({ start, end }) => [start, end].map(([x, y, z]) =>
      new BoxGeometry(0.058, 0.13, 0.06).translate(x, y - 0.065, z),
    ));
    const geometry = mergeGeometries(shapes)!;
    shapes.forEach((shape) => shape.dispose());
    const pins = wirePaths.map(({ start: [x, y, z] }) => new BoxGeometry(0.017, 0.09, 0.017).translate(x, y - 0.155, z));
    const pinGeometry = mergeGeometries(pins)!;
    pins.forEach((shape) => shape.dispose());
    return { geometry, pinGeometry };
  }, []);

  useEffect(() => () => {
    connectors.geometry.dispose();
    connectors.pinGeometry.dispose();
  }, [connectors]);

  return (
    <group>
      {wirePaths.map((wire) => <Wire key={wire.color} {...wire} />)}
      <mesh geometry={connectors.geometry} castShadow>
        <meshStandardMaterial color="#1a1b1c" roughness={0.64} />
      </mesh>
      <mesh geometry={connectors.pinGeometry}>
        <meshStandardMaterial color="#b7b6a5" metalness={0.82} roughness={0.3} />
      </mesh>
    </group>
  );
}
