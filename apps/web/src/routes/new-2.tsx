"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Footer from "@/components/home/footer";

export const Route = createFileRoute("/new-2")({
  component: Page2,
});

type PM = "bun" | "pnpm" | "npm";
const PM_COMMANDS: Record<PM, string> = {
  bun: "bun create better-fullstack@latest",
  pnpm: "pnpm create better-fullstack@latest",
  npm: "npx create-better-fullstack@latest",
};

// ─── Scene: Full-Stack Layer Rings ───────────────────────────────────────────
// Each torus represents a layer of a full-stack app, stacked and rotating.

const LAYERS = [
  { label: "Frontend", color: 0x8b5cf6, radius: 3.8, tube: 0.055, speed: 0.22, tilt: 0.18 },
  { label: "Backend", color: 0x7c3aed, radius: 3.3, tube: 0.055, speed: -0.18, tilt: -0.14 },
  { label: "API", color: 0x06b6d4, radius: 2.8, tube: 0.055, speed: 0.28, tilt: 0.22 },
  { label: "Database", color: 0x0891b2, radius: 2.3, tube: 0.055, speed: -0.24, tilt: -0.1 },
  { label: "Auth", color: 0x10b981, radius: 1.8, tube: 0.055, speed: 0.32, tilt: 0.26 },
  { label: "Payments", color: 0xf59e0b, radius: 1.3, tube: 0.055, speed: -0.2, tilt: -0.18 },
  { label: "AI", color: 0xec4899, radius: 0.8, tube: 0.055, speed: 0.38, tilt: 0.3 },
];

function LayerRing({ layer, index }: { layer: (typeof LAYERS)[0]; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const yBase = (index - (LAYERS.length - 1) / 2) * 0.85;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * layer.speed;
    ref.current.rotation.x = layer.tilt + Math.sin(t * 0.3 + index) * 0.06;
    ref.current.position.y = yBase + Math.sin(t * 0.4 + index * 0.9) * 0.12;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.4 + Math.sin(t * 0.6 + index) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, yBase, 0]}>
      <torusGeometry args={[layer.radius, layer.tube, 16, 80]} />
      <meshStandardMaterial
        color={layer.color}
        emissive={layer.color}
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

function StackRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {LAYERS.map((layer, i) => (
        <LayerRing key={layer.label} layer={layer} index={i} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 8, 4]} intensity={2} color={0x8b5cf6} />
      <pointLight position={[0, -8, 4]} intensity={1.5} color={0x06b6d4} />
      <pointLight position={[6, 0, 2]} intensity={1} color={0xec4899} />
      <StackRings />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Page2() {
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
        {/* 3D canvas first — it IS the hero */}
        <div className="relative h-[520px] w-full overflow-hidden bg-[#030305]">
          {mounted && (
            <Canvas camera={{ position: [0, 1, 11], fov: 50 }} gl={{ antialias: true }}>
              <Scene />
            </Canvas>
          )}
          {/* Overlaid heading */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-10">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl">
              The full-stack app scaffolder
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Frontend · Backend · API · Database · Auth · Payments · AI
            </p>
          </div>
          {/* Gradient fade to bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Command palette */}
        <div className="flex flex-col items-center border-b border-border px-6 pb-10 pt-4">
          <div className="w-full max-w-lg">
            <div className="flex border-b border-border">
              {(["bun", "pnpm", "npm"] as PM[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPm(p)}
                  className={`border-b-2 px-4 py-2 font-mono text-xs transition-colors ${pm === p ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <code className="truncate font-mono text-sm">{PM_COMMANDS[pm]}</code>
                <button
                  type="button"
                  onClick={copy}
                  className="ml-4 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Link
                to="/new"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-4 py-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Builder <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
              7.28 × 10³⁴ valid combinations across 4 ecosystems
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
