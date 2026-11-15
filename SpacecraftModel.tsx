import { useState } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";

export type PartId = "bus" | "solar" | "hga" | "lga" | "imu" | "star" | "cai" | "pulsar" | "thruster";

interface Props {
  selected?: PartId | null;
  onSelect?: (p: PartId) => void;
  interactive?: boolean;
}

/** Procedural spacecraft built from primitives. Each part is a clickable group when `interactive` is set. */
export default function SpacecraftModel({ selected = null, onSelect, interactive = false }: Props) {
  const [hover, setHover] = useState<PartId | null>(null);
  const part = (id: PartId) => ({
    onClick: interactive ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect?.(id); } : undefined,
    onPointerOver: interactive ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(id); document.body.style.cursor = "pointer"; } : undefined,
    onPointerOut: interactive ? () => { setHover(null); document.body.style.cursor = ""; } : undefined,
  });
  const glow = (id: PartId) => (selected === id ? 0.55 : hover === id ? 0.3 : 0);
  const mat = (id: PartId, color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => (
    <meshStandardMaterial color={color} emissive="#4FD1EE" emissiveIntensity={glow(id)} metalness={0.4} roughness={0.5} {...extra} />
  );

  return (
    <group>
      {/* main bus with gold multi-layer insulation */}
      <mesh {...part("bus")}>
        <boxGeometry args={[1.2, 1, 1]} />
        {mat("bus", "#B8923A", { metalness: 0.7, roughness: 0.35 })}
      </mesh>

      {/* solar arrays */}
      <group {...part("solar")}>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.85, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />{mat("solar", "#888", {})}</mesh>
            <mesh position={[s * 0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />{mat("solar", "#999")}</mesh>
            <mesh position={[s * 2.2, 0, 0]}>
              <boxGeometry args={[2.3, 0.04, 0.95]} />
              {mat("solar", "#173A6B", { metalness: 0.2, roughness: 0.3 })}
            </mesh>
            {[-0.6, 0, 0.6].map((x) => (
              <mesh key={x} position={[s * 2.2 + x, 0.025, 0]}><boxGeometry args={[0.02, 0.01, 0.95]} /><meshBasicMaterial color="#5B7FB0" /></mesh>
            ))}
          </group>
        ))}
      </group>

      {/* high-gain antenna */}
      <group position={[0, 0.5, 0]} {...part("hga")}>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />{mat("hga", "#ccc")}</mesh>
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 12, 0, Math.PI * 2, 0, 0.55]} />
          {mat("hga", "#E8ECF2", { side: THREE.DoubleSide, metalness: 0.2, roughness: 0.6 })}
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.06, 0.18, 12]} />{mat("hga", "#ddd")}</mesh>
        <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.012, 0.012, 0.36, 6]} />{mat("hga", "#bbb")}</mesh>
      </group>

      {/* low-gain antenna */}
      <group position={[-0.45, -0.5, 0.35]} {...part("lga")}>
        <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />{mat("lga", "#ccc")}</mesh>
        <mesh position={[0, -0.4, 0]}><coneGeometry args={[0.09, 0.12, 12]} />{mat("lga", "#eee")}</mesh>
      </group>

      {/* inertial measurement unit housing on the +z face */}
      <mesh position={[0.3, 0.15, 0.56]} {...part("imu")}>
        <boxGeometry args={[0.32, 0.26, 0.12]} />
        {mat("imu", "#3D4B5F")}
      </mesh>

      {/* twin optical star tracker heads with baffles */}
      <group position={[-0.45, 0.3, -0.5]} {...part("star")}>
        {[-0.18, 0.18].map((x, i) => (
          <group key={i} position={[x, 0, 0]} rotation={[-0.6, i ? 0.4 : -0.4, 0]}>
            <mesh position={[0, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.1, 0.32, 16, 1, true]} />{mat("star", "#222831", { side: THREE.DoubleSide })}</mesh>
            <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.04, 16]} /><meshBasicMaterial color="#0B1A30" /></mesh>
          </group>
        ))}
      </group>

      {/* cold-atom interferometer: vacuum cell with atom cloud */}
      <group position={[0.32, -0.78, -0.2]} {...part("cai")}>
        <mesh><cylinderGeometry args={[0.24, 0.24, 0.55, 24]} />{mat("cai", "#9FB3C8", { transparent: true, opacity: 0.45, metalness: 0.1, roughness: 0.1 })}</mesh>
        <mesh><sphereGeometry args={[0.07, 16, 16]} /><meshBasicMaterial color="#FF5C61" /></mesh>
        {[-0.2, 0.2].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.025, 8, 32]} />{mat("cai", "#C88A2E")}</mesh>)}
      </group>

      {/* pulsar timing subsystem: optical/X-ray timing telescope plus clock box */}
      <group position={[0.35, 0.05, -0.5]} {...part("pulsar")}>
        <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.14, 0.14, 0.9, 20]} />{mat("pulsar", "#D7DEE7")}</mesh>
        <mesh position={[0, 0, -0.91]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 20]} /><meshBasicMaterial color="#09203A" /></mesh>
        <mesh position={[0, -0.25, -0.15]}><boxGeometry args={[0.24, 0.16, 0.22]} />{mat("pulsar", "#4A5A6E")}</mesh>
      </group>

      {/* main engine */}
      <group position={[-0.1, -0.5, 0.3]} {...part("thruster")}>
        <mesh position={[0, -0.18, 0]}><coneGeometry args={[0.16, 0.32, 20, 1, true]} />{mat("thruster", "#555", { side: THREE.DoubleSide })}</mesh>
      </group>
    </group>
  );
}
