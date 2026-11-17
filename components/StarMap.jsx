"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function StarMap({ rows, min, sel, onSelect }) {
  const { pos, col } = useMemo(() => {
    const pos = new Float32Array(rows.length * 3), col = new Float32Array(rows.length * 3), c = new THREE.Color();
    rows.forEach((p, i) => {
      pos.set(p.pos, i * 3);
      c.setHSL(0.62 - 0.25 * p.score, 0.9, p.score >= min ? 0.35 + 0.35 * p.score : 0);
      col.set([c.r, c.g, c.b], i * 3);
    });
    return { pos, col };
  }, [rows, min]);
  const s = sel != null ? rows[sel] : null;

  return (
    <Canvas camera={{ position: [0, 9, 18], fov: 55 }} raycaster={{ params: { Points: { threshold: 0.2 } } }} dpr={[1, 1.75]}>
      <color attach="background" args={["#04050d"]} />
      <points key={`${rows.length}:${min}`} onClick={(e) => { e.stopPropagation(); if (rows[e.index].score >= min) onSelect(e.index); }}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={pos} count={rows.length} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={col} count={rows.length} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.22} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <mesh><sphereGeometry args={[0.25, 24, 24]} /><meshBasicMaterial color="#ffd9a0" /></mesh>
      <gridHelper args={[24, 24, "#1b2150", "#0d1130"]} />
      {s && <mesh position={s.pos}><sphereGeometry args={[0.35, 16, 16]} /><meshBasicMaterial color="#ffffff" wireframe /></mesh>}
      <OrbitControls enableDamping autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}
