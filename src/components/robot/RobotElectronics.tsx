"use client";

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type V3 = readonly [number, number, number];
type ElectronicsKind = "arduino" | "driver" | "battery" | "sensor";
type Surface = "board" | "black" | "metal" | "solder" | "brass" | "ceramic" | "blue" | "heatsink" | "purple" | "lens" | "darkLens" | "led";
type PartMesh = { geometry: THREE.BufferGeometry; material: THREE.Material };

// Small parts are combined into one mesh per finish, rather than hundreds of
// separate draw calls. Each complete module still moves independently.
class ElectronicsBuilder {
  private batches = new Map<Surface, THREE.BufferGeometry[]>();
  private finishes = new Map<Surface, THREE.MeshStandardMaterial>();
  readonly meshes: PartMesh[] = [];
  readonly textures: THREE.Texture[] = [];

  constructor(private kind: ElectronicsKind) {}

  add(surface: Surface, geometry: THREE.BufferGeometry, position: V3 = [0, 0, 0], rotation?: V3) {
    if (rotation) geometry.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)));
    geometry.translate(...position);
    // Extruded surfaces and primitives have different index layouts.
    const flat = geometry.index ? geometry.toNonIndexed() : geometry;
    if (flat !== geometry) geometry.dispose();
    flat.clearGroups();
    const batch = this.batches.get(surface) ?? [];
    batch.push(flat);
    this.batches.set(surface, batch);
  }

  box(surface: Surface, size: V3, position: V3, radius = 0, rotation?: V3) {
    this.add(surface, radius ? new RoundedBoxGeometry(...size, 2, radius) : new THREE.BoxGeometry(...size), position, rotation);
  }

  cylinder(surface: Surface, radius: number, height: number, position: V3, rotation?: V3, segments = 20) {
    this.add(surface, new THREE.CylinderGeometry(radius, radius, height, segments), position, rotation);
  }

  ring(surface: Surface, radius: number, tube: number, position: V3, rotation: V3 = [-Math.PI / 2, 0, 0]) {
    this.add(surface, new THREE.TorusGeometry(radius, tube, 5, 20), position, rotation);
  }

  finish() {
    for (const [surface, geometries] of this.batches) {
      const geometry = mergeGeometries(geometries);
      for (const source of geometries) source.dispose();
      if (geometry) this.meshes.push({ geometry, material: this.material(surface) });
    }
    return { meshes: this.meshes, textures: this.textures };
  }

  material(surface: Surface) {
    const existing = this.finishes.get(surface);
    if (existing) return existing;
    const properties: Record<Surface, THREE.MeshStandardMaterialParameters> = {
      board: { color: this.kind === "driver" ? "#8d181c" : "#075068", metalness: 0.12, roughness: 0.48 },
      black: { color: "#15181a", metalness: 0.08, roughness: 0.55 },
      metal: { color: "#bec6cb", metalness: 0.94, roughness: 0.28 },
      solder: { color: "#a8b5b6", metalness: 0.88, roughness: 0.34 },
      brass: { color: "#b19b60", metalness: 0.88, roughness: 0.29 },
      ceramic: { color: "#b6a37b", metalness: 0.02, roughness: 0.65 },
      blue: { color: "#0756a3", metalness: 0.06, roughness: 0.4 },
      heatsink: { color: "#262c31", metalness: 0.78, roughness: 0.36 },
      purple: { color: "#7650a3", metalness: 0.12, roughness: 0.31 },
      lens: { color: "#a0b1c2", metalness: 0.5, roughness: 0.12 },
      darkLens: { color: "#080c19", metalness: 0.16, roughness: 0.13 },
      led: { color: "#799c3b", emissive: "#395315", emissiveIntensity: 0.5, roughness: 0.38 },
    };
    const material = new THREE.MeshStandardMaterial(properties[surface]);
    this.finishes.set(surface, material);
    return material;
  }

  pcb(width: number, depth: number, holes: readonly (readonly [number, number])[], texture: THREE.Texture) {
    const radius = 0.055;
    const shape = new THREE.Shape();
    const left = -width / 2, right = width / 2, bottom = -depth / 2, top = depth / 2;
    shape.moveTo(left + radius, bottom);
    shape.lineTo(right - radius, bottom);
    shape.quadraticCurveTo(right, bottom, right, bottom + radius);
    shape.lineTo(right, top - radius);
    shape.quadraticCurveTo(right, top, right - radius, top);
    shape.lineTo(left + radius, top);
    shape.quadraticCurveTo(left, top, left, top - radius);
    shape.lineTo(left, bottom + radius);
    shape.quadraticCurveTo(left, bottom, left + radius, bottom);
    for (const [x, z] of holes) {
      const hole = new THREE.Path();
      hole.absarc(x, -z, this.kind === "sensor" ? 0.032 : 0.047, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
    const board = new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: false, curveSegments: 10, steps: 1 });
    board.rotateX(-Math.PI / 2);
    this.add("board", board, [0, -0.035, 0]);
    const face = new THREE.ShapeGeometry(shape, 10);
    face.rotateX(-Math.PI / 2);
    face.translate(0, 0.0356, 0);
    const positions = face.getAttribute("position");
    const uvs = face.getAttribute("uv");
    for (let i = 0; i < positions.count; i++) {
      uvs.setXY(i, positions.getX(i) / width + 0.5, 0.5 - positions.getZ(i) / depth);
    }
    this.meshes.push({ geometry: face, material: new THREE.MeshPhysicalMaterial({ map: texture, color: "#ffffff", metalness: 0.18, roughness: 0.43, clearcoat: 0.16, clearcoatRoughness: 0.45 }) });
    this.textures.push(texture);
    for (const [x, z] of holes) {
      this.ring("solder", this.kind === "sensor" ? 0.041 : 0.058, 0.008, [x, 0.037, z]);
      this.ring("solder", this.kind === "sensor" ? 0.041 : 0.058, 0.008, [x, -0.037, z]);
    }
  }

  resistor(x: number, z: number, alongZ = false, ceramic = false) {
    const rotation: V3 | undefined = alongZ ? [0, Math.PI / 2, 0] : undefined;
    this.box("solder", [0.083, 0.023, 0.037], [x, 0.052, z], 0, rotation);
    this.box(ceramic ? "ceramic" : "black", [0.049, 0.026, 0.039], [x, 0.06, z], 0.004, rotation);
  }

  capacitor(x: number, z: number, radius: number, height: number) {
    this.cylinder("black", radius, height, [x, 0.045 + height / 2, z]);
    this.cylinder("metal", radius * 0.91, 0.012, [x, 0.048 + height, z]);
    this.ring("metal", radius * 0.97, 0.006, [x, 0.046 + height, z]);
    this.box("heatsink", [radius * 1.35, 0.002, 0.008], [x, 0.056 + height, z]);
    this.box("heatsink", [0.008, 0.002, radius * 1.35], [x, 0.056 + height, z]);
    // The light polarity band is part of the sleeve, not an extra light source.
    this.box("solder", [0.018, height * 0.68, 0.005], [x, 0.046 + height / 2, z + radius]);
  }

  screw(x: number, y: number, z: number) {
    this.cylinder("metal", 0.038, 0.012, [x, y, z], undefined, 16);
    this.box("black", [0.05, 0.002, 0.007], [x, y + 0.0065, z]);
    this.box("black", [0.007, 0.002, 0.041], [x, y + 0.0065, z]);
  }
}

