"use client";

import { Canvas } from "@react-three/fiber";
import { GoldDust, Petals } from "./FloatingParticles";

/** Petals and gold dust drifting down behind the order confirmation. */
export default function CelebrationCanvas() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 45 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1.6} color="#fff1d6" />
      <pointLight position={[-4, -2, 2]} intensity={10} color="#a12d52" />
      <Petals count={70} />
      <GoldDust count={180} />
    </Canvas>
  );
}
