"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import Footer from "@/components/home/footer";

export const Route = createFileRoute("/new-1")({
  component: Page1,
});

type PM = "bun" | "pnpm" | "npm";
const PM_COMMANDS: Record<PM, string> = {
  bun: "bun create better-fullstack@latest",
  pnpm: "pnpm create better-fullstack@latest",
  npm: "npx create-better-fullstack@latest",
};

// ─── Scene: Interconnected Node Network ──────────────────────────────────────
// Each glowing node is a technology choice; edges are compatibility links.

const COLORS = [0x8b5cf6, 0xf97316, 0x3b82f6, 0x06b6d4, 0x10b981, 0xec4899];

interface NodeData {
  pos: THREE.Vector3;
  size: number;
  phase: number;
  speed: number;
  color: number;
}

function Node({ data, idx }: { data: NodeData; idx: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const oy = data.pos.y;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = oy + Math.sin(t * data.speed + data.phase) * 0.2;
    const s = 0.85 + Math.sin(t * data.speed * 1.4 + data.phase) * 0.15;
    ref.current.scale.setScalar(s);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.4 + Math.sin(t * data.speed + data.phase + idx) * 0.3;
  });

  return (
    <mesh ref={ref} position={[data.pos.x, data.pos.y, data.pos.z]}>
      <sphereGeometry args={[data.size, 12, 12]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function Edges({ nodes }: { nodes: NodeData[] }) {
  const geo = useMemo(() => {
    const verts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 3.4) {
          const a = nodes[i].pos,
            b = nodes[j].pos;
          verts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    return g;
  }, [nodes]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={0xffffff} transparent opacity={0.07} />
    </lineSegments>
  );
}

function Network() {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo<NodeData[]>(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 5,
        ),
        size: Math.random() * 0.09 + 0.04,
        phase: (i / 30) * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.15,
        color: COLORS[i % COLORS.length],
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Edges nodes={nodes} />
      {nodes.map((n, i) => (
        <Node key={i} data={n} idx={i} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[6, 5, 5]} intensity={2} color={0x8b5cf6} />
      <pointLight position={[-6, -3, 3]} intensity={1.5} color={0x06b6d4} />
      <Network />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Page1() {
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
        {/* Hero text */}
        <div className="flex flex-col items-center px-6 pt-16 pb-10 text-center">
          <h1 className="max-w-2xl font-mono text-3xl font-bold tracking-tight sm:text-5xl">
            The full-stack app scaffolder
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Every node is a choice. Every edge is a compatibility. Pick your graph.
          </p>

          {/* Command palette */}
          <div className="mt-8 w-full max-w-lg">
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
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
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
          </div>
        </div>

        {/* 3D canvas — full bleed */}
        <div className="relative h-[480px] w-full overflow-hidden border-y border-border bg-[#04040a]">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 14], fov: 55 }} gl={{ antialias: true }}>
              <Scene />
            </Canvas>
          )}
          <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="rounded-full border border-white/10 bg-black/60 px-4 py-1.5 font-mono text-xs text-white/40 backdrop-blur-sm">
              7.28 × 10³⁴ valid combinations · TypeScript · Rust · Python · Go
            </span>
          </div>
        </div>

        <div className="flex justify-center py-10">
          <Link
            to="/new"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Open Builder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Footer />
      </div>
    </main>
  );
}
