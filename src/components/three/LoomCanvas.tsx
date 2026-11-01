"use client";

import { Canvas } from "@react-three/fiber";
import type { Colorway, Motif } from "@/data/types";
import { GoldDust } from "./FloatingParticles";
import { HeroLoom } from "./HeroLoom";
import { StudioLights } from "./StudioLights";

type Props = {
  colorway: Colorway;
  motif: Motif;
  onPhase?: (phase: 0 | 1 | 2) => void;
  lite?: boolean;
};

/** The animated handloom on its own, for the Our Story page. */
export default function LoomCanvas({ colorway, motif, onPhase, lite = false }: Props) {
  return (
    <Canvas dpr={lite ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0.6, 7.6], fov: 38 }} gl={{ antialias: true, alpha: true }}>
      <StudioLights />
      <group position={[0, -0.35, 0]} scale={lite ? 0.62 : 0.85}>
        <HeroLoom colorway={colorway} motif={motif} threads={lite ? 70 : 120} onPhase={onPhase} />
      </group>
      <GoldDust count={lite ? 60 : 140} />
    </Canvas>
  );
}
