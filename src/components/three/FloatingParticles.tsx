"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/random";

/** Rising specks of gold dust. */
export function GoldDust({ count = 260 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const random = seededRandom(7);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 14;
      positions[i * 3 + 1] = (random() - 0.5) * 9;
      positions[i * 3 + 2] = (random() - 0.5) * 6 - 1;
      speeds[i] = 0.05 + random() * 0.15;
    }
    return { positions, speeds };
  }, [count]);

  const texture = useMemo(() => {
    // Soft round sprite
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,240,200,1)");
    g.addColorStop(0.3, "rgba(230,200,130,0.8)");
    g.addColorStop(1, "rgba(230,200,130,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((state, delta) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * delta;
      if (y > 4.5) y = -4.5;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.5 + i) * 0.0015);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.07}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#f1e3c0"
      />
    </points>
  );
}

/** Marigold and rose petals drifting down and tumbling. */
export function Petals({ count = 36 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.07);
    s.bezierCurveTo(0.06, -0.04, 0.05, 0.05, 0, 0.08);
    s.bezierCurveTo(-0.05, 0.05, -0.06, -0.04, 0, -0.07);
    return new THREE.ShapeGeometry(s, 8);
  }, []);

  const petals = useMemo(() => {
    const random = seededRandom(42);
    return Array.from({ length: count }, () => ({
        x: (random() - 0.5) * 12,
        y: random() * 9 - 4.5,
        z: (random() - 0.5) * 4,
        speed: 0.18 + random() * 0.3,
        spin: (random() - 0.5) * 2,
        phase: random() * Math.PI * 2,
        scale: 0.7 + random() * 0.8,
      }));
  }, [count]);

  const colors = useMemo(() => {
    const palette = ["#e39a2d", "#f0b648", "#c2186b", "#a12d52", "#f1e3c0"].map((c) => new THREE.Color(c));
    return petals.map((_, i) => palette[i % palette.length]);
  }, [petals]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    petals.forEach((p, i) => {
      p.y -= p.speed * delta;
      if (p.y < -4.8) {
        p.y = 4.8;
        p.x = (Math.random() - 0.5) * 12;
      }
      dummy.position.set(p.x + Math.sin(t * 0.8 + p.phase) * 0.4, p.y, p.z);
      dummy.rotation.set(t * p.spin + p.phase, t * p.spin * 0.7, Math.sin(t + p.phase));
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={(m) => {
        mesh.current = m;
        // Set colours once when the mesh mounts
        if (m) colors.forEach((c, i) => m.setColorAt(i, c));
      }}
      args={[geometry, undefined, count]}
    >
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.6} metalness={0.05} />
    </instancedMesh>
  );
}
