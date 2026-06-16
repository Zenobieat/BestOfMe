"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { PetSpecies } from "@/lib/types";

// ── Colour palettes per species ──────────────────────────────
const PALETTE: Record<PetSpecies, { body: string; accent: string; dark: string }> = {
  cat:    { body: "#E8C99A", accent: "#C4956A", dark: "#6B3F1B" },
  dog:    { body: "#C8A87A", accent: "#8B6248", dark: "#4A2C1A" },
  rabbit: { body: "#F0E0D0", accent: "#E8B4B8", dark: "#9B6B7A" },
  fox:    { body: "#E8742A", accent: "#FFFFFF", dark: "#2C1810" },
  owl:    { body: "#8B7355", accent: "#F5E6C8", dark: "#3D2B1A" },
  bear:   { body: "#8B6248", accent: "#C4956A", dark: "#3D2010" },
  panda:  { body: "#F5F5F5", accent: "#2C2C2C", dark: "#1A1A1A" },
  dragon: { body: "#2E7D32", accent: "#81C784", dark: "#1B5E20" },
};

// ── Shared geometry helpers ───────────────────────────────────
function M({ color, args, pos, rot }: {
  color: string;
  args: ConstructorParameters<typeof THREE.SphereGeometry> | ConstructorParameters<typeof THREE.BoxGeometry> | ConstructorParameters<typeof THREE.ConeGeometry>;
  pos?: [number, number, number];
  rot?: [number, number, number];
}) {
  return null; // placeholder — actual meshes below
}

// ── Cat ──────────────────────────────────────────────────────
function CatMesh({ pal }: { pal: typeof PALETTE.cat }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <group ref={g}>
      {/* Body */}
      <mesh position={[0, -0.2, 0]}><sphereGeometry args={[0.45, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.32, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Ear L */}
      <mesh position={[-0.2, 0.85, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.1, 0.22, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Ear R */}
      <mesh position={[0.2, 0.85, 0]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.1, 0.22, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.52, 0.28]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.1, 0.52, 0.28]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Nose */}
      <mesh position={[0, 0.44, 0.31]}><sphereGeometry args={[0.03, 5, 4]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Tail */}
      <mesh position={[0.35, -0.35, -0.25]} rotation={[0.5, 0, 0.8]}><capsuleGeometry args={[0.07, 0.4, 4, 6]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Paws */}
      <mesh position={[-0.22, -0.58, 0.15]}><sphereGeometry args={[0.12, 6, 5]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.22, -0.58, 0.15]}><sphereGeometry args={[0.12, 6, 5]} /><meshToonMaterial color={pal.body} /></mesh>
    </group>
  );
}

// ── Dog ──────────────────────────────────────────────────────
function DogMesh({ pal }: { pal: typeof PALETTE.dog }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.7, 0.55, 0.5]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.42, 0.1]}><sphereGeometry args={[0.34, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Snout */}
      <mesh position={[0, 0.33, 0.4]}><boxGeometry args={[0.22, 0.18, 0.2]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Floppy ears */}
      <mesh position={[-0.32, 0.45, 0]} rotation={[0.1, 0, 0.3]}><boxGeometry args={[0.15, 0.3, 0.06]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[0.32, 0.45, 0]} rotation={[0.1, 0, -0.3]}><boxGeometry args={[0.15, 0.3, 0.06]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Eyes */}
      <mesh position={[-0.11, 0.46, 0.32]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.11, 0.46, 0.32]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Nose */}
      <mesh position={[0, 0.37, 0.49]}><sphereGeometry args={[0.04, 5, 4]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Tail */}
      <mesh position={[0, 0.05, -0.45]} rotation={[-0.8, 0, 0]}><capsuleGeometry args={[0.06, 0.35, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Legs */}
      {[-0.22, 0.22].map((x) =>
        [0.18, -0.18].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.52, z]}><capsuleGeometry args={[0.07, 0.18, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
        ))
      )}
    </group>
  );
}

