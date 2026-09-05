import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CHASSIS_THICKNESS, createChassisShape } from "./chassis-geometry";

// Both plates use the same kit outline and GPU buffers. Keep CPU geometry
// reusable across mounts, but release its GPU allocation after the last plate.
const chassisGeometry = new THREE.ExtrudeGeometry(createChassisShape(), {
  depth: CHASSIS_THICKNESS,
  bevelEnabled: true,
  bevelSize: 0.009,
  bevelThickness: 0.007,
  bevelSegments: 2,
  curveSegments: 12,
});
chassisGeometry.rotateX(Math.PI / 2);
chassisGeometry.computeVertexNormals();
export default function ChassisPlate() {
  const roughnessMap = useTexture("/robot/materials/polymer-roughness.webp");

  return (
    <mesh castShadow receiveShadow>
      <primitive object={chassisGeometry} attach="geometry" />
      <meshPhysicalMaterial
        color="#17191b"
        metalness={0.025}
        roughness={0.4}
        roughnessMap={roughnessMap}
        clearcoat={0.28}
        clearcoatRoughness={0.2}
        ior={1.49}
      />
    </mesh>
  );
}
