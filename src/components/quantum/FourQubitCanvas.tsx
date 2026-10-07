/**
 * FourQubitCanvas Component
 * Interactive 3D visualization of the 4-Qubit Variational Core:
 * Qubit 1 (V14), Qubit 2 (V17), Qubit 3 (V10), Qubit 4 (V12)
 * Features:
 * - 4 distinct Bloch orbital nodes with precessing rings
 * - Dynamic entangling connection curves between qubits
 * - Measurement indicators (Z-basis projection)
 * - Subtle data flow particles
 * - Biscuit / caramel / gold palette strictly enforced
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useQuantum } from '../../context/QuantumContext';

export const FourQubitCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activityState, reducedMotion } = useQuantum();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 20);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Qubit spatial configurations (4 tetrahedral/quad points in space)
    const qubitPositions = [
      new THREE.Vector3(-5.2, 1.8, 0),   // Qubit 1 (V14)
      new THREE.Vector3(5.2, 1.8, 0),    // Qubit 2 (V17)
      new THREE.Vector3(-3.2, -3.2, 1.5),// Qubit 3 (V10)
      new THREE.Vector3(3.2, -3.2, -1.5),// Qubit 4 (V12)
    ];

    const qubitGroups: THREE.Group[] = [];
    const disposables: { dispose: () => void }[] = [];

    // Create the 4 Qubit Nodes
    qubitPositions.forEach((pos, idx) => {
      const qGroup = new THREE.Group();
      qGroup.position.copy(pos);

      // A. Qubit Core Sphere (coffee brown / dark chocolate)
      const coreGeo = new THREE.SphereGeometry(0.95, 20, 20);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x8B6245,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      qGroup.add(coreMesh);

      // B. Inner dielectric point (muted gold)
      const innerGeo = new THREE.SphereGeometry(0.4, 12, 12);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xDFB878,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      qGroup.add(innerMesh);

      // C. Precession Orbital Ring (caramel)
      const ringGeo = new THREE.RingGeometry(1.6, 1.7, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xC5A46D,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3 + idx * 0.4;
      qGroup.add(ringMesh);

      // D. Measurement needle axis (Pauli-Z axis)
      const axisGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8);
      const axisMat = new THREE.MeshBasicMaterial({
        color: 0xB98252,
        transparent: true,
        opacity: 0.6,
      });
      const axisMesh = new THREE.Mesh(axisGeo, axisMat);
      qGroup.add(axisMesh);

      rootGroup.add(qGroup);
      qubitGroups.push(qGroup);
      disposables.push(coreGeo, coreMat, innerGeo, innerMat, ringGeo, ringMat, axisGeo, axisMat);
    });

    // Entangling Curved Lines between qubits
    const curvePairs = [
      [0, 1], // Q1 - Q2
      [0, 2], // Q1 - Q3
      [1, 3], // Q2 - Q4
      [2, 3], // Q3 - Q4
      [0, 3], // cross Q1 - Q4
      [1, 2], // cross Q2 - Q3
    ];

    const curveMeshes: THREE.Line[] = [];
    curvePairs.forEach(([i, j]) => {
      const p1 = qubitPositions[i];
      const p2 = qubitPositions[j];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (i + j) % 2 === 0 ? 1.4 : -1.4; // arch curve

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xDCC09B,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);
      curveMeshes.push(line);
      disposables.push(lineGeo, lineMat);
    });

    // Flowing Entanglement Data Particles
    const flowCount = 36;
    const flowGeo = new THREE.BufferGeometry();
    const flowPos = new Float32Array(flowCount * 3);
    for (let i = 0; i < flowCount; i++) {
      flowPos[i * 3] = (Math.random() - 0.5) * 12;
      flowPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      flowPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
    const flowMat = new THREE.PointsMaterial({
      color: 0xDFB878,
      size: 0.3,
      transparent: true,
      opacity: 0.75,
    });
    const flowParticles = new THREE.Points(flowGeo, flowMat);
    rootGroup.add(flowParticles);
    disposables.push(flowGeo, flowMat);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!reducedMotion) {
        const speed = activityState === 'ANALYZING' ? 2.6 : 1.0;

        // Subtle root slow rotation
        rootGroup.rotation.y += delta * 0.12 * speed;

        // Qubit individual precession
        qubitGroups.forEach((qg, idx) => {
          qg.rotation.y += delta * 0.4 * speed * (idx % 2 === 0 ? 1 : -1);
          qg.rotation.z += delta * 0.2 * speed;
        });

        // Flow particles
        flowParticles.rotation.y += delta * 0.3 * speed;
        flowParticles.rotation.x += delta * 0.1 * speed;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activityState, reducedMotion]);

  return (
    <div className={`relative w-full h-80 sm:h-96 ${className}`}>
      <div ref={containerRef} className="w-full h-full relative z-10" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(246,235,221,0.5)_100%] pointer-events-none" />
    </div>
  );
};