// ── Rabbit ───────────────────────────────────────────────────
function RabbitMesh({ pal }: { pal: typeof PALETTE.rabbit }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.1, 0]}><sphereGeometry args={[0.38, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.48, 0]}><sphereGeometry args={[0.28, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Long ears */}
      <mesh position={[-0.13, 1.05, 0]}><capsuleGeometry args={[0.07, 0.5, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.13, 1.05, 0]}><capsuleGeometry args={[0.07, 0.5, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Inner ears */}
      <mesh position={[-0.13, 1.05, 0.04]}><capsuleGeometry args={[0.04, 0.38, 4, 6]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[0.13, 1.05, 0.04]}><capsuleGeometry args={[0.04, 0.38, 4, 6]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[-0.09, 0.5, 0.26]}><sphereGeometry args={[0.045, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.09, 0.5, 0.26]}><sphereGeometry args={[0.045, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0, 0.43, 0.28]}><sphereGeometry args={[0.03, 5, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Fluffy tail */}
      <mesh position={[0, -0.1, -0.4]}><sphereGeometry args={[0.1, 6, 5]} /><meshToonMaterial color={pal.body} /></mesh>
    </group>
  );
}

// ── Fox ──────────────────────────────────────────────────────
function FoxMesh({ pal }: { pal: typeof PALETTE.fox }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.15, 0]}><sphereGeometry args={[0.4, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.44, 0]}><sphereGeometry args={[0.3, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Pointed ears */}
      <mesh position={[-0.18, 0.82, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.09, 0.26, 4]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.18, 0.82, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.09, 0.26, 4]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Snout */}
      <mesh position={[0, 0.35, 0.28]}><coneGeometry args={[0.12, 0.28, 4]} rotation-x={Math.PI / 2} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[-0.1, 0.47, 0.27]}><sphereGeometry args={[0.05, 6, 5]} /><meshToonMaterial color="#1A1A1A" /></mesh>
      <mesh position={[0.1, 0.47, 0.27]}><sphereGeometry args={[0.05, 6, 5]} /><meshToonMaterial color="#1A1A1A" /></mesh>
      {/* Fluffy tail */}
      <mesh position={[0.3, -0.28, -0.38]} rotation={[0.6, 0, 0.5]}><capsuleGeometry args={[0.12, 0.5, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.42, -0.18, -0.6]} rotation={[0.3, 0, 0.2]}><sphereGeometry args={[0.16, 6, 5]} /><meshToonMaterial color={pal.accent} /></mesh>
    </group>
  );
}

// ── Owl ──────────────────────────────────────────────────────
function OwlMesh({ pal }: { pal: typeof PALETTE.owl }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.3; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.28, 0.35, 0.65, 7]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.32, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Ear tufts */}
      <mesh position={[-0.15, 0.86, 0]} rotation={[0, 0, -0.2]}><coneGeometry args={[0.07, 0.2, 4]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.15, 0.86, 0]} rotation={[0, 0, 0.2]}><coneGeometry args={[0.07, 0.2, 4]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Big eyes */}
      <mesh position={[-0.12, 0.52, 0.27]}><sphereGeometry args={[0.1, 8, 7]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[0.12, 0.52, 0.27]}><sphereGeometry args={[0.1, 8, 7]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[-0.12, 0.52, 0.35]}><sphereGeometry args={[0.065, 6, 5]} /><meshToonMaterial color="#1A0A0A" /></mesh>
      <mesh position={[0.12, 0.52, 0.35]}><sphereGeometry args={[0.065, 6, 5]} /><meshToonMaterial color="#1A0A0A" /></mesh>
      {/* Beak */}
      <mesh position={[0, 0.44, 0.33]} rotation={[0.5, 0, 0]}><coneGeometry args={[0.05, 0.12, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Wings */}
      <mesh position={[-0.38, 0.0, 0]} rotation={[0.1, 0, 0.2]}><boxGeometry args={[0.18, 0.55, 0.08]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.38, 0.0, 0]} rotation={[0.1, 0, -0.2]}><boxGeometry args={[0.18, 0.55, 0.08]} /><meshToonMaterial color={pal.body} /></mesh>
    </group>
  );
}

// ── Bear ─────────────────────────────────────────────────────
function BearMesh({ pal }: { pal: typeof PALETTE.bear }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.35; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.15, 0]}><sphereGeometry args={[0.46, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.33, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Round ears */}
      <mesh position={[-0.23, 0.82, 0]}><sphereGeometry args={[0.1, 7, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.23, 0.82, 0]}><sphereGeometry args={[0.1, 7, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Muzzle */}
      <mesh position={[0, 0.38, 0.29]}><sphereGeometry args={[0.14, 7, 6]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[-0.1, 0.48, 0.28]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.1, 0.48, 0.28]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0, 0.4, 0.41]}><sphereGeometry args={[0.04, 5, 4]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Arms */}
      <mesh position={[-0.5, -0.1, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.1, 0.3, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0.5, -0.1, 0]} rotation={[0, 0, -0.5]}><capsuleGeometry args={[0.1, 0.3, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
    </group>
  );
}

