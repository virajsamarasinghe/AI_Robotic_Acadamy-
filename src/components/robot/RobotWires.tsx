import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

type Point = readonly [number, number, number];
type WirePath = {
  color: string;
  start: Point;
  end: Point;
  arch: number;
  sway: number;
};

// Positions are relative to the wire group's assembled height of 1.12.
// Six signal wires terminate in the UNO/L298N headers; two short leads feed
// the driver and two heavier leads run to the three-cell battery holder.
const wirePaths: readonly WirePath[] = [
  { color: "#e85f18", start: [-1.401, 0.28, 0.255], end: [1.12, 0.21, 1.149], arch: 0.92, sway: -0.12 },
  { color: "#213f67", start: [-1.315, 0.28, 0.255], end: [1.199, 0.21, 1.149], arch: 0.86, sway: -0.06 },
  { color: "#efe6c9", start: [-1.229, 0.28, 0.255], end: [1.278, 0.21, 1.149], arch: 0.8, sway: 0 },
  { color: "#713864", start: [-1.143, 0.28, 0.255], end: [1.357, 0.21, 1.149], arch: 0.77, sway: 0.06 },
  { color: "#237143", start: [-0.711, 0.28, 0.255], end: [1.436, 0.21, 1.149], arch: 0.83, sway: 0.12 },
  { color: "#efaa18", start: [-0.625, 0.28, 0.255], end: [1.515, 0.21, 1.149], arch: 0.9, sway: 0.18 },
  { color: "#c74327", start: [-0.625, 0.28, 1.445], end: [0.587, 0.33, 1.144], arch: 0.62, sway: -0.1 },
  { color: "#171b1d", start: [-0.539, 0.28, 1.445], end: [0.733, 0.33, 1.144], arch: 0.56, sway: 0.09 },
  { color: "#d33b2e", start: [1.55, 0.34, -1.88], end: [1.57, 0.36, 0.54], arch: 0.78, sway: 0.22 },
  { color: "#17191b", start: [1.55, 0.34, -1.44], end: [1.57, 0.36, 0.68], arch: 0.7, sway: -0.18 },
] as const;

type WireResources = {
  wireGeometry: THREE.BufferGeometry;
  connectorGeometry: THREE.BufferGeometry;
  pinGeometry: THREE.BufferGeometry;
};

let sharedResources: WireResources | undefined;

function createWireResources(): WireResources {
  const wires = wirePaths.map(({ color, start, end, arch, sway }, index) => {
    const middleX = (start[0] + end[0]) / 2;
    const middleZ = (start[2] + end[2]) / 2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(start[0] + sway * 0.25, Math.max(start[1] + 0.18, arch * 0.63), start[2] + 0.04),
      new THREE.Vector3(middleX + sway, arch + index * 0.004, middleZ - 0.1),
      new THREE.Vector3(end[0] - sway * 0.2, Math.max(end[1] + 0.16, arch * 0.58), end[2] - 0.04),
      new THREE.Vector3(...end),
    ]);
    const radius = index >= 8 ? 0.022 : 0.014;
    const geometry = new THREE.TubeGeometry(curve, 40, radius, 7, false);
    const tint = new THREE.Color(color);
    const vertexColors = new Float32Array(geometry.getAttribute("position").count * 3);
    for (let offset = 0; offset < vertexColors.length; offset += 3) {
      vertexColors[offset] = tint.r;
      vertexColors[offset + 1] = tint.g;
      vertexColors[offset + 2] = tint.b;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(vertexColors, 3));
    return geometry;
  });
  const wireGeometry = mergeGeometries(wires)!;
  wires.forEach((wire) => wire.dispose());

  const connectors = wirePaths.flatMap(({ start, end }, index) => [start, end].map(([x, y, z]) =>
    new THREE.BoxGeometry(index >= 8 ? 0.075 : 0.058, 0.13, index >= 8 ? 0.075 : 0.06)
      .translate(x, y - 0.065, z),
  ));
  const connectorGeometry = mergeGeometries(connectors)!;
  connectors.forEach((connector) => connector.dispose());

  const pins = wirePaths.slice(0, 8).map(({ start: [x, y, z] }) =>
    new THREE.BoxGeometry(0.017, 0.09, 0.017).translate(x, y - 0.155, z),
  );
  const pinGeometry = mergeGeometries(pins)!;
  pins.forEach((pin) => pin.dispose());
  return { wireGeometry, connectorGeometry, pinGeometry };
}

function getWireResources() {
  return sharedResources ??= createWireResources();
}

export default function JumperWires() {
  const resources = getWireResources();
  return (
    <group dispose={null}>
      <mesh geometry={resources.wireGeometry} castShadow>
        <meshStandardMaterial vertexColors roughness={0.5} metalness={0.02} />
      </mesh>
      <mesh geometry={resources.connectorGeometry} castShadow>
        <meshStandardMaterial color="#141719" roughness={0.63} />
      </mesh>
      <mesh geometry={resources.pinGeometry}>
        <meshStandardMaterial color="#b7b6a5" metalness={0.82} roughness={0.3} />
      </mesh>
    </group>
  );
}
