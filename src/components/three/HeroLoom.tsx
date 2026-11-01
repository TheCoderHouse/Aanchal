"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Colorway, Motif } from "@/data/types";
import { createSareeTextures } from "./sareeTexture";

/**
 * A traditional handloom, weaving on a loop:
 * 1. the heddle frames lift and drop, opening a "shed" between the warp threads
 * 2. the shuttle shoots across, trailing a gold weft thread
 * 3. the beater swings forward and packs the thread in; the cloth advances
 *
 * Layout (world units): the warp runs along z, from the back beam (z = -1.7)
 * to the fell line (z = FELL_Z) where finished cloth begins.
 */

const WIDTH = 3;
const BACK_Z = -1.7;
const HEDDLE_Z = -0.45;
const REED_Z = 0.2;
const FELL_Z = 0.55;
const FRONT_Z = 1.2;
const POST_X = 1.85;
const FLOOR_Y = -1.55;
const TOP_Y = 1.65;
const SHED = 0.19; // how far the threads open
const PICK_SECONDS = 2.6; // one full weaving cycle

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

type Props = {
  colorway: Colorway;
  motif: Motif;
  scroll?: React.RefObject<number>;
  threads?: number;
  /** Called when the weaving step changes: 0 = lift the shed, 1 = throw the shuttle, 2 = beat. */
  onPhase?: (phase: 0 | 1 | 2) => void;
};