function circuitTexture(kind: "arduino" | "driver" | "sensor") {
  const canvas = document.createElement("canvas");
  canvas.width = kind === "sensor" ? 1024 : 1024;
  canvas.height = kind === "sensor" ? 256 : 768;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Robot PCB texture could not be created");
  const width = canvas.width, height = canvas.height;
  context.fillStyle = kind === "driver" ? "#a92023" : "#07576f";
  context.fillRect(0, 0, width, height);
  // Deterministic, very fine solder-mask variation; no random frame updates.
  for (let i = 0; i < 5500; i++) {
    const x = (i * 211 + 19) % width, y = (i * 89 + 37) % height;
    context.fillStyle = i % 3 ? "rgba(255,255,255,.026)" : "rgba(0,0,0,.035)";
    context.fillRect(x, y, 2, 1);
  }
  context.lineWidth = 2;
  for (let i = 0; i < (kind === "sensor" ? 34 : 75); i++) {
    const x = 95 + (i * 73) % (width - 190), y = 86 + (i * 47) % (height - 172);
    const targetX = Math.min(width - 45, x + 30 + (i % 7) * 13);
    const targetY = Math.min(height - 30, y + 20 + (i % 6) * 12);
    context.strokeStyle = kind === "driver" ? "rgba(220,99,80,.38)" : "rgba(71,140,151,.4)";
    context.beginPath(); context.moveTo(x, y); context.lineTo(x + 15, y); context.lineTo(targetX, targetY - 8); context.lineTo(targetX, targetY); context.stroke();
    context.fillStyle = "#839b91";
    context.beginPath(); context.arc(x, y, 2.8, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#153b3d";
    context.beginPath(); context.arc(x, y, 1.2, 0, Math.PI * 2); context.fill();
  }
  context.fillStyle = "#d6ded6";
  context.strokeStyle = "#d6ded6";
  context.lineWidth = 2;
  context.font = "19px monospace";
  if (kind === "arduino") {
    context.font = "20px Arial";
    context.fillText("DIGITAL (PWM~)", 423, 146);
    context.fillText("POWER", 340, 617);
    context.fillText("ANALOG IN", 672, 617);
    context.font = "15px monospace";
    for (let i = 0; i < 14; i++) context.fillText(String(13 - i), 249 + i * 42, 116);
    ["IOREF", "RST", "3V3", "5V", "GND", "GND", "VIN"].forEach((text, i) => context.fillText(text, 225 + i * 53, 653));
    for (let i = 0; i < 6; i++) context.fillText(`A${i}`, 656 + i * 43, 652);
    context.font = "bold 55px Arial";
    context.fillText("UNO", 524, 278);
    context.lineWidth = 3;
    context.strokeRect(512, 224, 139, 68);
    context.font = "17px monospace";
    context.fillText("ARDUINO", 405, 325);
    context.fillText("REV3", 690, 301);
    context.fillText("ON", 742, 384);
    context.fillText("TX", 220, 357);
    context.fillText("RX", 220, 387);
    context.fillText("16MHz", 319, 492);
    context.font = "16px monospace";
    for (let i = 0; i < 20; i++) context.fillText(`${i % 3 ? "R" : "C"}${i + 1}`, 220 + (i * 113) % 570, 204 + (i * 61) % 350);
  } else if (kind === "driver") {
    context.font = "bold 38px Arial";
    context.fillText("L298N", 390, 105);
    context.font = "23px monospace";
    context.fillText("OUT1 OUT2", 30, 270);
    context.fillText("OUT3 OUT4", 710, 270);
    context.fillText("12V  GND  5V", 95, 687);
    context.fillText("ENA IN1 IN2 IN3 IN4 ENB", 405, 670);
    context.font = "18px monospace";
    context.fillText("POWER", 235, 559);
    context.fillText("5V-EN", 735, 553);
    for (let i = 0; i < 8; i++) context.fillText(`D${i + 1}`, i < 4 ? 117 : 859, 160 + (i % 4) * 76);
  } else {
    context.font = "21px monospace";
    context.fillText("VCC  GND  S1  S2", 361, 44);
    for (let i = 0; i < 5; i++) {
      context.strokeRect(84 + i * 184, 110, 135, 126);
      context.fillText(`IR${i + 1}`, 125 + i * 184, 98);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function femaleHeader(b: ElectronicsBuilder, x: number, z: number, count: number) {
  const pitch = 0.086, length = count * pitch;
  b.box("black", [length, 0.082, 0.102], [x, 0.081, z], 0.004);
  for (const side of [-1, 1]) b.box("black", [length, 0.137, 0.017], [x, 0.169, z + side * 0.044]);
  for (let i = 0; i <= count; i++) b.box("black", [0.017, 0.137, 0.084], [x - length / 2 + i * pitch, 0.169, z]);
  for (let i = 0; i < count; i++) {
    const pinX = x - length / 2 + (i + 0.5) * pitch;
    b.box("brass", [0.036, 0.006, 0.031], [pinX, 0.134, z]);
    b.box("solder", [0.023, 0.112, 0.023], [pinX, -0.025, z]);
    b.ring("solder", 0.023, 0.006, [pinX, -0.038, z]);
  }
}

function dualInlineChip(b: ElectronicsBuilder, x: number, z: number, pins: number, width: number, depth: number) {
  b.box("black", [width, 0.115, depth], [x, 0.135, z], 0.017);
  b.box("heatsink", [width * 0.85, 0.003, depth * 0.72], [x, 0.195, z]);
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < pins / 2; i++) {
      const pinX = x - width * 0.44 + i * (width * 0.88 / (pins / 2 - 1));
      b.box("solder", [0.018, 0.016, 0.076], [pinX, 0.128, z + side * (depth / 2 + 0.018)]);
      b.box("solder", [0.018, 0.078, 0.014], [pinX, 0.09, z + side * (depth / 2 + 0.048)]);
      b.box("solder", [0.032, 0.014, 0.059], [pinX, 0.045, z + side * (depth / 2 + 0.055)]);
    }
  }
  b.cylinder("black", 0.019, 0.003, [x - width * 0.38, 0.197, z - depth * 0.25], undefined, 10);
}

function buildArduino() {
  const b = new ElectronicsBuilder("arduino");
  b.pcb(2.05, 1.42, [[-0.91, -0.52], [-0.91, 0.55], [0.89, -0.47], [0.89, 0.49]], circuitTexture("arduino"));
  femaleHeader(b, -0.2, -0.595, 8);
  femaleHeader(b, 0.49, -0.595, 8);
  femaleHeader(b, -0.16, 0.595, 8);
  femaleHeader(b, 0.49, 0.595, 6);
  dualInlineChip(b, 0.37, 0.24, 28, 0.81, 0.23);
  dualInlineChip(b, -0.42, -0.10, 12, 0.19, 0.18);

  // Folded USB-B shell: open at the left with a recessed contact tongue.
  b.box("metal", [0.41, 0.024, 0.36], [-0.915, 0.344, 0.17], 0.007);
  b.box("metal", [0.41, 0.026, 0.36], [-0.915, 0.098, 0.17], 0.004);
  for (const side of [-1, 1]) {
    b.box("metal", [0.41, 0.232, 0.024], [-0.915, 0.22, 0.17 + side * 0.177], 0.004);
    b.box("solder", [0.09, 0.034, 0.067], [-0.79, 0.052, 0.17 + side * 0.208]);
    b.box("heatsink", [0.11, 0.006, 0.016], [-0.92, 0.357, 0.17 + side * 0.115]);
  }
  b.box("black", [0.025, 0.207, 0.31], [-0.719, 0.22, 0.17]);
  b.box("black", [0.26, 0.064, 0.218], [-0.93, 0.174, 0.17], 0.007);
  for (const z of [-0.065, 0.065]) b.box("brass", [0.14, 0.009, 0.031], [-0.984, 0.211, 0.17 + z]);
  b.box("black", [0.30, 0.18, 0.26], [-0.843, 0.123, -0.365], 0.025);
  b.cylinder("black", 0.122, 0.16, [-0.969, 0.168, -0.365], [0, 0, Math.PI / 2]);
  b.ring("black", 0.084, 0.024, [-1.055, 0.168, -0.365], [0, Math.PI / 2, 0]);
  b.cylinder("heatsink", 0.063, 0.004, [-1.06, 0.168, -0.365], [0, 0, Math.PI / 2]);
  b.cylinder("metal", 0.017, 0.025, [-1.066, 0.168, -0.365], [0, 0, Math.PI / 2], 12);
  b.box("metal", [0.225, 0.064, 0.105], [-0.272, 0.093, 0.252], 0.035);
  b.box("black", [0.11, 0.062, 0.092], [-0.624, 0.084, -0.36], 0.008);
  b.cylinder("metal", 0.026, 0.017, [-0.624, 0.125, -0.36], undefined, 16);
  b.capacitor(-0.47, -0.36, 0.071, 0.145);
  b.capacitor(-0.28, -0.36, 0.068, 0.137);
  const components: [number, number, boolean][] = [
    [-0.65, -0.17, true], [-0.62, 0.38, true], [-0.53, 0.45, false], [-0.4, 0.42, false],
    [-0.22, -0.13, false], [-0.1, -0.34, true], [0.04, -0.34, true], [0.15, -0.34, true],
    [-0.07, 0.08, true], [0.07, 0.02, true], [0.29, -0.20, false], [0.5, -0.21, false],
    [0.62, -0.04, true], [0.77, 0.02, false], [0.77, 0.34, true], [-0.13, 0.4, false],
  ];
  components.forEach(([x, z, alongZ], i) => b.resistor(x, z, alongZ, i % 3 === 0));
  b.box("led", [0.054, 0.025, 0.032], [0.57, -0.00 + 0.063, -0.36], 0.004);
  for (const x of [0.75, 0.835, 0.92]) for (const z of [-0.26, -0.17]) {
    b.box("black", [0.083, 0.055, 0.086], [x, 0.063, z]);
    b.box("brass", [0.024, 0.2, 0.024], [x, 0.143, z]);
  }
  return b.finish();
}

function terminalBlock(b: ElectronicsBuilder, x: number, z: number, count: number, rotation = 0) {
  const pitch = 0.145;
  const transform = (localX: number, localY: number, localZ: number): V3 => [x + localX * Math.cos(rotation) + localZ * Math.sin(rotation), localY, z - localX * Math.sin(rotation) + localZ * Math.cos(rotation)];
  const turn: V3 = [0, rotation, 0];
  b.box("blue", [count * pitch + 0.02, 0.067, 0.207], transform(0, 0.075, 0), 0.005, turn);
  b.box("blue", [count * pitch + 0.02, 0.079, 0.207], transform(0, 0.26, 0), 0.006, turn);
  b.box("blue", [count * pitch + 0.02, 0.2, 0.042], transform(0, 0.173, -0.083), 0.004, turn);
  for (let i = 0; i <= count; i++) b.box("blue", [0.025, 0.185, 0.185], transform((i - count / 2) * pitch, 0.166, 0), 0.004, turn);
  for (let i = 0; i < count; i++) {
    const localX = (i + 0.5 - count / 2) * pitch;
    b.box("black", [0.109, 0.108, 0.024], transform(localX, 0.164, 0.018), 0.002, turn);
    b.box("brass", [0.079, 0.042, 0.051], transform(localX, 0.121, 0.051), 0, turn);
    const [screwX, screwY, screwZ] = transform(localX, 0.307, 0);
    b.cylinder("heatsink", 0.053, 0.004, [screwX, screwY - 0.001, screwZ]);
    b.screw(screwX, screwY + 0.001, screwZ);
  }
}

function buildDriver() {
  const b = new ElectronicsBuilder("driver");
  b.pcb(1.5, 1.18, [[-0.65, -0.49], [0.65, -0.49], [-0.65, 0.49], [0.65, 0.49]], circuitTexture("driver"));
  b.box("heatsink", [0.88, 0.07, 0.38], [0, 0.085, -0.25]);
  b.box("heatsink", [0.88, 0.5, 0.045], [0, 0.36, -0.10], 0.006);
  for (let i = 0; i < 7; i++) b.box("heatsink", [0.034, 0.5, 0.32], [-0.422 + i * 0.14, 0.36, -0.26], 0.004);
  b.box("metal", [0.58, 0.20, 0.017], [0, 0.368, -0.067], 0.008);
  b.box("black", [0.6, 0.20, 0.112], [0, 0.201, -0.034], 0.006);
  b.cylinder("metal", 0.059, 0.021, [0, 0.387, -0.042], [Math.PI / 2, 0, 0]);
  b.box("black", [0.072, 0.009, 0.002], [0, 0.387, -0.03]);
  b.box("black", [0.009, 0.059, 0.002], [0, 0.387, -0.029]);
  for (let i = 0; i < 15; i++) {
    const x = -0.27 + i * 0.0385;
    b.box("solder", [0.016, 0.10, 0.02], [x, 0.093, 0.01]);
    b.box("solder", [0.023, 0.017, 0.094], [x, 0.049, 0.049]);
  }
  terminalBlock(b, -0.30, 0.444, 3);
  terminalBlock(b, -0.61, -0.09, 2, -Math.PI / 2);
  terminalBlock(b, 0.61, -0.09, 2, Math.PI / 2);
  b.capacitor(-0.29, 0.183, 0.101, 0.26);
  b.capacitor(0.22, 0.172, 0.109, 0.30);
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) b.resistor(side * 0.49, -0.40 + i * 0.186, false);
  for (const [x, z] of [[0.03, 0.34], [0.28, 0.35], [-0.05, 0.21], [0.39, 0.22]]) b.resistor(x, z, true, true);
  for (let i = 0; i < 6; i++) {
    const x = 0.16 + i * 0.079;
    b.box("black", [0.077, 0.058, 0.086], [x, 0.071, 0.449]);
    b.box("brass", [0.022, 0.195, 0.022], [x, 0.151, 0.449]);
    b.box("solder", [0.032, 0.042, 0.032], [x, -0.045, 0.449]);
  }
  b.box("black", [0.082, 0.17, 0.099], [0.16, 0.151, 0.449], 0.008);
  b.box("black", [0.082, 0.17, 0.099], [0.555, 0.151, 0.449], 0.008);
  b.box("led", [0.033, 0.021, 0.022], [0.04, 0.058, 0.40]);
  return b.finish();
}

function cellTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Robot cell texture could not be created");
  ctx.fillStyle = "#7650a3"; ctx.fillRect(0, 0, 256, 512);
  ctx.fillStyle = "rgba(36,18,52,.19)"; ctx.fillRect(0, 0, 2, 512);
  ctx.translate(174, 383); ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#3c2657"; ctx.font = "20px Arial";
  ctx.fillText("18650   3.7V   LI-ION", 0, 0);
  ctx.font = "10px monospace"; ctx.fillText("RECHARGEABLE CELL   +", 10, 17);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

function buildBattery() {
  const b = new ElectronicsBuilder("battery");
  b.box("black", [1.75, 0.075, 1.08], [0, -0.174, 0], 0.024);
  for (const z of [-0.514, 0, 0.514]) {
    b.box("black", [1.65, 0.2, 0.045], [0, -0.059, z], 0.015);
    for (const x of [-0.62, 0.62]) b.box("black", [0.29, 0.28, 0.05], [x, 0.01, z], 0.027);
  }
  for (const x of [-0.829, 0.829]) b.box("black", [0.079, 0.382, 1.025], [x, -0.005, 0], 0.038);
  const texture = cellTexture();
  b.textures.push(texture);
  b.material("purple").map = texture;
  b.material("purple").color.set("#ffffff");
  for (const z of [-0.254, 0.254]) {
    b.cylinder("purple", 0.225, 1.454, [0, 0.039, z], [0, 0, Math.PI / 2], 32);
    for (const side of [-1, 1]) {
      b.ring("purple", 0.208, 0.017, [side * 0.729, 0.039, z], [0, Math.PI / 2, 0]);
      b.cylinder("metal", 0.177, 0.009, [side * 0.735, 0.039, z], [0, 0, Math.PI / 2], 24);
      b.ring("black", 0.179, 0.012, [side * 0.742, 0.039, z], [0, Math.PI / 2, 0]);
    }
    b.cylinder("metal", 0.082, 0.027, [0.75, 0.039, z], [0, 0, Math.PI / 2]);
    b.box("brass", [0.011, 0.112, 0.105], [0.784, 0.033, z], 0.009);
    const spring: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const angle = i / 48 * Math.PI * 6;
      spring.push(new THREE.Vector3(-0.76 - i / 48 * 0.038, 0.039 + Math.sin(angle) * 0.106, z + Math.cos(angle) * 0.106));
    }
    b.add("metal", new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spring), 48, 0.009, 5, false));
  }
  return b.finish();
}

