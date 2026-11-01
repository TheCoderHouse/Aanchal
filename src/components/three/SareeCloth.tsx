"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Colorway, Motif } from "@/data/types";
import { createSareeTextures } from "./sareeTexture";

const WIDTH = 3.2;
const HEIGHT = 4.8;
const SEG_X = 48;
const SEG_Y = 72;

type SareeClothProps = {
  colorway: Colorway;
  motif: Motif;
  /** 0..1 scroll progress through the hero, read every frame */
  scroll?: React.RefObject<number>;
  /** Hero: the cloth turns towards the mouse. Product viewer: off (OrbitControls rotate instead). */
  followPointer?: boolean;
};

/**
 * A silk saree hanging from a gold rod. Vertices are moved every frame:
 * the top edge stays pinned, and waves grow stronger towards the hem.
 * Moving the mouse changes the "wind".
 */
export function SareeCloth({ colorway, motif, scroll, followPointer = true }: SareeClothProps) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const gust = useRef(0);
  const wind = useRef({ x: 0, y: 0 });

  const material = useRef<THREE.MeshPhysicalMaterial>(null);

  // Swap textures when the colourway changes, with a gust of wind
  useEffect(() => {
    const m = material.current;
    if (!m) return;
    const { map, mask } = createSareeTextures(colorway, motif);
    const old = [m.map, m.roughnessMap];
    m.map = map;
    m.roughnessMap = mask;
    m.metalnessMap = mask;
    m.needsUpdate = true;
    gust.current = 1;
    old.forEach((t) => t?.dispose());
  }, [colorway, motif]);

  // Free the textures when the hero unmounts
  useEffect(() => {
    const m = material.current;
    return () => {
      m?.map?.dispose();
      m?.roughnessMap?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    const geometry = mesh.current?.geometry;
    if (!geometry) return;
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    // Keep the flat starting shape so every frame displaces from it
    if (!geometry.userData.rest) geometry.userData.rest = Float32Array.from(pos.array);
    const rest = geometry.userData.rest as Float32Array;

    // Smoothly follow the pointer; the gust decays over ~1.5s
    const px = followPointer ? state.pointer.x : 0;
    const py = followPointer ? state.pointer.y : 0;
    wind.current.x += (px - wind.current.x) * Math.min(delta * 2, 1);
    wind.current.y += (py - wind.current.y) * Math.min(delta * 2, 1);
    gust.current = Math.max(0, gust.current - delta * 0.7);
    const strength = 1 + Math.abs(wind.current.x) * 0.8 + gust.current * 1.6;

    for (let i = 0; i < pos.count; i++) {
      const x = rest[i * 3];
      const y = rest[i * 3 + 1];
      // 0 at the rod, 1 at the hem
      const fall = Math.max(0, (HEIGHT / 2 - y) / HEIGHT);
      const f = Math.pow(fall, 1.35);

      // Soft vertical pleats + travelling waves
      const pleat = (Math.sin(x * 5.5) * 0.09 + Math.sin(x * 2.3 + 1.2) * 0.05) * (0.5 + fall);
      // A large static curve so the saree billows towards the viewer
      const billow = Math.sin((x / WIDTH + 0.5) * Math.PI) * 0.45 * f * f;
      const wave =
        Math.sin(x * 1.7 + t * 1.3 + y * 0.9) * 0.22 +
        Math.sin(y * 2.3 - t * 1.05 + x * 0.4) * 0.11 +
        Math.sin(x * 3.1 - t * 2.1) * 0.04;
      const z = pleat + billow + wave * f * strength + wind.current.x * 0.35 * f;
      const sway = Math.sin(t * 0.6 + y * 0.5) * 0.06 * f + wind.current.x * 0.12 * f;

      pos.setXYZ(i, x + sway, y + Math.abs(z) * -0.04 * f, z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Gentle turn towards the pointer; drift away on scroll
    if (group.current && followPointer) {
      const s = scroll?.current ?? 0;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        -0.42 + wind.current.x * 0.25 + s * 0.9,
        0.05,
      );
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, wind.current.y * -0.06, 0.05);
      group.current.position.y = s * 2.2;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <planeGeometry args={[WIDTH, HEIGHT, SEG_X, SEG_Y]} />
        <meshPhysicalMaterial
          ref={material}
          side={THREE.DoubleSide}
          roughness={1}
          metalness={1}
          sheen={1}
          sheenRoughness={0.35}
          sheenColor="#f1e3c0"
          clearcoat={0.15}
          clearcoatRoughness={0.6}
          envMapIntensity={1.8}
        />
      </mesh>
      <GoldRod />
    </group>
  );
}

function GoldRod() {
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d6b36c", metalness: 1, roughness: 0.22 }),
    [],
  );
  const y = HEIGHT / 2 + 0.04;
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={gold}>
        <cylinderGeometry args={[0.035, 0.035, WIDTH + 0.5, 24]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (WIDTH / 2 + 0.3), 0, 0]}>
          <mesh material={gold}>
            <sphereGeometry args={[0.08, 24, 24]} />
          </mesh>
          <mesh material={gold} position={[side * 0.1, 0, 0]} rotation={[0, 0, side * -Math.PI / 2]}>
            <coneGeometry args={[0.05, 0.14, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
