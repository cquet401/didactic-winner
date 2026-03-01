import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useVision, CameraAngle } from '../../contexts/VisionContext';
import EyeModel from './EyeModel';
import SimulationScene from './SimulationScene';

const ANATOMY_CAMERA_PRESETS: Record<
  CameraAngle,
  {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    near: number;
    far: number;
  }
> = {
  front: { position: [0, 0, 3], target: [0, 0, 0], fov: 50, near: 0.1, far: 100 },
  top: { position: [0, 3, 0.1], target: [0, 0, 0], fov: 50, near: 0.1, far: 100 },
  bottom: { position: [0, -3, 0.1], target: [0, 0, 0], fov: 50, near: 0.1, far: 100 },
  left: { position: [-3, 0, 0.1], target: [0, 0, 0], fov: 50, near: 0.1, far: 100 },
  right: { position: [3, 0, 0.1], target: [0, 0, 0], fov: 50, near: 0.1, far: 100 },
};

const SIMULATION_CAMERA = {
  position: [0, 1.3, 6.5] as [number, number, number],
  target: [0, 1.2, -8] as [number, number, number],
  fov: 55,
  near: 0.1,
  far: 120,
};

function MyopiaFog() {
  const { params } = useVision();
  const { scene } = useThree();

  const fogParams = useMemo(() => {
    const sphere = Math.abs(params.sphere);
    const cylinder = Math.abs(params.cylinder);
    const axisOffset = Math.abs(params.axis - 90) / 90;
    const axisWeight = 1 - axisOffset * 0.2;
    const total = sphere + cylinder * 0.5 * axisWeight;

    if (total < 0.25) {
      return { near: 100, far: 100, opacity: 0 };
    }

    const opacity = Math.min(total * 0.08, 0.85);
    const near = 1;
    const far = 20 - total * 0.5;

    return { near, far, opacity };
  }, [params.sphere, params.cylinder, params.axis]);

  useEffect(() => {
    if (fogParams.opacity > 0) {
      scene.fog = new THREE.Fog('#1a1a2e', fogParams.near, fogParams.far);
    } else {
      scene.fog = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [scene, fogParams]);

  return null;
}

function CameraController() {
  const { viewMode, cameraAngle, autoRotate } = useVision();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  useEffect(() => {
    const preset = viewMode === 'anatomy' ? ANATOMY_CAMERA_PRESETS[cameraAngle] : SIMULATION_CAMERA;
    perspectiveCamera.position.set(...preset.position);
    perspectiveCamera.fov = preset.fov;
    perspectiveCamera.near = preset.near;
    perspectiveCamera.far = preset.far;
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(...preset.target);

    if (controlsRef.current) {
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, [viewMode, cameraAngle, perspectiveCamera]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = viewMode === 'anatomy' && autoRotate;
    }
  }, [viewMode, autoRotate]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={1.5}
      maxDistance={16}
      autoRotate={viewMode === 'anatomy' && autoRotate}
      autoRotateSpeed={0.8}
    />
  );
}

function SceneContent() {
  const { viewMode } = useVision();

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 5]} intensity={0.4} color="#87CEEB" />

      <CameraController />

      {viewMode === 'anatomy' ? (
        <>
          <EyeModel />
          <Environment preset="city" />
        </>
      ) : (
        <>
          <MyopiaFog />
          <SimulationScene />
        </>
      )}
    </>
  );
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#0ea5e9" wireframe />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas
        camera={{
          position: ANATOMY_CAMERA_PRESETS.front.position,
          fov: ANATOMY_CAMERA_PRESETS.front.fov,
          near: ANATOMY_CAMERA_PRESETS.front.near,
          far: ANATOMY_CAMERA_PRESETS.front.far,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0f172a']} />
        <Suspense fallback={<Loader />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
