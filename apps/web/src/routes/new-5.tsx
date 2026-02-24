"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Footer from "@/components/home/footer";

export const Route = createFileRoute("/new-5")({
  component: Page5,
});

type PM = "bun" | "pnpm" | "npm";
const PM_COMMANDS: Record<PM, string> = {
  bun: "bun create better-fullstack@latest",
  pnpm: "pnpm create better-fullstack@latest",
  npm: "npx create-better-fullstack@latest",
};

// ─── Scene: Infinite Wormhole Tunnel ─────────────────────────────────────────
// Rings fly toward the camera in an endless loop — representing the
// "7.28 × 10³⁴ valid combinations" streaming past you.

const RING_COUNT = 24;
const RING_SPACING = 5;
const SPEED = 7;

function TunnelRing({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const zRef = useRef(-index * RING_SPACING);

  // Interpolate color based on Z position (purple → cyan)
  const color = new THREE.Color().setHSL(0.72 - (index / RING_COUNT) * 0.22, 0.9, 0.6);

  useFrame((_, delta) => {
    zRef.current += delta * SPEED;
    if (zRef.current > 4) {
      zRef.current -= RING_COUNT * RING_SPACING;
    }
    if (ref.current) {
      ref.current.position.z = zRef.current;
      // Scale up as it approaches — forced perspective feel
      const s = Math.max(0.1, 1 + zRef.current * 0.045);
      ref.current.scale.setScalar(s);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        Math.min(0.75, (4 - zRef.current) * 0.12),
      );
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, zRef.current]}>
      <torusGeometry args={[2.4, 0.012, 6, 80]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

// Radial spokes on alternating rings
function TunnelSpoke({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const zRef = useRef(-index * RING_SPACING * 2 - RING_SPACING);

  useFrame((_, delta) => {
    zRef.current += delta * SPEED;
    if (zRef.current > 4) zRef.current -= RING_COUNT * RING_SPACING;
    if (ref.current) {
      ref.current.position.z = zRef.current;
      const s = Math.max(0.1, 1 + zRef.current * 0.045);
      ref.current.scale.setScalar(s);
      ref.current.rotation.z += delta * 0.3;
    }
  });

  const color = new THREE.Color().setHSL(0.55, 0.8, 0.55);

  return (
    <group ref={ref} position={[0, 0, zRef.current]}>
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const pts = new Float32Array([0, 0, 0, Math.cos(angle) * 2.4, Math.sin(angle) * 2.4, 0]);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return (
          <lineSegments key={i} geometry={geo}>
            <lineBasicMaterial color={color} transparent opacity={0.06} />
          </lineSegments>
        );
      })}
    </group>
  );
}

// Floating text particles in the tunnel
function TunnelParticles() {
  const ref = useRef<THREE.Points>(null);

  const geo = (() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 1.8;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = -(Math.random() * RING_COUNT * RING_SPACING);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  })();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 200; i++) {
      let z = pos.getZ(i) + delta * SPEED * 0.6;
      if (z > 4) z -= RING_COUNT * RING_SPACING;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.025} color={0x8b5cf6} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.0} />
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <TunnelRing key={i} index={i} />
      ))}
      {Array.from({ length: Math.floor(RING_COUNT / 2) }, (_, i) => (
        <TunnelSpoke key={i} index={i} />
      ))}
      <TunnelParticles />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Page5() {
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
        {/* Full-viewport canvas with overlaid content */}
        <div className="relative h-[calc(100svh-3.5rem)] w-full overflow-hidden bg-[#020204]">
          {mounted && (
            <Canvas
              className="absolute inset-0"
              camera={{ position: [0, 0, 3], fov: 75 }}
              gl={{ antialias: true }}
            >
              <Scene />
            </Canvas>
          )}

          {/* Centered overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {/* Combinations counter */}
            <div className="mb-6 rounded-full border border-white/10 bg-black/50 px-5 py-2 backdrop-blur-md">
              <span className="font-mono text-sm text-white/60">
                <span className="font-bold text-white">7.28 × 10³⁴</span> valid combinations
              </span>
            </div>

            <h1 className="font-mono text-3xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-5xl">
              The full-stack
              <br />
              app scaffolder
            </h1>
            <p className="mt-3 max-w-sm text-sm text-white/50">
              Every combination rushing past you is a production-ready stack.
            </p>

            {/* Command palette — glassmorphism card */}
            <div className="mt-8 w-full max-w-md rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-lg">
              <div className="flex border-b border-white/10 pb-0">
                {(["bun", "pnpm", "npm"] as PM[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPm(p)}
                    className={`border-b-2 px-4 py-1.5 font-mono text-xs transition-colors ${pm === p ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/70"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5">
                <code className="truncate font-mono text-xs text-white/80">{PM_COMMANDS[pm]}</code>
                <button
                  type="button"
                  onClick={copy}
                  className="ml-3 shrink-0 text-white/40 transition-colors hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <div className="mt-3 flex justify-end">
                <Link
                  to="/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-white/90"
                >
                  Builder <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <Footer />
      </div>
    </main>
  );
}
