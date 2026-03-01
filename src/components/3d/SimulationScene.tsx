import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Text,
} from '@react-three/drei';
import * as THREE from 'three';

function CityBuilding({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 树干 */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* 树冠 */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 灯杆 */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      {/* 灯罩 */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.3]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffaa" emissiveIntensity={0.5} />
      </mesh>
      {/* 灯光 */}
      <pointLight position={[0, 2.8, 0]} intensity={0.5} distance={5} color="#ffffaa" />
    </group>
  );
}

function EyeChart() {
  return (
    <group position={[0, 1.5, -8]}>
      {/* 视力表背景 */}
      <mesh>
        <planeGeometry args={[1.5, 2.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* 视力表边框 */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1.1, 1.15, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* E字 */}
      <Text
        position={[0, 0.6, 0.02]}
        fontSize={0.4}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        E
      </Text>
      <Text
        position={[0, 0.1, 0.02]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        F P
      </Text>
      <Text
        position={[0, -0.35, 0.02]}
        fontSize={0.22}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        T O Z
      </Text>
      <Text
        position={[0, -0.75, 0.02]}
        fontSize={0.16}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        L P E D
      </Text>
    </group>
  );
}

function FloatingParticles() {
  // 手动创建粒子效果替代 Sparkles
  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = -Math.random() * 20;
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={100}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} transparent opacity={0.5} color="#ffffff" sizeAttenuation />
    </points>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#333333" roughness={0.9} />
    </mesh>
  );
}

function Road() {
  return (
    <group>
      {/* 主路面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <planeGeometry args={[6, 30]} />
        <meshStandardMaterial color="#444444" roughness={0.95} />
      </mesh>
      {/* 道路标线 */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.48, z]}
        >
          <planeGeometry args={[0.1, 1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Sky() {
  return (
    <mesh position={[0, 0, -20]}>
      <planeGeometry args={[60, 40]} />
      <meshBasicMaterial color="#1a1a2e" />
    </mesh>
  );
}

export default function SimulationScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // 轻微的视角移动模拟眼睛自然转动
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.01;
    }
  });

  return (
    <>
      {/* 环境设置 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#87CEEB" />


      <group ref={groupRef}>
        {/* 地面和道路 */}
        <Ground />
        <Road />

        {/* 建筑物 */}
        <CityBuilding position={[-5, 2, -10]} size={[3, 8, 3]} color="#4a5568" />
        <CityBuilding position={[-8, 3, -15]} size={[4, 12, 4]} color="#2d3748" />
        <CityBuilding position={[6, 2.5, -12]} size={[3.5, 10, 3]} color="#4a5568" />
        <CityBuilding position={[9, 1.5, -8]} size={[2.5, 6, 2.5]} color="#718096" />
        <CityBuilding position={[-3, 1, -5]} size={[2, 4, 2]} color="#2d3748" />

        {/* 树木 */}
        <Tree position={[-4, 0, -3]} />
        <Tree position={[4, 0, -6]} />
        <Tree position={[-6, 0, -8]} />
        <Tree position={[7, 0, -10]} />

        {/* 路灯 */}
        <StreetLamp position={[-2.5, -0.5, -2]} />
        <StreetLamp position={[2.5, -0.5, -4]} />
        <StreetLamp position={[-2.5, -0.5, -7]} />
        <StreetLamp position={[2.5, -0.5, -9]} />

        {/* 视力表 */}
        <EyeChart />

        {/* 浮动的粒子效果 */}
        <FloatingParticles />
      </group>

      {/* 天空背景 */}
      <Sky />
    </>
  );
}
