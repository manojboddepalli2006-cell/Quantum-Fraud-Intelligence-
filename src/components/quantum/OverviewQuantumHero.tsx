/**
 * OverviewQuantumHero Component
 * Large 3D Quantum Visualization card for the Overview dashboard hero.
 * Features a dedicated Three.js interactive quantum sphere with Bloch axes,
 * internal concentric lattices, and orbital particle ribbons.
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useQuantum } from '../../context/QuantumContext';
import { Card } from '../ui/Card';
import { Sparkles, Maximize2, RotateCcw } from 'lucide-react';

export const OverviewQuantumHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activityState, reducedMotion } = useQuantum();

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

    // Group containing the quantum structure
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer wireframe Bloch cage (muted gold)
    const cageGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xC5A46D,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    group.add(cageMesh);

    // 2. Intermediate Dodecahedron lattice (caramel)
    const midGeo = new THREE.DodecahedronGeometry(3.0, 0);
    const midMat = new THREE.MeshBasicMaterial({
      color: 0xB98252,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    group.add(midMesh);

    // 3. Dense central sphere (coffee brown)
    const coreGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x8B6245,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 4. Orbital rings
    const ringGeo = new THREE.RingGeometry(5.4, 5.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xDCC09B,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 5. Orbiting particles along the ring
    const particleCount = 24;
    const particleGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const a = (i / particleCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * 5.45;
      pos[i * 3 + 1] = Math.sin(a * 2) * 0.8;
      pos[i * 3 + 2] = Math.sin(a) * 5.45;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xDFB878,
      size: 0.35,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Animation loop
    let animId: number;
    let last = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - last) / 1000, 0.1);
      last = time;

      if (!reducedMotion) {
        const speed = activityState === 'ANALYZING' ? 2.5 : 1.0;
        group.rotation.y += delta * 0.4 * speed;
        group.rotation.x += delta * 0.2 * speed;
        particles.rotation.y += delta * 0.6 * speed;

        const pulse = 1 + Math.sin(time * 0.002) * 0.04;
        cageMesh.scale.setScalar(pulse);
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
      cageGeo.dispose();
      cageMat.dispose();
      midGeo.dispose();
      midMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activityState, reducedMotion]);

  return (
    <Card
      variant="elevated"
      rounded="3xl"
      padding="none"
      className="relative overflow-hidden border-[#DCC09B] shadow-[0_12px_40px_rgba(74,48,36,0.08)] bg-gradient-to-br from-[#FFFDF9] via-[#F6EBDD]/90 to-[#E8D2B5]/50"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Information Zone (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
            <Sparkles className="w-3.5 h-3.5 text-[#B98252]" />
            <span>Hilbert Space Dimensional Projection</span>
            <span aria-hidden="true">·</span>
            <span>State: {activityState}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2E1E18] leading-tight">
            Quantum Fraud Intelligence
          </h2>

          <p className="text-sm text-[#4A3024] leading-relaxed max-w-xl">
            &ldquo;Quantum-enhanced transaction intelligence for modern financial security.&rdquo;
          </p>

          <p className="text-xs text-[#8B6245] leading-relaxed max-w-lg">
            High-dimensional variational classification maps complex 6-variable credit card
            anomalies into parameterized quantum circuits, exposing non-linear fraud signatures.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#4A3024]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B98252]" />
              <span>Rotational Gates: RZ, RY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A46D]" />
              <span>Entanglement: CNOT / CZ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8B6245]" />
              <span>Observable: Pauli-Z</span>
            </div>
          </div>
        </div>

        {/* Right 3D Visualizer Viewport (5 cols) */}
        <div className="lg:col-span-5 h-72 sm:h-80 lg:h-96 relative flex items-center justify-center p-4">
          <div ref={containerRef} className="w-full h-full relative z-10" />
          <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(246,235,221,0.5)_100%] pointer-events-none" />
        </div>
      </div>
    </Card>
  );
};
