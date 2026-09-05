"use client";

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Side = "left" | "right";
type Batch = { geometry: THREE.BufferGeometry; material: THREE.MeshStandardMaterial };
type Parts = { batches: Batch[]; grain: THREE.DataTexture };

// Geometry is merged by finish once, rather than creating a draw call for every
// tread, spoke, screw and molded detail. No geometry changes during scrolling.
function merge(parts: THREE.BufferGeometry[]) {
  const normalized = parts.map((part) => part.index ? part.toNonIndexed() : part);
  const result = mergeGeometries(normalized, false)!;
  new Set([...parts, ...normalized]).forEach((part) => part.dispose());
  result.computeBoundingSphere();
  return result;
}

function grainTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  let seed = 1729;
  for (let index = 0; index < size * size; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 106 + (seed >>> 26);
    data[index * 4] = value;
    data[index * 4 + 1] = value;
    data[index * 4 + 2] = value;
    data[index * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function lathe(profile: readonly (readonly [number, number])[], segments = 64) {
  return new THREE.LatheGeometry(profile.map(([r, x]) => new THREE.Vector2(r, x)), segments)
    .rotateZ(Math.PI / 2);
}

function ring(outer: number, inner: number, length: number) {
  return lathe([[inner, -length / 2], [outer, -length / 2], [outer, length / 2],
    [inner, length / 2], [inner, -length / 2]], 40);
}

function cylinderX(radius: number, length: number, segments = 32) {
  return new THREE.CylinderGeometry(radius, radius, length, segments).rotateZ(Math.PI / 2);
}

function roundedRectangle(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function extrudeX(shape: THREE.Shape, thickness: number, bevel = 0.008) {
  return new THREE.ExtrudeGeometry(shape, {
    depth: thickness, bevelEnabled: bevel > 0, bevelSize: bevel,
    bevelThickness: bevel, bevelSegments: 1, curveSegments: 10, steps: 1,
  }).translate(0, 0, -thickness / 2).rotateY(Math.PI / 2);
}

function createWheel(): Parts {
  const grain = grainTexture();
  const rubber = new THREE.MeshStandardMaterial({
    color: "#242625", roughness: 0.86, metalness: 0,
    bumpMap: grain, bumpScale: 0.004,
  });
  const plastic = new THREE.MeshStandardMaterial({
    color: "#e7b916", roughness: 0.39, metalness: 0,
    bumpMap: grain, bumpScale: 0.0012,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: "#c5c8c5", metalness: 0.93, roughness: 0.27,
    bumpMap: grain, bumpScale: 0.0007,
  });

  // A near-rectangular tyre section with round shoulders, distinct sidewalls
  // and a recessed bead. The silhouette remains circular from every angle.
  const tyre: THREE.BufferGeometry[] = [lathe([
    [0.605, -0.17], [0.623, -0.214], [0.72, -0.223], [0.782, -0.208],
    [0.823, -0.175], [0.849, -0.122], [0.849, 0.122], [0.823, 0.175],
    [0.782, 0.208], [0.72, 0.223], [0.623, 0.214], [0.605, 0.17], [0.605, -0.17],
  ])];
  // Three rows of alternating tread blocks, molded onto the tyre casing.
  const tread = new RoundedBoxGeometry(0.112, 0.065, 0.143, 1, 0.01);
  for (let row = 0; row < 3; row++) {
    for (let index = 0; index < 32; index++) {
      const angle = (index + (row === 1 ? 0.42 : 0)) * Math.PI / 16;
      tyre.push(tread.clone().rotateY(row === 1 ? -0.16 : 0.13)
        .translate((row - 1) * 0.122, 0.853, 0).rotateX(angle));
    }
  }
  tread.dispose();
  // Fine raised sidewall/bead rings catch the studio light without extra meshes.
  for (const side of [-1, 1]) {
    tyre.push(lathe([[0.675, 0.218 * side], [0.676, 0.224 * side],
      [0.684, 0.224 * side], [0.685, 0.218 * side]], 64));
  }

  const rimShape = new THREE.Shape();
  rimShape.absarc(0, 0, 0.636, 0, Math.PI * 2, false);
  const axleHole = new THREE.Path();
  axleHole.absarc(0, 0, 0.108, 0, Math.PI * 2, true);
  rimShape.holes.push(axleHole);
  for (let index = 0; index < 5; index++) {
    const step = Math.PI * 2 / 5;
    const start = index * step + 0.16;
    const end = (index + 1) * step - 0.16;
    const hole = new THREE.Path();
    hole.moveTo(Math.cos(start) * 0.248, Math.sin(start) * 0.248);
    hole.lineTo(Math.cos(start) * 0.543, Math.sin(start) * 0.543);
    hole.absarc(0, 0, 0.543, start, end, false);
    hole.lineTo(Math.cos(end) * 0.248, Math.sin(end) * 0.248);
    hole.absarc(0, 0, 0.248, end, start, true);
    hole.closePath();
    rimShape.holes.push(hole);
  }
  const yellow: THREE.BufferGeometry[] = [extrudeX(rimShape, 0.13, 0.012)];
  yellow.push(lathe([[0.575, -0.17], [0.613, -0.192], [0.636, -0.175],
    [0.639, 0.175], [0.613, 0.192], [0.575, 0.17], [0.575, -0.17]]));
  yellow.push(lathe([[0.107, -0.215], [0.168, -0.215], [0.195, -0.19],
    [0.213, -0.09], [0.213, 0.09], [0.195, 0.19], [0.168, 0.215],
    [0.107, 0.215], [0.107, -0.215]]));

  return {
    grain,
    batches: [
      { geometry: merge(tyre), material: rubber },
      { geometry: merge(yellow), material: plastic },
      { geometry: ring(0.133, 0.088, 0.435), material: steel },
    ],
  };
}

function createMotor(): Parts {
  const grain = grainTexture();
  const plastic = new THREE.MeshStandardMaterial({ color: "#d9ae20", roughness: 0.4,
    bumpMap: grain, bumpScale: 0.0018 });
  const black = new THREE.MeshStandardMaterial({ color: "#222522", roughness: 0.64 });
  const metal = new THREE.MeshStandardMaterial({ color: "#afb8ba", metalness: 0.92,
    roughness: 0.33, bumpMap: grain, bumpScale: 0.0009 });
  const brass = new THREE.MeshStandardMaterial({ color: "#ae8e49", metalness: 0.86, roughness: 0.32 });
  const nylon = new THREE.MeshStandardMaterial({ color: "#e6e1c9", roughness: 0.43 });
  const yellow: THREE.BufferGeometry[] = [];
  const dark: THREE.BufferGeometry[] = [];
  const silver: THREE.BufferGeometry[] = [];
  const gold: THREE.BufferGeometry[] = [];
  const white: THREE.BufferGeometry[] = [];

  // The gearbox splits along X. Its motor can extends rearward along Z;
  // the perpendicular output axle is centered at [0, 0, 0].
  const caseShape = roundedRectangle(0.79, 0.6, 0.085);
  for (const sign of [-1, 1]) {
    yellow.push(extrudeX(caseShape, 0.302).translate(sign * 0.159, 0, -0.16));
  }
  dark.push(extrudeX(caseShape, 0.006, 0).translate(0, 0, -0.16));
  yellow.push(cylinderX(0.139, 0.055).translate(0.344, 0, 0));
  yellow.push(cylinderX(0.113, 0.025).translate(-0.327, 0, 0));
  gold.push(ring(0.087, 0.065, 0.019).translate(0.377, 0, 0));

  // Molded mounting eyelets have actual through-holes.
  for (const y of [-0.249, 0.249]) {
    yellow.push(ring(0.073, 0.032, 0.54).translate(0, y, 0.255));
  }
  // Two crosshead case screws, with recessed dark slots below the metal rim.
  const screwShape = new THREE.Shape();
  screwShape.absarc(0, 0, 0.041, 0, Math.PI * 2, false);
  const slot = new THREE.Path();
  slot.moveTo(-0.007, -0.029);
  slot.lineTo(0.007, -0.029);
  slot.lineTo(0.007, -0.007);
  slot.lineTo(0.029, -0.007);
  slot.lineTo(0.029, 0.007);
  slot.lineTo(0.007, 0.007);
  slot.lineTo(0.007, 0.029);
  slot.lineTo(-0.007, 0.029);
  slot.lineTo(-0.007, 0.007);
  slot.lineTo(-0.029, 0.007);
  slot.lineTo(-0.029, -0.007);
  slot.lineTo(-0.007, -0.007);
  slot.closePath();
  screwShape.holes.push(slot);
  for (const y of [-0.198, 0.198]) {
    dark.push(cylinderX(0.052, 0.011).translate(0.32, y, -0.402));
    silver.push(extrudeX(screwShape, 0.008, 0.002).translate(0.331, y, -0.402));
    dark.push(cylinderX(0.023, 0.009, 16).translate(0.317, y, 0.145));
  }
  // Flat on the shaft is visible after the wheel slides off the axle.
  const shaft = new THREE.Shape();
  shaft.moveTo(-0.061, 0.038);
  shaft.lineTo(0.061, 0.038);
  shaft.absarc(0, 0, 0.072, Math.asin(0.038 / 0.072), Math.PI - Math.asin(0.038 / 0.072), true);
  shaft.closePath();
  white.push(extrudeX(shaft, 0.296, 0.004).translate(0.527, 0, 0));

  const can = new THREE.CylinderGeometry(0.248, 0.248, 0.535, 40)
    .rotateX(Math.PI / 2).scale(1, 0.91, 1).translate(0, 0, -0.862);
  silver.push(can);
  white.push(new THREE.CylinderGeometry(0.255, 0.255, 0.105, 36)
    .rotateX(Math.PI / 2).scale(1, 0.93, 1).translate(0, 0, -0.571));
  dark.push(new THREE.CylinderGeometry(0.251, 0.251, 0.072, 36)
    .rotateX(Math.PI / 2).scale(1, 0.91, 1).translate(0, 0, -1.164));
  // Rolled casing seam, crimp tabs and cooling apertures on the metal shell.
  silver.push(new THREE.BoxGeometry(0.022, 0.017, 0.49).translate(0, 0.231, -0.862));
  for (const x of [-0.145, 0.145]) {
    dark.push(new RoundedBoxGeometry(0.092, 0.017, 0.09, 1, 0.008)
      .translate(x, 0.181, -1.085));
    silver.push(new THREE.BoxGeometry(0.068, 0.02, 0.075).translate(x, -0.19, -1.144));
    const terminal = roundedRectangle(0.12, 0.067, 0.012);
    const hole = new THREE.Path();
    hole.absarc(0.025, 0, 0.017, 0, Math.PI * 2, true);
    terminal.holes.push(hole);
    gold.push(extrudeX(terminal, 0.016, 0.002).translate(x, -0.075, -1.235));
  }
  silver.push(new THREE.CylinderGeometry(0.027, 0.027, 0.082, 16)
    .rotateX(Math.PI / 2).translate(0, 0, -1.239));

  return {
    grain,
    batches: [
      { geometry: merge(yellow), material: plastic },
      { geometry: merge(dark), material: black },
      { geometry: merge(silver), material: metal },
      { geometry: merge(gold), material: brass },
      { geometry: merge(white), material: nylon },
    ],
  };
}

function PartMeshes({ parts }: { parts: Parts }) {
  return (
    <group dispose={null}>
      {parts.batches.map(({ geometry, material }, index) => (
        <mesh key={index} geometry={geometry} material={material} castShadow receiveShadow />
      ))}
    </group>
  );
}

let sharedMotor: Parts | undefined;
let sharedWheel: Parts | undefined;

/** Local origin is the output axle. Both robot sides keep the can behind it. */
export function GearMotor({ side }: { side: Side }) {
  const parts = sharedMotor ??= createMotor();
  return <group scale={[side === "left" ? -1 : 1, 1, 1]}><PartMeshes parts={parts} /></group>;
}

/** Radius .887; axial width .46. Both faces have a bored, recessed hub. */
export function DriveWheel({ side = "right" }: { side?: Side }) {
  const parts = sharedWheel ??= createWheel();
  return <group scale={[side === "left" ? -1 : 1, 1, 1]}><PartMeshes parts={parts} /></group>;
}