function buildSensor() {
  const b = new ElectronicsBuilder("sensor");
  b.pcb(1.72, 0.42, [[-0.779, -0.118], [0.779, -0.118]], circuitTexture("sensor"));
  for (let i = 0; i < 5; i++) {
    const x = -0.62 + i * 0.31;
    b.box("black", [0.198, 0.09, 0.185], [x, -0.08, 0.025], 0.014);
    for (const side of [-1, 1]) {
      const z = 0.025 + side * 0.046;
      b.cylinder("black", 0.037, 0.06, [x, -0.129, z], undefined, 12);
      const dome = new THREE.SphereGeometry(0.035, 12, 8);
      dome.scale(1, 1.2, 1);
      b.add(side < 0 ? "darkLens" : "lens", dome, [x, -0.163, z]);
      b.box("solder", [0.035, 0.015, 0.045], [x - 0.056, -0.042, z]);
    }
    b.resistor(x - 0.044, -0.112, true, true);
    b.resistor(x + 0.05, -0.112, true);
    b.box("black", [0.095, 0.035, 0.072], [x, 0.068, 0.065], 0.005);
    for (const side of [-1, 1]) for (let j = 0; j < 3; j++) b.box("solder", [0.013, 0.014, 0.031], [x - 0.033 + j * 0.033, 0.047, 0.065 + side * 0.048]);
  }
  for (const x of [-0.13, -0.043, 0.043, 0.13]) {
    b.box("black", [0.083, 0.05, 0.08], [x, 0.071, -0.163]);
    b.box("brass", [0.023, 0.158, 0.023], [x, 0.127, -0.163]);
  }
  for (const x of [-0.779, 0.779]) {
    b.cylinder("brass", 0.06, 0.20, [x, -0.144, -0.118], undefined, 6);
    b.ring("brass", 0.041, 0.011, [x, 0.043, -0.118]);
    b.screw(x, 0.054, -0.118);
  }
  return b.finish();
}

const builders = { arduino: buildArduino, driver: buildDriver, battery: buildBattery, sensor: buildSensor };
type ElectronicsResources = ReturnType<typeof buildArduino>;
const electronicsCache: Partial<Record<ElectronicsKind, ElectronicsResources>> = {};

function getElectronics(kind: ElectronicsKind) {
  const cached = electronicsCache[kind];
  if (cached) return cached;
  const resources = builders[kind]();
  electronicsCache[kind] = resources;
  return resources;
}

function Electronics({ kind }: { kind: ElectronicsKind }) {
  const resources = getElectronics(kind);
  return (
    <group dispose={null}>
      {resources.meshes.map(({ geometry, material }, index) => <mesh key={index} geometry={geometry} material={material} castShadow receiveShadow />)}
    </group>
  );
}

export function ArduinoBoard() { return <Electronics kind="arduino" />; }
export function MotorDriver() { return <Electronics kind="driver" />; }
export function BatteryPack() { return <Electronics kind="battery" />; }
export function IRSensorArray() { return <Electronics kind="sensor" />; }
