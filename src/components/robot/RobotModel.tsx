"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import ChassisPlate from "./ChassisPlate";
import { CHASSIS_MOUNTS, CHASSIS_THICKNESS, CASTER_MOUNT } from "./chassis-geometry";
import { FrameCaster, FrameNut, FrameScrew, Standoff } from "./FrameHardware";
import { DriveWheel, GearMotor } from "./DriveTrain";
import { ArduinoBoard, BatteryPack, IRSensorArray, MotorDriver } from "./RobotElectronics";
import JumperWires from "./RobotWires";
import StudioLighting from "./StudioLighting";
import { CASTER_EXTENSION, FRAME_UPPER_Y, robotMotionConfig } from "./robot-motion";
import type { RobotPartId, RobotProgress } from "./robot-types";
import { useRobotAnimation } from "./use-robot-animation";

function StandoffSet() {
  return <>{Object.entries(CHASSIS_MOUNTS).map(([name, [x, z]]) => (
    <group key={name} position={[x, 0, z]}><Standoff height={FRAME_UPPER_Y - CHASSIS_THICKNESS} /></group>
  ))}</>;
}

function ScrewSet() {
  return <>{Object.entries(CHASSIS_MOUNTS).map(([name, [x, z]]) => (
    <group key={name} position={[x, 0, z]}><FrameScrew /></group>
  ))}</>;
}

function NutSet() {
  return <>{Object.entries(CHASSIS_MOUNTS).map(([name, [x, z]]) => (
    <group key={name} position={[x, 0, z]}><FrameNut /></group>
  ))}</>;
}

function CasterAssembly() {
  return (
    <group position={[CASTER_MOUNT[0], 0, CASTER_MOUNT[1]]}>
      <FrameCaster />
      {[-0.3, 0.3].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Standoff height={CASTER_EXTENSION} />
          <FrameNut />
        </group>
      ))}
    </group>
  );
}

const motionById = new Map(robotMotionConfig.map((config) => [config.id, config]));

function phase(progress: number, start: number, end: number) {
  const value = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  return value * value * (3 - 2 * value);
}

function ShadowCatcher({ progress, reduceMotion }: { progress: RobotProgress; reduceMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const p = reduceMotion ? 0 : THREE.MathUtils.clamp(progress.get(), 0, 1);
    const lowerOffset = -0.72 * phase(p, 0.42, 0.68);
    const wheelBottom = -1.308 + lowerOffset;
    const casterBottom = -1.31 + lowerOffset - 0.8 * phase(p, 0.8, 1);
    const scale = THREE.MathUtils.lerp(1.34, 0.82, THREE.MathUtils.smoothstep(p, 0, 0.45));
    mesh.position.y = -0.25 + Math.min(wheelBottom, casterBottom) * scale - 0.018;
  });
  return (
    <mesh ref={ref} position={[0, -2.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[18, 18]} />
      <shadowMaterial transparent opacity={0.09} depthWrite={false} />
    </mesh>
  );
}

function RobotPart({ id, children, register }: {
  id: RobotPartId;
  children: ReactNode;
  register: (id: RobotPartId, node: THREE.Group | null) => void;
}) {
  return <group ref={(node) => register(id, node)} position={motionById.get(id)?.basePosition}>{children}</group>;
}

function RobotModel({ progress, reduceMotion }: { progress: RobotProgress; reduceMotion: boolean }) {
  const { worldRef, registerPart } = useRobotAnimation(progress, reduceMotion);
  return (
    <group ref={worldRef} rotation={[0, -0.38, 0]} position={[0, -0.25, 0]} scale={1.34}>
      <RobotPart id="frameLower" register={registerPart}><ChassisPlate /></RobotPart>
      <RobotPart id="standoffs" register={registerPart}><StandoffSet /></RobotPart>
      <RobotPart id="frameUpper" register={registerPart}><ChassisPlate /></RobotPart>
      <RobotPart id="upperScrews" register={registerPart}><ScrewSet /></RobotPart>
      <RobotPart id="lowerNuts" register={registerPart}><NutSet /></RobotPart>
      <RobotPart id="caster" register={registerPart}><CasterAssembly /></RobotPart>
      <RobotPart id="arduino" register={registerPart}><ArduinoBoard /></RobotPart>
      <RobotPart id="wires" register={registerPart}><JumperWires /></RobotPart>
      <RobotPart id="battery" register={registerPart}><BatteryPack /></RobotPart>
      <RobotPart id="motorDriver" register={registerPart}><MotorDriver /></RobotPart>
      <RobotPart id="motorLeft" register={registerPart}><GearMotor side="left" /></RobotPart>
      <RobotPart id="motorRight" register={registerPart}><GearMotor side="right" /></RobotPart>
      <RobotPart id="wheelLeft" register={registerPart}><DriveWheel side="left" /></RobotPart>
      <RobotPart id="wheelRight" register={registerPart}><DriveWheel side="right" /></RobotPart>
      <RobotPart id="irSensor" register={registerPart}><IRSensorArray /></RobotPart>
    </group>
  );
}

export default function RobotWorld({ progress, reduceMotion }: { progress: RobotProgress; reduceMotion: boolean }) {
  return (
    <>
      <StudioLighting />
      <RobotModel progress={progress} reduceMotion={reduceMotion} />
      <ShadowCatcher progress={progress} reduceMotion={reduceMotion} />
    </>
  );
}
