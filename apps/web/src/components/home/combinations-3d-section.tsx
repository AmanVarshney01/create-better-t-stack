"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Clock, Infinity as InfinityIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ─── Left scene: Observable Universe — sparse cold particle sphere ─────────────

function UniverseParticles() {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const count = 420;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Fibonacci sphere for even distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y) * (1.6 + Math.random() * 0.5);
      const theta = phi * i;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y * (1.6 + Math.random() * 0.5);
      pos[i * 3 + 2] = Math.sin(theta) * r;

      // Cold blue-white palette
      const t = 0.5 + Math.random() * 0.5;
      colors[i * 3] = 0.55 + t * 0.2;
      colors[i * 3 + 1] = 0.65 + t * 0.2;
      colors[i * 3 + 2] = 0.85 + t * 0.15;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.07;
    ref.current.rotation.x = Math.sin(t * 0.04) * 0.08;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function UniverseScene() {
  return (
    <>
      <ambientLight intensity={0.04} />
      <pointLight position={[4, 3, 3]} intensity={0.8} color={0x8ab4f8} />
      <UniverseParticles />
    </>
  );
}

// ─── Right scene: YOLO Combinations — dense vibrant wave grid ─────────────────

const GRID_W = 52;
const GRID_H = 28;
const COUNT = GRID_W * GRID_H;

function CombinationsGrid() {
  const ref = useRef<THREE.Points>(null);

  const { geometry, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);

    const c1 = new THREE.Color(0x8b5cf6);
    const c2 = new THREE.Color(0x06b6d4);

    for (let i = 0; i < GRID_W; i++) {
      for (let j = 0; j < GRID_H; j++) {
        const idx = i * GRID_H + j;
        positions[idx * 3] = (i / (GRID_W - 1) - 0.5) * 14;
        positions[idx * 3 + 1] = (j / (GRID_H - 1) - 0.5) * 7;
        positions[idx * 3 + 2] = 0;

        const t = i / GRID_W;
        const col = c1.clone().lerp(c2, t);
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        phases[idx] = (i * 0.4 + j * 0.6) * 0.5;
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: g, phases };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < GRID_W; i++) {
      for (let j = 0; j < GRID_H; j++) {
        const idx = i * GRID_H + j;
        const z =
          Math.sin(t * 0.7 + phases[idx]) * 0.55 +
          Math.sin(t * 0.4 + i * 0.25) * 0.3 +
          Math.cos(t * 0.5 + j * 0.3) * 0.25;
        pos.setZ(idx, z);
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

function AccentNodes() {
  const meshes = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: (Math.random() - 0.5) * 13,
        y: (Math.random() - 0.5) * 6,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        color: [0x8b5cf6, 0x06b6d4, 0xf97316, 0x10b981][Math.floor(Math.random() * 4)] as number,
      })),
    [],
  );

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshes.forEach((m, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.position.z = Math.sin(t * m.speed + m.phase) * 0.8;
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(t * m.speed + m.phase) * 0.3;
    });
  });

  return (
    <>
      {meshes.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[m.x, m.y, 0]}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial
            color={m.color}
            emissive={m.color}
            emissiveIntensity={0.5}
            roughness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

function CombinationsScene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 6]} intensity={1.5} color={0x8b5cf6} />
      <CombinationsGrid />
      <AccentNodes />
    </>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

const funFacts = [
  "That's 167 trillion universe lifetimes to test all combinations",
  "More combinations than atoms in the observable universe",
  "Across TypeScript, Rust, Python, and Go ecosystems",
  "Each combination creates a unique, production-ready app",
  "YOLO mode doubles every single one of them",
];

export default function Combinations3dSection() {
  const [mounted, setMounted] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setFactIndex((i) => (i + 1) % funFacts.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-border py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <InfinityIcon className="h-5 w-5 text-foreground" />
          <h2 className="font-pixel text-lg font-bold sm:text-xl">Infinite Possibilities</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Mix and match frameworks, databases, auth, payments, AI, and more to create your perfect
          stack.
        </p>

        {/* Two 3D panels */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Left — universe sand */}
          <div className="overflow-hidden rounded-xl border border-border bg-[#03030a]">
            <div className="relative h-56">
              {mounted && (
                <Canvas
                  className="absolute inset-0"
                  camera={{ position: [0, 0, 4.2], fov: 55 }}
                  gl={{ antialias: true }}
                >
                  <UniverseScene />
                </Canvas>
              )}
            </div>
            <div className="border-t border-border px-4 py-3">
              <p className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground">
                Observable universe
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-bold">7.5</span>
                <span className="font-mono text-xl font-bold text-muted-foreground">× 10²⁴</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">grains of sand</p>
            </div>
          </div>

          {/* Right — combinations */}
          <div className="overflow-hidden rounded-xl border border-border bg-[#03030a]">
            <div className="relative h-56">
              {mounted && (
                <Canvas
                  className="absolute inset-0"
                  camera={{ position: [0, 0, 9], fov: 58 }}
                  gl={{ antialias: true }}
                >
                  <CombinationsScene />
                </Canvas>
              )}
            </div>
            <div className="border-t border-border px-4 py-3">
              <p className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground">
                Better Fullstack (YOLO mode)
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-bold">14.56</span>
                <span className="font-mono text-xl font-bold text-muted-foreground">× 10³⁴</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">valid project combinations</p>
            </div>
          </div>
        </div>

        {/* Comparison banner */}
        <div className="mt-3 rounded-lg border border-border bg-muted/20 px-4 py-3 text-center">
          <p className="text-sm">
            <span className="font-mono font-bold">19.4 billion ×</span>
            <span className="ml-1.5 text-muted-foreground">
              more combinations than all sand in the observable universe
            </span>
          </p>
        </div>

        {/* Rotating fun fact */}
        <div className="mt-3 h-5 overflow-hidden text-center">
          <p
            key={factIndex}
            className="animate-in fade-in slide-in-from-bottom-2 text-xs italic text-muted-foreground/80 duration-500 sm:text-sm"
          >
            {funFacts[factIndex]}
          </p>
        </div>

        {/* How long to test */}
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">How long to test every combination?</p>
            <p className="mt-1 text-muted-foreground">
              At 1ms per test: <span className="font-mono text-foreground">2.3 × 10²⁴ years</span> —
              that&apos;s{" "}
              <span className="font-medium text-foreground">167 trillion universe lifetimes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
