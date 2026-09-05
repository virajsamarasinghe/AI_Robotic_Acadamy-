/** Small direct-light rig avoids a costly HDR/PMREM pass on mobile GPUs. */
export default function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#fffaf2", "#6d7480", 1.15]} />
      <directionalLight
        position={[-3, 8, 5]}
        intensity={3.1}
        color="#fff8ee"
      />
      <directionalLight position={[5, 3, -6]} intensity={2} color="#e4edff" />
      <pointLight position={[0, 5, 7]} intensity={8} distance={18} color="#fff4df" />
    </>
  );
}
