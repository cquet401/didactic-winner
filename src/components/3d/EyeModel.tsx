import { useMemo } from 'react';
import * as THREE from 'three';
import { useVision } from '../../contexts/VisionContext';

function IrisTexture() {
  const irisTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const gradient = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
    gradient.addColorStop(0, '#7a5a38');
    gradient.addColorStop(0.25, '#6a4a2d');
    gradient.addColorStop(0.6, '#4f3420');
    gradient.addColorStop(1, '#2a170d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 180; i++) {
      const angle = (i / 180) * Math.PI * 2;
      const inner = 70 + (i % 2) * 8;
      const outer = 250;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * inner, 256 + Math.sin(angle) * inner);
      ctx.lineTo(256 + Math.cos(angle) * outer, 256 + Math.sin(angle) * outer);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  if (!irisTexture) {
    return null;
  }

  return (
    <mesh position={[0, 0, 0.29]}>
      <circleGeometry args={[0.3, 96]} />
      <meshStandardMaterial map={irisTexture} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

function Sclera({ scaleZ }: { scaleZ: number }) {
  return (
    <mesh scale={[1, 1, scaleZ]}>
      <sphereGeometry args={[0.5, 96, 96]} />
      <meshPhysicalMaterial
        color="#f7f7f7"
        roughness={0.35}
        metalness={0}
        clearcoat={0.2}
        transmission={0.04}
        thickness={0.3}
      />
    </mesh>
  );
}

function Retina({ scaleZ }: { scaleZ: number }) {
  return (
    <mesh scale={[0.93, 0.93, scaleZ * 0.92]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial
        color="#be8070"
        transparent
        opacity={0.22}
        side={THREE.BackSide}
        roughness={0.7}
      />
    </mesh>
  );
}

function Lens() {
  return (
    <mesh position={[0, 0, 0.11]} scale={[0.62, 0.62, 0.32]}>
      <sphereGeometry args={[0.38, 64, 64]} />
      <meshPhysicalMaterial
        color="#d6ecff"
        transparent
        opacity={0.35}
        transmission={0.88}
        roughness={0.05}
        thickness={0.12}
      />
    </mesh>
  );
}

function Cornea() {
  return (
    <mesh position={[0, 0, 0.34]}>
      <sphereGeometry args={[0.38, 96, 96, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.22}
        transmission={0.95}
        roughness={0}
        thickness={0.08}
        clearcoat={1}
      />
    </mesh>
  );
}

function Pupil() {
  return (
    <mesh position={[0, 0, 0.305]}>
      <circleGeometry args={[0.11, 64]} />
      <meshStandardMaterial color="#0d0d0d" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function CutawayGuide() {
  return (
    <>
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.505, 64]} />
        <meshBasicMaterial color="#5c6b8a" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.42]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </>
  );
}

export default function EyeModel() {
  const { params } = useVision();

  const axialScaleZ = useMemo(() => {
    if (params.sphere < 0) {
      return Math.min(1 + Math.abs(params.sphere) * 0.03, 1.35);
    }

    if (params.sphere > 0) {
      return Math.max(1 - params.sphere * 0.01, 0.92);
    }

    return 1;
  }, [params.sphere]);

  return (
    <group>
      <Sclera scaleZ={axialScaleZ} />
      <Retina scaleZ={axialScaleZ} />
      <Lens />
      <IrisTexture />
      <Pupil />
      <Cornea />
      <CutawayGuide />
    </group>
  );
}
