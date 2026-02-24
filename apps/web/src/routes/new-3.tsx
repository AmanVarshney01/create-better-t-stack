"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import Footer from "@/components/home/footer";

export const Route = createFileRoute("/new-3")({
  component: Page3,
});

type PM = "bun" | "pnpm" | "npm";
const PM_COMMANDS: Record<PM, string> = {
  bun: "bun create better-fullstack@latest",
  pnpm: "pnpm create better-fullstack@latest",
  npm: "npx create-better-fullstack@latest",
};

// ─── Scene: Particle Scaffold Grid ───────────────────────────────────────────
// A wave of glowing particles forming a grid — "scaffolding" being assembled.

const GRID_W = 52;
const GRID_H = 28;
const COUNT = GRID_W * GRID_H;

function ParticleGrid() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);

    const c1 = new THREE.Color(0x8b5cf6);
    const c2 = new THREE.Color(0x06b6d4);

    for (let i = 0; i < GRID_W; i++) {
      for (let j = 0; j < GRID_H; j++) {
        const idx = i * GRID_H + j;
        positions[idx * 3 + 0] = (i / (GRID_W - 1) - 0.5) * 14;
        positions[idx * 3 + 1] = (j / (GRID_H - 1) - 0.5) * 7;
        positions[idx * 3 + 2] = 0;

        const t = i / GRID_W;
        const col = c1.clone().lerp(c2, t);
        colors[idx * 3 + 0] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        phases[idx] = (i * 0.4 + j * 0.6) * 0.5;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geo, phases };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < GRID_W; i++) {
      for (let j = 0; j < GRID_H; j++) {
        const idx = i * GRID_H + j;
        const baseZ =
          Math.sin(t * 0.7 + phases[idx]) * 0.55 +
          Math.sin(t * 0.4 + i * 0.25) * 0.3 +
          Math.cos(t * 0.5 + j * 0.3) * 0.25;
        pos.setZ(idx, baseZ);
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

// Sparse larger accent nodes on top
function AccentNodes() {
  const meshes = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: (Math.random() - 0.5) * 13,
        y: (Math.random() - 0.5) * 6,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        color: [0x8b5cf6, 0x06b6d4, 0xf97316, 0x10b981][Math.floor(Math.random() * 4)],
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

function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 6]} intensity={1.5} color={0x8b5cf6} />
      <ParticleGrid />
      <AccentNodes />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.15} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Page3() {
  const [pm, setPm] = useState<PM>("bun");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const copy = () => {
    navigator.clipboard.writeText(PM_COMMANDS[pm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-svh">
      <div className="mx-auto max-w-5xl border-x border-border">
        {/* Left-right layout on desktop */}
        <div className="grid min-h-[calc(100svh-3.5rem)] grid-cols-1 lg:grid-cols-[420px_1fr]">
          {/* Left — text + command */}
          <div className="flex flex-col justify-center border-b border-border px-8 py-12 lg:border-b-0 lg:border-r">
            <p className="font-pixel text-[10px] uppercase tracking-widest text-muted-foreground">
              Scaffolding tool
            </p>
            <h1 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              The full-stack
              <br />
              app scaffolder
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Every particle is a project file. Watch your stack assemble.
            </p>

            <div className="mt-8 rounded-lg border border-border bg-muted/10 p-4">
              <p className="font-pixel text-[10px] uppercase tracking-widest text-muted-foreground">
                Combinations
              </p>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-bold">7.28</span>
                <span className="font-mono text-base font-bold text-muted-foreground"> × 10³⁴</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                TypeScript · Rust · Python · Go
              </p>
            </div>

            {/* PM tabs */}
            <div className="mt-6 flex gap-0 border-b border-border">
              {(["bun", "pnpm", "npm"] as PM[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPm(p)}
                  className={`border-b-2 px-3 py-1.5 font-mono text-xs transition-colors ${pm === p ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <code className="truncate font-mono text-xs">{PM_COMMANDS[pm]}</code>
              <button
                type="button"
                onClick={copy}
                className="ml-3 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <Link
              to="/new"
              className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Open Builder <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Right — 3D scene, flush */}
          <div className="relative min-h-[420px] bg-[#04040a] lg:min-h-0">
            {mounted && (
              <Canvas
                className="absolute inset-0"
                camera={{ position: [0, 0, 9], fov: 58 }}
                gl={{ antialias: true }}
              >
                <Scene />
              </Canvas>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
