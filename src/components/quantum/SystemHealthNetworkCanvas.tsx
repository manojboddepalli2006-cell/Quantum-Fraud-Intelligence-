/**
 * SystemHealthNetworkCanvas Component
 * Subtle 3D system network visualization for the System Health dashboard.
 * Features:
 * - 4 glowing nodes (Backend, API, Model, Quantum Engine)
 * - Interconnected pulsing lines
 * - Soft orbital movement
 * - Biscuit / caramel / gold styling strictly enforced
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useQuantum } from '../../context/QuantumContext';

interface SystemHealthNetworkCanvasProps {
  status: 'CONNECTED' | 'OFFLINE' | 'CHECKING';
  className?: string;
}

export const SystemHealthNetworkCanvas: React.FC<SystemHealthNetworkCanvasProps> = ({
  status,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useQuantum();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Node coordinates in tetrahedral formation
    const nodeCoords = [
      new THREE.Vector3(-4.0, 2.2, 0),   // Backend
      new THREE.Vector3(4.0, 2.2, 0),    // API
      new THREE.Vector3(-2.5, -2.6, 2),  // Model
      new THREE.Vector3(2.5, -2.6, -2),  // Quantum Engine
    ];

    const isConnected = status === 'CONNECTED';
    const isOffline = status === 'OFFLINE';

    const nodeColor = isConnected ? 0x3D7A5A : isOffline ? 0xB83A2E : 0xC5A46D;
    const lineColor = isConnected ? 0xC5A46D : isOffline ? 0xE8D2B5 : 0xDCC09B;

    const disposables: { dispose: () => void }[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    // Create 4 Glowing System Nodes
    nodeCoords.forEach((pos) => {
      const nGroup = new THREE.Group();
      nGroup.position.copy(pos);

      // Outer wireframe sphere
      const outerGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const outerMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        wireframe: true,
        transparent: true,
        opacity: isConnected ? 0.6 : 0.3,
      });
      const outer = new THREE.Mesh(outerGeo, outerMat);
      nGroup.add(outer);

      // Inner glowing core
      const innerGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const innerMat = new THREE.MeshBasicMaterial({
        color: isConnected ? 0xDFB878 : nodeColor,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      nGroup.add(inner);

      group.add(nGroup);
      nodeMeshes.push(outer);
      disposables.push(outerGeo, outerMat, innerGeo, innerMat);
    });

    // Connecting Network Lines
    const pairs = [
      [0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]
    ];
    pairs.forEach(([a, b]) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([nodeCoords[a], nodeCoords[b]]);
      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: isConnected ? 0.45 : 0.2,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
      disposables.push(lineGeo, lineMat);
    });

    // Soft Orbital Particle Cloud
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      pPos[i * 3] = Math.cos(angle) * 6.5;
      pPos[i * 3 + 1] = Math.sin(angle * 2) * 1.5;
      pPos[i * 3 + 2] = Math.sin(angle) * 6.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC5A46D,
      size: 0.35,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);
    disposables.push(particleGeo, particleMat);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!reducedMotion) {
        group.rotation.y += delta * 0.15;
        group.rotation.x += delta * 0.08;

        particles.rotation.y += delta * 0.25;

        // Pulse scale on nodes
        const pulse = 1 + Math.sin(time * 0.003) * 0.08;
        nodeMeshes.forEach((m) => m.scale.setScalar(pulse));
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
  }, [status, reducedMotion]);

  return (
    <div className={`relative w-full h-72 sm:h-80 ${className}`}>
      <div ref={containerRef} className="w-full h-full relative z-10" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_45%,_rgba(246,235,221,0.5)_100%] pointer-events-none" />
    </div>
  );
};
