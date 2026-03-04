'use client';

import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as THREE from 'three';

export default function Model() {
  const group = useRef();
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const targetRotationZ = useRef(0);

  // Load materials first
  const materials = useLoader(MTLLoader, '/models/model.mtl');

  // Preload materials
  useEffect(() => {
    materials.preload();
  }, [materials]);

  // Load OBJ and apply materials
  const obj = useLoader(
    OBJLoader,
    '/models/model.obj',
    (loader) => {
      loader.setMaterials(materials);
    }
  );

  useLayoutEffect(() => {
    if (!obj) return;

    // The source MTL does not include a dedicated glass texture for the lens.
    // Replace the lens material with a physical glass material for proper rendering.
    obj.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      if (child.material.name !== 'Camera_01_lens') return;

      child.material = new THREE.MeshPhysicalMaterial({
        name: 'Camera_01_lens_glass',
        color: new THREE.Color(0x000000),
        metalness: 0,
        roughness: 0.08,
        transmission: 0.18,
        ior: 1.5,
        thickness: 0.6,
        attenuationColor: new THREE.Color(0x000000),
        attenuationDistance: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.35,
      });
    });

    obj.rotation.set(0, 0, 0);
    obj.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetSize = 1.2;
    const scaleFactor = maxDimension > 0 ? targetSize / maxDimension : 1;

    obj.scale.setScalar(scaleFactor);

    // Recompute bounds after scaling, then shift geometry so its true center
    // sits at the group's origin (pivot), giving a real "spin on itself".
    box.setFromObject(obj);
    box.getCenter(center);
    obj.position.set(-center.x, -center.y, -center.z);
  }, [obj]);

  useEffect(() => {
    const onWheel = (event) => {
      if (event.altKey) return;
      targetRotationY.current += event.deltaY * 0.002;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    let isDragging = false;
    let lastY = 0;

    const onPointerDown = (event) => {
      const isCanvasTarget =
        event.target instanceof Element && event.target.tagName === 'CANVAS';
      if (!isCanvasTarget) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      isDragging = true;
      lastY = event.clientY;
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;

      const deltaY = event.clientY - lastY;
      lastY = event.clientY;

      // Dragging down rotates around all axes for a "spin in place" feel.
      if (deltaY <= 0) return;
      const amount = deltaY * 0.01;
      targetRotationX.current += amount * 0.5;
      targetRotationY.current += amount;
      targetRotationZ.current += amount * 0.35;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotationX.current,
      0.12
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotationY.current,
      0.12
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetRotationZ.current,
      0.12
    );
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={obj} scale={1} />
    </group>
  );
}
