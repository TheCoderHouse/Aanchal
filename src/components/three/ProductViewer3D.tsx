"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { Colorway, Motif } from "@/data/types";
import { GoldDust } from "./FloatingParticles";
import { SareeCloth } from "./SareeCloth";
import { StudioLights } from "./StudioLights";

type Props = {
  colorway: Colorway;
  motif: Motif;
  onReady?: () => void;
};

/** Product page viewer: drag to turn the saree. Wheel zoom is off so page scrolling isn't hijacked. */
export default function ProductViewer3D({ colorway, motif, onReady }: Props) {
  return (
    // OrbitControls sets touch-action:none, which blocks page scrolling on phones.
    // This !important rule wins over that inline style: vertical swipes scroll, sideways swipes turn.
    <Canvas
      className="![touch-action:pan-y] [&_canvas]:![touch-action:pan-y]"
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 8.4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => onReady?.()}
    >
      <StudioLights />
      <group rotation={[0, -0.35, 0]} scale={0.86}>
        <SareeCloth colorway={colorway} motif={motif} followPointer={false} />
      </group>
      <ContactShadows position={[0, -2.45, 0]} opacity={0.55} scale={8} blur={2.6} far={3} color="#000000" />
      <GoldDust count={80} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.6}
        autoRotate
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}

