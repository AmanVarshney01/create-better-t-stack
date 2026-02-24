"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import Footer from "@/components/home/footer";

export const Route = createFileRoute("/new-4")({
  component: Page4,
});

type PM = "bun" | "pnpm" | "npm";
const PM_COMMANDS: Record<PM, string> = {
  bun: "bun create better-fullstack@latest",
  pnpm: "pnpm create better-fullstack@latest",
  npm: "npx create-better-fullstack@latest",
};

// ─── Scene: Ecosystem Orbs ───────────────────────────────────────────────────
// A central wireframe icosahedron orbited by 4 glowing language spheres.

const ORBITERS = [
  { color: 0x8b5cf6, label: "TypeScript", radius: 3.2, speed: 0.38, phase: 0, tilt: 0.2 },
  { color: 0xf97316, label: "Rust", radius: 2.6, speed: -0.28, phase: Math.PI / 2, tilt: -0.3 },
  { color: 0x3b82f6, label: "Python", radius: 3.8, speed: 0.22, phase: Math.PI, tilt: 0.4 },
  {
    color: 0x06b6d4,
    label: "Go",
    radius: 2.2,
    speed: -0.44,
    phase: (3 * Math.PI) / 2,
    tilt: -0.15,
  },
];

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.13;
    ref.current.rotation.y = t * 0.17;
    ref.current.rotation.z = t * 0.07;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshStandardMaterial
        color={0xffffff}
        emissive={0xffffff}
        emissiveIntensity={0.05}
        wireframe
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function OrbitRing({ orbiter }: { orbiter: (typeof ORBITERS)[0] }) {
  const lineLoop = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(
        Math.cos(a) * orbiter.radius,
        Math.sin(a) * Math.sin(orbiter.tilt) * orbiter.radius * 0.4,
        Math.sin(a) * orbiter.radius,
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    const mat = new THREE.LineBasicMaterial({
      color: orbiter.color,
      transparent: true,
      opacity: 0.1,
    });
    return new THREE.LineLoop(geo, mat);
  }, [orbiter]);

  return <primitive object={lineLoop} />;
}

function OrbiterMesh({ orbiter }: { orbiter: (typeof ORBITERS)[0] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * orbiter.speed + orbiter.phase;
    const x = Math.cos(t) * orbiter.radius;
    const y = Math.sin(t) * Math.sin(orbiter.tilt) * orbiter.radius * 0.4;
    const z = Math.sin(t) * orbiter.radius;
    ref.current.position.set(x, y, z);
    ref.current.rotation.y += 0.02;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.6 + Math.sin(clock.getElapsedTime() * 1.5 + orbiter.phase) * 0.2;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color={orbiter.color}
        emissive={orbiter.color}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 6, 4]} intensity={1.5} color={0x8b5cf6} />
      <pointLight position={[0, -6, 4]} intensity={1} color={0x06b6d4} />
      <CoreSphere />
      {ORBITERS.map((o) => (
        <group key={o.label}>
          <OrbitRing orbiter={o} />
          <OrbiterMesh orbiter={o} />
        </group>
      ))}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ECOSYSTEM_LABELS = [
  { label: "TypeScript", dot: "bg-violet-500" },
  { label: "Rust", dot: "bg-orange-500" },
  { label: "Python", dot: "bg-blue-500" },
  { label: "Go", dot: "bg-cyan-500" },
];

function Page4() {
  const [pm, setPm] = useState<PM>("bun");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(PM_COMMANDS[pm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-svh">
      <div className="mx-auto max-w-5xl border-x border-border">
        {/* Dramatic number opener */}
        <div
          className={`border-b border-border px-6 py-14 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="font-pixel text-[10px] uppercase tracking-widest text-muted-foreground">
            Valid project combinations
          </p>
          <div className="mt-3 flex items-baseline justify-center gap-2">
            <span className="font-mono text-6xl font-bold sm:text-8xl lg:text-[7rem]">7.28</span>
            <span className="font-mono text-3xl font-bold text-muted-foreground sm:text-5xl">
              × 10
            </span>
            <span className="font-mono text-2xl font-bold text-muted-foreground sm:text-4xl">
              ³⁴
            </span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
            {ECOSYSTEM_LABELS.map((e) => (
              <span
                key={e.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${e.dot}`} />
                {e.label}
              </span>
            ))}
          </div>
        </div>

        {/* 3D canvas */}
        <div
          className={`relative h-[440px] w-full overflow-hidden border-b border-border bg-[#040408] transition-all delay-200 duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {mounted && (
            <Canvas camera={{ position: [0, 2.5, 10], fov: 52 }} gl={{ antialias: true }}>
              <Scene />
            </Canvas>
          )}
        </div>

        {/* Command + heading */}
        <div
          className={`flex flex-col items-center px-6 py-10 transition-all delay-400 duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="font-mono text-xl font-bold tracking-tight text-muted-foreground sm:text-2xl">
            The full-stack app scaffolder
          </h1>
          <div className="mt-6 w-full max-w-lg">
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
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
