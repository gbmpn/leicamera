'use client';

import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import Model from './Model';
import * as THREE from 'three';

function CameraZoomRig() {
  const { camera } = useThree();
  const cameraRef = useRef();
  const targetZ = useRef(1.6);
  const minZ = 0.9;
  const maxZ = 16.2;

  useEffect(() => {
    cameraRef.current = camera;
    targetZ.current = camera.position.z;
  }, [camera]);

  useEffect(() => {
    const onWheel = (event) => {
      if (!event.altKey) return;
      targetZ.current = THREE.MathUtils.clamp(
        targetZ.current + event.deltaY * 0.002,
        minZ,
        maxZ
      );
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetZ.current, 0.15);
    cam.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.5], fov: 22 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      style={{ background: '#0b0b0f' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <CameraZoomRig />
      <Model />
    </Canvas>
  );
}
