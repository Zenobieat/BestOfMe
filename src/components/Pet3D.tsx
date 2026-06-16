"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BUDDIES_CATALOG, BuddyShape } from "@/lib/catalog";

interface Colors { body: string; accent: string; dark: string; glow?: string }

// ── Shape renderers ───────────────────────────────────────────

function RoundBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.5; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.15, 0]}><sphereGeometry args={[0.42, 10, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[0, 0.48, 0]}><sphereGeometry args={[0.3, 10, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.18, 0.82, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.09, 0.2, 4]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.18, 0.82, 0]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.09, 0.2, 4]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[-0.1, 0.5, 0.26]}><sphereGeometry args={[0.05, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.1, 0.5, 0.26]}><sphereGeometry args={[0.05, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0, 0.44, 0.29]}><sphereGeometry args={[0.025, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
    </group>
  );
}

function TinyBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.7; });
  return (
    <group ref={g}>
      <mesh position={[0, 0, 0]}><sphereGeometry args={[0.5, 10, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.22, 0.42, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.1, 0.25, 4]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.22, 0.42, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.1, 0.25, 4]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[-0.15, 0.06, 0.44]}><sphereGeometry args={[0.07, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.15, 0.06, 0.44]}><sphereGeometry args={[0.07, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
    </group>
  );
}

function BlockyBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.72, 0.7, 0.6]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.54, 0.5, 0.5]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.15, 0.64, 0.26]}><boxGeometry args={[0.1, 0.1, 0.04]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.15, 0.64, 0.26]}><boxGeometry args={[0.1, 0.1, 0.04]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[-0.38, 0.15, 0]}><boxGeometry args={[0.14, 0.55, 0.3]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.38, 0.15, 0]}><boxGeometry args={[0.14, 0.55, 0.3]} /><meshToonMaterial color={c.accent} /></mesh>
    </group>
  );
}

function TallBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.45; });
  return (
    <group ref={g} scale={[1, 0.85, 1]}>
      <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.28, 0.6, 4, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.26, 8, 7]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.15, 0.88, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.08, 0.2, 5]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.15, 0.88, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.08, 0.2, 5]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[-0.1, 0.62, 0.22]}><sphereGeometry args={[0.05, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.1, 0.62, 0.22]}><sphereGeometry args={[0.05, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
    </group>
  );
}

function WideBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.35; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.1, 0]} scale={[1.3, 0.7, 1]}><sphereGeometry args={[0.42, 10, 7]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.24, 8, 6]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.11, 0.44, 0.2]}><sphereGeometry args={[0.05, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.11, 0.44, 0.2]}><sphereGeometry args={[0.05, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[-0.48, 0, 0]} scale={[0.4, 0.6, 0.5]}><sphereGeometry args={[0.3, 6, 5]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.48, 0, 0]} scale={[0.4, 0.6, 0.5]}><sphereGeometry args={[0.3, 6, 5]} /><meshToonMaterial color={c.accent} /></mesh>
    </group>
  );
}

function HumanoidBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <group ref={g} scale={[0.9, 0.9, 0.9]}>
      <mesh position={[0, -0.35, 0]}><capsuleGeometry args={[0.22, 0.55, 4, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[0, 0.48, 0]}><sphereGeometry args={[0.26, 8, 7]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.12, 0.5, 0.22]}><sphereGeometry args={[0.052, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.12, 0.5, 0.22]}><sphereGeometry args={[0.052, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[-0.38, 0.05, 0]}><capsuleGeometry args={[0.1, 0.44, 3, 6]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.38, 0.05, 0]}><capsuleGeometry args={[0.1, 0.44, 3, 6]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[-0.16, -0.8, 0]}><capsuleGeometry args={[0.1, 0.4, 3, 6]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.16, -0.8, 0]}><capsuleGeometry args={[0.1, 0.4, 3, 6]} /><meshToonMaterial color={c.accent} /></mesh>
    </group>
  );
}

function SpookyBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (g.current) {
      g.current.rotation.y += dt * 0.5;
      g.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });
  return (
    <group ref={g}>
      <mesh position={[0, 0.1, 0]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.4, 10, 8]} /><meshToonMaterial color={c.body} transparent opacity={0.88} /></mesh>
      <mesh position={[0, -0.42, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.4, 8, 5]} /><meshToonMaterial color={c.body} transparent opacity={0.6} /></mesh>
      <mesh position={[-0.14, 0.18, 0.36]}><sphereGeometry args={[0.07, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.14, 0.18, 0.36]}><sphereGeometry args={[0.07, 6, 5]} /><meshToonMaterial color={c.dark} /></mesh>
    </group>
  );
}

function DragonBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.45; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.1, 0]}><sphereGeometry args={[0.38, 10, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[0.02, 0.46, 0.06]} rotation={[0.3, 0, 0]}><sphereGeometry args={[0.27, 8, 7]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.18, 0.76, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.08, 0.22, 4]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.18, 0.76, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.08, 0.22, 4]} /><meshToonMaterial color={c.accent} /></mesh>
      {/* Wings */}
      <mesh position={[-0.52, 0.15, -0.1]} rotation={[0.1, 0.4, 0.5]} scale={[1.2, 0.6, 0.1]}><sphereGeometry args={[0.3, 6, 5]} /><meshToonMaterial color={c.accent} transparent opacity={0.8} /></mesh>
      <mesh position={[0.52, 0.15, -0.1]} rotation={[0.1, -0.4, -0.5]} scale={[1.2, 0.6, 0.1]}><sphereGeometry args={[0.3, 6, 5]} /><meshToonMaterial color={c.accent} transparent opacity={0.8} /></mesh>
      <mesh position={[-0.12, 0.5, 0.23]}><sphereGeometry args={[0.055, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.12, 0.5, 0.23]}><sphereGeometry args={[0.055, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
    </group>
  );
}

function BlobBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (g.current) {
      g.current.rotation.y += dt * 0.3;
      g.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.06;
    }
  });
  return (
    <group ref={g}>
      <mesh position={[0, 0, 0]} scale={[1.2, 1, 1]}><sphereGeometry args={[0.44, 10, 8]} /><meshToonMaterial color={c.body} /></mesh>
      <mesh position={[-0.28, 0.22, 0.2]} scale={[0.5, 0.5, 0.5]}><sphereGeometry args={[0.4, 8, 6]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[0.32, 0.1, 0.2]} scale={[0.4, 0.4, 0.4]}><sphereGeometry args={[0.4, 8, 6]} /><meshToonMaterial color={c.accent} /></mesh>
      <mesh position={[-0.1, 0.1, 0.42]}><sphereGeometry args={[0.06, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
      <mesh position={[0.1, 0.1, 0.42]}><sphereGeometry args={[0.06, 5, 4]} /><meshToonMaterial color={c.dark} /></mesh>
    </group>
  );
}

function CrystalBuddy({ c }: { c: Colors }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (g.current) {
      g.current.rotation.y += dt * 0.55;
      g.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });
  const glow = c.glow ?? c.accent;
  return (
    <group ref={g}>
      {/* Main crystal */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}><octahedronGeometry args={[0.5, 0]} /><meshToonMaterial color={c.body} transparent opacity={0.92} /></mesh>
      {/* Inner gem glow */}
      <mesh position={[0, 0, 0]} scale={0.6}><octahedronGeometry args={[0.5, 0]} /><meshToonMaterial color={glow} transparent opacity={0.7} /></mesh>
      {/* Facet shards */}
      <mesh position={[0.3, 0.45, 0]} rotation={[0.3, 0.5, 0.2]}><octahedronGeometry args={[0.18, 0]} /><meshToonMaterial color={c.accent} transparent opacity={0.8} /></mesh>
      <mesh position={[-0.35, 0.3, 0.1]} rotation={[-0.2, 0.3, 0.5]}><octahedronGeometry args={[0.14, 0]} /><meshToonMaterial color={glow} transparent opacity={0.75} /></mesh>
      <mesh position={[0.1, -0.5, 0.2]} rotation={[0.4, -0.2, 0.1]}><octahedronGeometry args={[0.12, 0]} /><meshToonMaterial color={c.accent} transparent opacity={0.7} /></mesh>
    </group>
  );
}

// ── Shape router ──────────────────────────────────────────────

const SHAPE_COMPONENTS: Record<BuddyShape, React.FC<{ c: Colors }>> = {
  round:    RoundBuddy,
  tiny:     TinyBuddy,
  blocky:   BlockyBuddy,
  tall:     TallBuddy,
  wide:     WideBuddy,
  humanoid: HumanoidBuddy,
  spooky:   SpookyBuddy,
  dragon:   DragonBuddy,
  blob:     BlobBuddy,
  crystal:  CrystalBuddy,
};

// ── Lighting per shape ────────────────────────────────────────

function SceneLights({ shape }: { shape: BuddyShape }) {
  const isCrystal = shape === "crystal";
  return (
    <>
      <ambientLight intensity={isCrystal ? 0.4 : 0.7} />
      <directionalLight position={[3, 4, 5]} intensity={isCrystal ? 1.6 : 1.2} />
      {isCrystal && <pointLight position={[0, 0, 1]} intensity={1.2} color="#ffffff" />}
    </>
  );
}

// ── Main exported component ───────────────────────────────────

interface Pet3DProps {
  species: string;
  size?: number;
  interactive?: boolean;
}

export function Pet3D({ species, size = 120, interactive = false }: Pet3DProps) {
  const entry = BUDDIES_CATALOG.find((b) => b.id === species);
  const shape: BuddyShape = entry?.shape ?? "round";
  const colors: Colors = entry?.colors ?? { body: "#6366F1", accent: "#818CF8", dark: "#1e1b4b" };

  const ShapeComp = SHAPE_COMPONENTS[shape];

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLights shape={shape} />
        <Suspense fallback={null}>
          <ShapeComp c={colors} />
        </Suspense>
        {interactive && <OrbitControls enableZoom={false} enablePan={false} />}
      </Canvas>
    </div>
  );
}