// ── Panda ────────────────────────────────────────────────────
function PandaMesh({ pal }: { pal: typeof PALETTE.panda }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.35; });
  return (
    <group ref={g}>
      <mesh position={[0, -0.15, 0]}><sphereGeometry args={[0.46, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.33, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Panda ears — black */}
      <mesh position={[-0.23, 0.82, 0]}><sphereGeometry args={[0.1, 7, 6]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.23, 0.82, 0]}><sphereGeometry args={[0.1, 7, 6]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Eye patches */}
      <mesh position={[-0.12, 0.52, 0.26]}><sphereGeometry args={[0.09, 7, 6]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.12, 0.52, 0.26]}><sphereGeometry args={[0.09, 7, 6]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Eyes white */}
      <mesh position={[-0.12, 0.53, 0.32]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color="#FFFFFF" /></mesh>
      <mesh position={[0.12, 0.53, 0.32]}><sphereGeometry args={[0.055, 6, 5]} /><meshToonMaterial color="#FFFFFF" /></mesh>
      {/* Pupils */}
      <mesh position={[-0.12, 0.53, 0.37]}><sphereGeometry args={[0.03, 5, 4]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.12, 0.53, 0.37]}><sphereGeometry args={[0.03, 5, 4]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0, 0.42, 0.33]}><sphereGeometry args={[0.035, 5, 4]} /><meshToonMaterial color={pal.dark} /></mesh>
      {/* Black arms */}
      <mesh position={[-0.5, -0.1, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.1, 0.3, 4, 6]} /><meshToonMaterial color={pal.dark} /></mesh>
      <mesh position={[0.5, -0.1, 0]} rotation={[0, 0, -0.5]}><capsuleGeometry args={[0.1, 0.3, 4, 6]} /><meshToonMaterial color={pal.dark} /></mesh>
    </group>
  );
}

// ── Dragon ───────────────────────────────────────────────────
function DragonMesh({ pal }: { pal: typeof PALETTE.dragon }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.5;
    g.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
  });
  return (
    <group ref={g}>
      <mesh position={[0, -0.1, 0]}><sphereGeometry args={[0.42, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.28, 8, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      {/* Horns */}
      <mesh position={[-0.14, 0.88, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.055, 0.28, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[0.14, 0.88, 0]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.055, 0.28, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Glowing eyes */}
      <mesh position={[-0.1, 0.5, 0.25]}><sphereGeometry args={[0.06, 6, 5]} /><meshToonMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} /></mesh>
      <mesh position={[0.1, 0.5, 0.25]}><sphereGeometry args={[0.06, 6, 5]} /><meshToonMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} /></mesh>
      {/* Wings */}
      <mesh position={[-0.55, 0.15, -0.1]} rotation={[0.3, -0.3, -0.5]}><boxGeometry args={[0.35, 0.5, 0.04]} /><meshToonMaterial color={pal.accent} /></mesh>
      <mesh position={[0.55, 0.15, -0.1]} rotation={[0.3, 0.3, 0.5]}><boxGeometry args={[0.35, 0.5, 0.04]} /><meshToonMaterial color={pal.accent} /></mesh>
      {/* Tail */}
      <mesh position={[0, -0.2, -0.5]} rotation={[-0.6, 0, 0]}><capsuleGeometry args={[0.08, 0.5, 4, 6]} /><meshToonMaterial color={pal.body} /></mesh>
      <mesh position={[0, -0.45, -0.88]} rotation={[-0.2, 0, 0]}><coneGeometry args={[0.1, 0.24, 4]} /><meshToonMaterial color={pal.accent} /></mesh>
    </group>
  );
}

// ── Main export ───────────────────────────────────────────────
const MESH_MAP: Record<PetSpecies, React.ComponentType<{ pal: typeof PALETTE.cat }>> = {
  cat: CatMesh,
  dog: DogMesh,
  rabbit: RabbitMesh,
  fox: FoxMesh,
  owl: OwlMesh,
  bear: BearMesh,
  panda: PandaMesh,
  dragon: DragonMesh,
};

interface Pet3DProps {
  species: PetSpecies;
  size?: number;
  interactive?: boolean;
  className?: string;
}

export function Pet3D({ species, size = 200, interactive = false, className = "" }: Pet3DProps) {
  const pal = PALETTE[species];
  const AnimalMesh = MESH_MAP[species];

  return (
    <div style={{ width: size, height: size }} className={className}>
      <Canvas
        camera={{ position: [0, 0.3, 2.2], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.4} color="#818CF8" />
        <pointLight position={[0, 3, 0]} intensity={0.6} color="#6366F1" />
        <Suspense fallback={null}>
          <AnimalMesh pal={pal} />
        </Suspense>
        {interactive && <OrbitControls enableZoom={false} enablePan={false} />}
      </Canvas>
    </div>
  );
}
