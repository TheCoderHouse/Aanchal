"use client";

import { Environment, Lightformer } from "@react-three/drei";

/** Warm key light, wine rim light, and reflection panels for the zari (no downloads). */
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight position={[-4, 6, 6]} angle={0.5} penumbra={0.8} intensity={60} color="#fff1d6" />
      <pointLight position={[3, -2, -3]} intensity={18} color="#a12d52" />
      <pointLight position={[4, 3, 3]} intensity={8} color="#e6cf96" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.5} color="#fff1d6" position={[-3, 3, 4]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e6cf96" position={[4, -1, 3]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#a12d52" position={[0, 0, -5]} scale={4} />
      </Environment>
    </>
  );
}