export function HeroLoom({ colorway, motif, scroll, threads = 120, onPhase }: Props) {
  const root = useRef<THREE.Group>(null);
  const warp = useRef<THREE.LineSegments>(null);
  const harnessA = useRef<THREE.Group>(null);
  const harnessB = useRef<THREE.Group>(null);
  const beater = useRef<THREE.Group>(null);
  const shuttle = useRef<THREE.Group>(null);
  const weft = useRef<THREE.Mesh>(null);
  const clothMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const rollMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const warpMat = useRef<THREE.LineBasicMaterial>(null);
  const warpBeam = useRef<THREE.Mesh>(null);
  const clothBeam = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const lastPhase = useRef<number>(-1);

  // Thread x positions; odd threads go through harness A, even through B
  const xs = useMemo(
    () => Array.from({ length: threads }, (_, i) => -WIDTH / 2 + (i / (threads - 1)) * WIDTH),
    [threads],
  );

  // Warp: two segments per thread (back beam → heddle eye → fell)
  const warpPositions = useMemo(() => {
    const arr = new Float32Array(threads * 4 * 3);
    xs.forEach((x, i) => {
      arr.set([x, 0.12, BACK_Z, x, 0, HEDDLE_Z, x, 0, HEDDLE_Z, x, 0, FELL_Z], i * 12);
    });
    return arr;
  }, [xs, threads]);

  // Heddle wires for each harness (vertical lines at its threads)
  const heddleWires = useMemo(() => {
    const make = (odd: boolean) => {
      const pts: number[] = [];
      xs.forEach((x, i) => {
        if (i % 2 === (odd ? 1 : 0)) pts.push(x, -0.32, 0, x, 0.32, 0);
      });
      return new Float32Array(pts);
    };
    return { a: make(true), b: make(false) };
  }, [xs]);

  // Reed (comb) wires inside the beater
  const reedWires = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = -WIDTH / 2 + (i / 60) * WIDTH;
      pts.push(x, -0.3, 0, x, 0.25, 0);
    }
    return new Float32Array(pts);
  }, []);

  // Textures for the woven cloth (pattern runs along the cloth's length)
  useEffect(() => {
    const { map, mask } = createSareeTextures(colorway, motif);
    for (const t of [map, mask]) {
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 0.32);
    }
    const mats = [clothMat.current, rollMat.current];
    const old = mats.flatMap((m) => [m?.map, m?.roughnessMap]);
    mats.forEach((m) => {
      if (!m) return;
      m.map = map;
      m.roughnessMap = mask;
      m.metalnessMap = mask;
      m.needsUpdate = true;
    });
    warpMat.current?.color.set(colorway.base).lerp(new THREE.Color("#ffffff"), 0.12);
    new Set(old).forEach((t) => t?.dispose());
  }, [colorway, motif]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const pick = Math.floor(time / PICK_SECONDS);
    const t = (time % PICK_SECONDS) / PICK_SECONDS; // 0..1 within this pick
    const dir = pick % 2 === 0 ? 1 : -1;
    const phase = t < 0.14 ? 0 : t < 0.66 ? 1 : 2;
    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      onPhase?.(phase);
    }

    // 1. Shed change (0 → 0.14)
    const shed = THREE.MathUtils.lerp(-dir, dir, smooth(clamp01(t / 0.14))) * SHED;
    harnessA.current?.position.setY(shed);
    harnessB.current?.position.setY(-shed);
    const warpGeo = warp.current?.geometry;
    if (warpGeo) {
      const pos = warpGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < threads; i++) {
        const y = i % 2 ? shed : -shed;
        pos.setY(i * 4 + 1, y);
        pos.setY(i * 4 + 2, y);
      }
      pos.needsUpdate = true;
    }

    // 2. Shuttle crossing (0.14 → 0.62), alternating direction each pick
    const travel = smooth(clamp01((t - 0.14) / 0.48));
    const startX = -dir * (POST_X + 0.35);
    const shuttleX = THREE.MathUtils.lerp(startX, -startX, travel);
    if (shuttle.current) {
      shuttle.current.position.x = shuttleX;
      shuttle.current.rotation.y = dir > 0 ? 0 : Math.PI;
      shuttle.current.visible = t > 0.1 && t < 0.7;
    }
    // Gold weft thread trailing behind the shuttle, fading after the beat
    if (weft.current) {
      const from = THREE.MathUtils.clamp(startX, -WIDTH / 2, WIDTH / 2);
      const to = THREE.MathUtils.clamp(shuttleX, -WIDTH / 2, WIDTH / 2);
      const length = Math.max(0.001, Math.abs(to - from));
      weft.current.scale.x = length;
      weft.current.position.x = (from + to) / 2;
      const beatDone = clamp01((t - 0.8) / 0.15);
      weft.current.position.z = THREE.MathUtils.lerp(REED_Z + 0.12, FELL_Z, smooth(clamp01((t - 0.66) / 0.14)));
      (weft.current.material as THREE.MeshStandardMaterial).opacity = t < 0.14 ? 0 : 1 - beatDone;
    }

    // 3. Beat (0.66 → 0.86): beater swings to the fell and back
    const beat = clamp01((t - 0.66) / 0.2);
    if (beater.current) beater.current.rotation.x = Math.sin(beat * Math.PI) * 0.2;

    // Cloth advances by one pick at the moment of the beat
    const advance = (pick + smooth(clamp01((t - 0.72) / 0.12))) * 0.006;
    if (clothMat.current?.map) {
      clothMat.current.map.offset.y = -advance;
      if (clothMat.current.roughnessMap) clothMat.current.roughnessMap.offset.y = -advance;
    }
    if (clothBeam.current) clothBeam.current.rotation.x = -advance * 6;
    if (warpBeam.current) warpBeam.current.rotation.x = -advance * 4;

    // Gentle turn towards the pointer; scroll pulls the camera's view around
    pointer.current.x += (state.pointer.x - pointer.current.x) * Math.min(delta * 2, 1);
    pointer.current.y += (state.pointer.y - pointer.current.y) * Math.min(delta * 2, 1);
    if (root.current) {
      const s = scroll?.current ?? 0;
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, -0.62 + pointer.current.x * 0.18 + s * 0.6, 0.05);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, 0.08 - pointer.current.y * 0.05, 0.05);
      root.current.position.y = s * 1.6;
    }
  });

  // Radial fade so the floor melts into the background
  const floorFade = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.55, "#888888");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4a2a19", roughness: 0.72, metalness: 0.05 }), []);
  const darkWood = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2e1a10", roughness: 0.8 }), []);
  const brass = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9a256", roughness: 0.25, metalness: 1 }), []);

  return (
    <group ref={root}>
      {/* ── Frame ── */}
      {[-1, 1].map((side) =>
        [BACK_Z, FRONT_Z].map((z) => (
          <mesh key={`${side}${z}`} position={[side * POST_X, (TOP_Y + FLOOR_Y) / 2, z]} material={wood} castShadow>
            <boxGeometry args={[0.13, TOP_Y - FLOOR_Y, 0.13]} />
          </mesh>
        )),
      )}
      {/* Side rails, top and bottom */}
      {[-1, 1].map((side) =>
        [TOP_Y, FLOOR_Y + 0.2].map((y) => (
          <mesh key={`rail${side}${y}`} position={[side * POST_X, y, (BACK_Z + FRONT_Z) / 2]} material={wood}>
            <boxGeometry args={[0.11, 0.11, FRONT_Z - BACK_Z + 0.13]} />
          </mesh>
        )),
      )}
      {/* Top cross beams */}
      {[HEDDLE_Z, REED_Z].map((z) => (
        <mesh key={`top${z}`} position={[0, TOP_Y, z]} material={wood}>
          <boxGeometry args={[POST_X * 2 + 0.13, 0.11, 0.11]} />
        </mesh>
      ))}

      {/* Warp beam (back) with wound silk */}
      <mesh ref={warpBeam} position={[0, 0.0, BACK_Z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, WIDTH + 0.1, 32]} />
        <meshStandardMaterial color={colorway.base} roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.0, BACK_Z]} rotation={[0, 0, Math.PI / 2]} material={darkWood}>
        <cylinderGeometry args={[0.07, 0.07, POST_X * 2 + 0.2, 16]} />
      </mesh>

      {/* Warp threads */}
      <lineSegments ref={warp}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[warpPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={warpMat} transparent opacity={0.85} />
      </lineSegments>

      {/* Heddle frames (harnesses) */}
      {[
        { ref: harnessA, wires: heddleWires.a, dz: -0.06 },
        { ref: harnessB, wires: heddleWires.b, dz: 0.06 },
      ].map(({ ref, wires, dz }, i) => (
        <group key={i} ref={ref} position={[0, 0, HEDDLE_Z + dz]}>
          {[-0.34, 0.34].map((y) => (
            <mesh key={y} position={[0, y, 0]} material={wood}>
              <boxGeometry args={[WIDTH + 0.3, 0.05, 0.04]} />
            </mesh>
          ))}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[wires, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#b7a37a" transparent opacity={0.55} />
          </lineSegments>
          {/* Cords up to the top beam */}
          {[-1.3, 1.3].map((x) => (
            <mesh key={x} position={[x, 0.34 + (TOP_Y - 0.34) / 2, 0]}>
              <cylinderGeometry args={[0.008, 0.008, TOP_Y - 0.34, 6]} />
              <meshStandardMaterial color="#d9c9aa" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Beater with reed, swinging from the top */}
      <group position={[0, TOP_Y - 0.05, REED_Z]}>
        <group ref={beater}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * (POST_X - 0.12), -(TOP_Y - 0.05) / 2, 0]} material={wood}>
              <boxGeometry args={[0.07, TOP_Y + 0.1, 0.07]} />
            </mesh>
          ))}
          <group position={[0, -(TOP_Y - 0.05), 0]}>
            {[-0.32, 0.27].map((y) => (
              <mesh key={y} position={[0, y, 0]} material={wood}>
                <boxGeometry args={[POST_X * 2 - 0.15, y < 0 ? 0.12 : 0.06, 0.1]} />
              </mesh>
            ))}
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[reedWires, 3]} />
              </bufferGeometry>
              <lineBasicMaterial color="#d6b36c" transparent opacity={0.5} />
            </lineSegments>
          </group>
        </group>
      </group>

      {/* Shuttle with a spool of gold thread */}
      <group ref={shuttle} position={[0, 0, REED_Z + 0.12]}>
        {/* Boat-shaped body */}
        <mesh scale={[1, 0.5, 0.75]} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 8, 20]} />
          <meshStandardMaterial color="#8a5530" roughness={0.45} metalness={0.05} />
        </mesh>
        {/* Brass tips */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.31, 0, 0]} rotation={[0, 0, side * -Math.PI / 2]} material={brass}>
            <coneGeometry args={[0.035, 0.09, 16]} />
          </mesh>
        ))}
        {/* Spool of gold zari */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.24, 16]} />
          <meshStandardMaterial color="#e6cf96" metalness={1} roughness={0.2} emissive="#6f5626" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Gold weft thread being laid */}
      <mesh ref={weft} position={[0, 0, REED_Z + 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
        <meshStandardMaterial
          color="#f1e3c0"
          emissive="#d6b36c"
          emissiveIntensity={1.2}
          metalness={1}
          roughness={0.2}
          transparent
        />
      </mesh>

      {/* Woven cloth, from the fell line to the breast beam */}
      <mesh position={[0, 0, (FELL_Z + FRONT_Z) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH, FRONT_Z - FELL_Z]} />
        <meshPhysicalMaterial
          ref={clothMat}
          side={THREE.DoubleSide}
          roughness={1}
          metalness={1}
          sheen={1}
          sheenRoughness={0.35}
          sheenColor="#f1e3c0"
          envMapIntensity={1.6}
        />
      </mesh>
      {/* Breast beam the cloth passes over */}
      <mesh position={[0, -0.05, FRONT_Z]} rotation={[0, 0, Math.PI / 2]} material={wood}>
        <cylinderGeometry args={[0.06, 0.06, POST_X * 2 + 0.1, 16]} />
      </mesh>
      {/* Cloth beam below, with the finished saree rolled on it */}
      <mesh ref={clothBeam} position={[0, -0.6, FRONT_Z - 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, WIDTH, 48, 1, true]} />
        <meshPhysicalMaterial ref={rollMat} roughness={1} metalness={1} sheen={1} sheenColor="#f1e3c0" envMapIntensity={1.6} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (WIDTH / 2 + 0.02), -0.6, FRONT_Z - 0.12]} rotation={[0, 0, Math.PI / 2]} material={brass}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
        </mesh>
      ))}

      {/* Weaver's bench */}
      <group position={[0, FLOOR_Y, FRONT_Z + 0.9]}>
        <mesh position={[0, 0.55, 0]} material={wood} castShadow>
          <boxGeometry args={[1.6, 0.08, 0.45]} />
        </mesh>
        {[-0.65, 0.65].map((x) => (
          <mesh key={x} position={[x, 0.27, 0]} material={darkWood}>
            <boxGeometry args={[0.08, 0.55, 0.38]} />
          </mesh>
        ))}
      </group>

      {/* Brass lamp hanging above */}
      <group position={[0.4, TOP_Y + 0.55, 0.2]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 1.2, 6]} />
          <meshStandardMaterial color="#2e1a10" />
        </mesh>
        <mesh material={brass}>
          <coneGeometry args={[0.28, 0.22, 32, 1, true]} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#fff1d6" emissive="#ffd9a0" emissiveIntensity={4} />
        </mesh>
        {/* Soft beam of light falling on the loom */}
        <mesh position={[0, -1.5, 0]}>
          <coneGeometry args={[1.3, 2.9, 48, 1, true]} />
          <meshBasicMaterial
            color="#ffd9a0"
            transparent
            opacity={0.016}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <spotLight position={[0, -0.1, 0]} angle={0.75} penumbra={0.7} intensity={45} distance={9} color="#ffdcae" castShadow={false} />
      </group>

      {/* Floor */}
      <mesh position={[0, FLOOR_Y, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#24120f" roughness={0.9} transparent alphaMap={floorFade} depthWrite={false} />
      </mesh>
    </group>
  );
}
