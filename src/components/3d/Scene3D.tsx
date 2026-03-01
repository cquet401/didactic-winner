import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useVision, CameraAngle } from '../../contexts/VisionContext';
import EyeModel from './EyeModel';
import SimulationScene from './SimulationScene';

const CAMERA_PRESETS: Record<
  CameraAngle,
  {
    position: [number, number, number];
    fov: number;
    near: number;
    far: number;
  }
> = {
  front: { position: [0, 0, 3], fov: 50, near: 0.1, far: 100 },
  top: { position: [0, 3, 0.1], fov: 50, near: 0.1, far: 100 },
  bottom: { position: [0, -3, 0.1], fov: 50, near: 0.1, far: 100 },
  left: { position: [-3, 0, 0.1], fov: 50, near: 0.1, far: 100 },
  right: { position: [3, 0, 0.1], fov: 50, near: 0.1, far: 100 },
};

// 模拟近视模糊效果 - 使用简单的雾效
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

// 相机位置控制组件
function CameraController() {
  const { cameraAngle, autoRotate } = useVision();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // 根据角度设置相机位置
  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraAngle];
    camera.position.set(...preset.position);
    camera.fov = preset.fov;
    camera.near = preset.near;
    camera.far = preset.far;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);

    if (controlsRef.current) {
      const controls = controlsRef.current;
      const shouldRestoreAutoRotate = controls.autoRotate;
      controls.autoRotate = false;
      controls.target.set(0, 0, 0);
      controls.update();

      if (shouldRestoreAutoRotate && autoRotate) {
        requestAnimationFrame(() => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        });
      }
    }
  }, [cameraAngle, camera, autoRotate]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={1.5}
      maxDistance={8}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
    />
  );
}

// 3D场景内容
function SceneContent() {
  const { viewMode } = useVision();

  return (
    <>
      {/* 环境光照 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 5]} intensity={0.4} color="#87CEEB" />

      {viewMode === 'anatomy' ? (
        <>
          <CameraController />
          <EyeModel />
          <Environment preset="city" />
        </>
      ) : (
        <>
          {/* 雾效单一数据源：仅由 MyopiaFog 基于 SPH/CYL/AXIS 计算并写入 scene.fog */}
          <MyopiaFog />
          <SimulationScene />
        </>
      )}
    </>
  );
}

// 加载指示器
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
          position: CAMERA_PRESETS.front.position,
          fov: CAMERA_PRESETS.front.fov,
          near: CAMERA_PRESETS.front.near,
          far: CAMERA_PRESETS.front.far,
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
