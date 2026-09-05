"use client";

import type { ReactNode } from "react";
import type { Group } from "three";
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

function RobotPart({ id, children, register }: {
  id: RobotPartId;
  children: ReactNode;
  register: (id: RobotPartId, node: Group | null) => void;
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
    </>
  );
}
