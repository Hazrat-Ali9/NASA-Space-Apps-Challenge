"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Galaxy() {
  const ref = useRef();
  const { pos, col } = useMemo(() => {
    const N = 45000, R = 8, branches = 4, spin = 1.3;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const inner = new THREE.Color("#ffb066"), outer = new THREE.Color("#4a6bff");
    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(), 1.6) * R;
      const a = ((i % branches) / branches) * Math.PI * 2 + r * spin;
      const spread = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35 * r;
      pos.set([Math.cos(a) * r + spread(), spread() * 0.35, Math.sin(a) * r + spread()], i * 3);
      const c = inner.clone().lerp(outer, r / R);
      col.set([c.r, c.g, c.b], i * 3);
    }
    return { pos, col };
  }, []);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.03; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={pos.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={col} count={col.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.022} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

function Stars() {
  const pos = useMemo(() => {
    const a = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 40);
      a.set([v.x, v.y, v.z], i * 3);
    }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={pos} count={pos.length / 3} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.09} color="#e9ecff" transparent opacity={0.8} depthWrite={false} />
    </points>
  );
}

function makeTexture(color, gas, seed) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = color; g.fillRect(0, 0, 512, 256);
  let k = seed * 9301 + 49297;
  const rnd = () => (k = (k * 9301 + 49297) % 233280) / 233280;
  const tone = () => (rnd() > 0.5 ? "255,255,255" : "0,0,20");
  if (gas) {
    for (let y = 0; y < 256; y += 4) { g.fillStyle = `rgba(${tone()},${rnd() * 0.22})`; g.fillRect(0, y, 512, 4 + rnd() * 10); }
  } else {
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${tone()},${rnd() * 0.18})`; g.beginPath(); g.arc(rnd() * 512, rnd() * 256, 4 + rnd() * 26, 0, 7); g.fill(); }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Planet({ p, index, active }) {
  const orbit = useRef(), body = useRef();
  const tex = useMemo(() => makeTexture(p.color, p.gas, index + 1), [p.color, p.gas, index]);
  const phase = index * 1.7;
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime * p.speed + phase;
    orbit.current.position.set(Math.cos(t) * p.dist, 0, Math.sin(t) * p.dist);
    body.current.rotation.y += dt * 0.4;
    const s = THREE.MathUtils.lerp(orbit.current.scale.x, active ? 1.9 : 1, 0.08);
    orbit.current.scale.setScalar(s);
  });
  return (
    <group ref={orbit}>
      <mesh ref={body}>
        <sphereGeometry args={[p.size, 48, 48]} />
        <meshStandardMaterial map={tex} roughness={0.75} emissive={p.color} emissiveIntensity={active ? 0.35 : 0.08} />
      </mesh>
      <mesh>
        <sphereGeometry args={[p.size * 1.35, 32, 32]} />
        <meshBasicMaterial color={p.color} transparent opacity={active ? 0.3 : 0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Rig({ active, planets }) {
  const system = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  useFrame(({ camera, pointer }) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, pointer.x, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, pointer.y, 0.05);
    const ang = p * Math.PI * 1.2;
    const rad = THREE.MathUtils.lerp(13, 7, p);
    camera.position.set(Math.sin(ang) * rad + mouse.current.x, THREE.MathUtils.lerp(5, 2.2, p) + mouse.current.y * 0.6, Math.cos(ang) * rad);
    camera.lookAt(0, 0, 0);
    system.current.rotation.z = 0.25;
  });
  return (
    <group ref={system}>
      <Galaxy />
      <mesh><sphereGeometry args={[0.35, 32, 32]} /><meshBasicMaterial color="#ffd9a0" /></mesh>
      <pointLight color="#ffb066" intensity={30} distance={20} />
      {planets.map((p, i) => <Planet key={p.name} p={p} index={i} active={active === i} />)}
    </group>
  );
}

export default function Scene({ active, planets }) {
  return (
    <Canvas camera={{ fov: 55, position: [0, 5, 13] }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <color attach="background" args={["#04050d"]} />
      <ambientLight intensity={0.25} />
      <Stars />
      <Rig active={active} planets={planets} />
    </Canvas>
  );
}
