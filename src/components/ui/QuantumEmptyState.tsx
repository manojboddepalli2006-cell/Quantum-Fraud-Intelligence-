/**
 * QuantumEmptyState Component
 * Subtle 3D quantum visualizer with official empty state messaging:
 * "No analysis data yet"
 * "Run your first transaction analysis to activate Q-FraudX intelligence."
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

interface QuantumEmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export const QuantumEmptyState: React.FC<QuantumEmptyStateProps> = ({
  onAction,
  actionLabel = 'Analyze a Transaction',
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Subtle 3D wireframe dodecahedron
    const geo = new THREE.DodecahedronGeometry(3.6, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xC5A46D,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Inner sphere point lattice
    const innerGeo = new THREE.SphereGeometry(1.8, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xB98252,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    let animId: number;
    let last = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - last) / 1000, 0.1);
      last = time;

      group.rotation.y += delta * 0.25;
      group.rotation.x += delta * 0.12;

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
      geo.dispose();
      mat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`p-10 sm:p-14 rounded-3xl bg-[#FFFDF9]/90 border border-[#E8D2B5] shadow-sm flex flex-col items-center justify-center text-center space-y-5 ${className}`}
    >
      {/* 3D Quantum Canvas */}
      <div className="w-48 h-40 relative flex items-center justify-center">
        <div ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-xl font-serif font-bold text-[#2E1E18]">
          No analysis data yet
        </h3>
        <p className="text-xs text-[#8B6245] leading-relaxed">
          Run your first transaction analysis to activate Q-FraudX intelligence.
        </p>
      </div>

      {onAction && (
        <Button
          variant="gold"
          size="md"
          onClick={onAction}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
