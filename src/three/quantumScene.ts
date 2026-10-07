/**
 * Q-FraudX Quantum Three.js Scene Engine
 * High-performance living 3D WebGL background adhering strictly to the Biscuit / Warm Cream palette.
 * Features:
 * - Multi-layer abstract quantum core (nested layers, muted gold highlights, caramel lighting)
 * - Dynamic quantum nodes and curved/interconnected lines
 * - Atmospheric quantum waves and data particles
 * - Gentle mouse parallax (camera dampening, decoupled from UI)
 * - State engine: IDLE -> ANALYZING -> SUCCESS (outward wave) -> ERROR (warm-red reaction)
 * - Fully decoupled from React render loops (0 re-render impact on React)
 */

import * as THREE from 'three';
import { QuantumActivityState } from '../types/quantum';

export interface QuantumSceneConfig {
  container: HTMLElement;
  initialState?: QuantumActivityState;
  reducedMotion?: boolean;
}

export class QuantumSceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  // Scene elements
  private particleSystem!: THREE.Points;
  private nodeMesh!: THREE.InstancedMesh;
  private connectionLines!: THREE.LineSegments;
  private orbitalGroup!: THREE.Group;

  // Multi-layered Quantum Core
  private coreGroup!: THREE.Group;
  private coreOuterMesh!: THREE.Mesh;
  private coreMidMesh!: THREE.Mesh;
  private coreInnerMesh!: THREE.Mesh;
  private coreOrbitParticles!: THREE.Points;
  private coreOrbitGeo!: THREE.BufferGeometry;

  // Outward Expansion Wave (for SUCCESS)
  private pulseWaveMesh!: THREE.Mesh;
  private pulseWaveRadius = 0;
  private pulseWaveActive = false;

  // State management
  private currentState: QuantumActivityState = 'IDLE';
  private targetSpeedMultiplier = 1.0;
  private currentSpeedMultiplier = 1.0;
  private pulseEnergy = 0; // decays back to 0
  private pulseColor = new THREE.Color('#C5A46D');
  private reducedMotion = false;
  private isMobile = false;

  // Mouse Parallax variables
  private targetMouseX = 0;
  private targetMouseY = 0;
  private currentMouseX = 0;
  private currentMouseY = 0;
  private handleMouseMoveBound: (e: MouseEvent) => void;

  // Dynamic particle & node data
  private nodeCount = 56;
  private particleCount = 190;
  private coreOrbitCount = 32;
  private nodePositions: Float32Array;
  private nodeVelocities: Float32Array;
  private dummy = new THREE.Object3D();
  private maxConnectionDist = 26;

  // Disposables & Observers
  private disposables: { dispose: () => void }[] = [];
  private resizeObserver: ResizeObserver | null = null;

  constructor(config: QuantumSceneConfig) {
    this.container = config.container;
    this.currentState = config.initialState || 'IDLE';
    this.reducedMotion = !!config.reducedMotion;

    // Responsive capacity detection
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.nodeCount = 28;
      this.particleCount = 85;
      this.coreOrbitCount = 16;
      this.maxConnectionDist = 20;
    }

    this.nodePositions = new Float32Array(this.nodeCount * 3);
    this.nodeVelocities = new Float32Array(this.nodeCount * 3);

    // 1. Scene setup with delicate warm biscuit fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xFFF9F0, 0.0075);

    // 2. Camera setup
    const aspect = this.container.clientWidth / (this.container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 78);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.initSceneObjects();
    this.setupListeners();

    // Mouse parallax listener
    this.handleMouseMoveBound = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMoveBound, { passive: true });

    this.startLoop();
  }

  private initSceneObjects(): void {
    // =========================================================================
    // A. Multi-Layer Abstract Quantum Core
    // =========================================================================
    this.coreGroup = new THREE.Group();

    // Layer 1: Outer dielectric icosahedron cage (muted gold #C5A46D)
    const outerGeo = new THREE.IcosahedronGeometry(7.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xC5A46D,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    this.coreOuterMesh = new THREE.Mesh(outerGeo, outerMat);
    this.coreGroup.add(this.coreOuterMesh);

    // Layer 2: Intermediate dodecahedron quantum lattice (warm caramel #B98252)
    const midGeo = new THREE.DodecahedronGeometry(5.2, 0);
    const midMat = new THREE.MeshBasicMaterial({
      color: 0xB98252,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    this.coreMidMesh = new THREE.Mesh(midGeo, midMat);
    this.coreGroup.add(this.coreMidMesh);

    // Layer 3: Central dense core sphere (coffee brown / dark chocolate #8B6245)
    const innerGeo = new THREE.SphereGeometry(2.6, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8B6245,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    this.coreInnerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.coreInnerMesh);

    // Layer 4: Core orbiting quantum data particles
    this.coreOrbitGeo = new THREE.BufferGeometry();
    const coreOrbitPos = new Float32Array(this.coreOrbitCount * 3);
    for (let i = 0; i < this.coreOrbitCount; i++) {
      const angle = (i / this.coreOrbitCount) * Math.PI * 2;
      const radius = 9.5 + (i % 3) * 1.5;
      coreOrbitPos[i * 3] = Math.cos(angle) * radius;
      coreOrbitPos[i * 3 + 1] = (Math.sin(angle * 2) * 2.2);
      coreOrbitPos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    this.coreOrbitGeo.setAttribute('position', new THREE.BufferAttribute(coreOrbitPos, 3));
    const coreOrbitMat = new THREE.PointsMaterial({
      color: 0xDFB878, // bright muted gold
      size: 1.4,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    this.coreOrbitParticles = new THREE.Points(this.coreOrbitGeo, coreOrbitMat);
    this.coreGroup.add(this.coreOrbitParticles);

    this.disposables.push(
      outerGeo, outerMat,
      midGeo, midMat,
      innerGeo, innerMat,
      this.coreOrbitGeo, coreOrbitMat
    );
    this.scene.add(this.coreGroup);

    // =========================================================================
    // B. Quantum Orbital Precession Rings
    // =========================================================================
    this.orbitalGroup = new THREE.Group();
    const ringRadii = [18, 27, 36];
    const ringColors = [0xC5A46D, 0xDCC09B, 0xB98252];

    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r, r + 0.16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.16 - idx * 0.03,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (Math.PI / 3.2) * (idx + 1);
      ring.rotation.y = (Math.PI / 4.5) * idx;
      this.orbitalGroup.add(ring);
      this.disposables.push(ringGeo, ringMat);
    });
    this.scene.add(this.orbitalGroup);

    // =========================================================================
    // C. Floating Quantum Nodes (Instanced Spheres)
    // =========================================================================
    const nodeGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x8B6245,
      transparent: true,
      opacity: 0.5,
    });
    this.nodeMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, this.nodeCount);

    for (let i = 0; i < this.nodeCount; i++) {
      const x = (Math.random() - 0.5) * 85;
      const y = (Math.random() - 0.5) * 58;
      const z = (Math.random() - 0.5) * 48;

      this.nodePositions[i * 3] = x;
      this.nodePositions[i * 3 + 1] = y;
      this.nodePositions[i * 3 + 2] = z;

      this.nodeVelocities[i * 3] = (Math.random() - 0.5) * 0.038;
      this.nodeVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.038;
      this.nodeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.038;

      this.dummy.position.set(x, y, z);
      this.dummy.scale.setScalar(0.75 + Math.random() * 0.55);
      this.dummy.updateMatrix();
      this.nodeMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.nodeMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.nodeMesh);
    this.disposables.push(nodeGeo, nodeMat);

    // =========================================================================
    // D. Dynamic Quantum Node Connection Lines
    // =========================================================================
    const maxLineSegments = this.nodeCount * 4;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xDCC09B,
      transparent: true,
      opacity: 0.22,
      blending: THREE.NormalBlending,
    });
    this.connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    this.scene.add(this.connectionLines);
    this.disposables.push(lineGeo, lineMat);

    // =========================================================================
    // E. Atmospheric Quantum Particles (Data stream background)
    // =========================================================================
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 115;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 85;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 75;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xC5A46D,
      size: 1.15,
      transparent: true,
      opacity: 0.32,
      sizeAttenuation: true,
    });
    this.particleSystem = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particleSystem);
    this.disposables.push(particleGeo, particleMat);

    // =========================================================================
    // F. Outward Expansion Shockwave Ring (for SUCCESS state)
    // =========================================================================
    const waveGeo = new THREE.RingGeometry(0.1, 1.2, 48);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xDFB878,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.pulseWaveMesh = new THREE.Mesh(waveGeo, waveMat);
    this.pulseWaveMesh.visible = false;
    this.scene.add(this.pulseWaveMesh);
    this.disposables.push(waveGeo, waveMat);
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.reducedMotion) return;
    // Normalize coordinates: range [-1, 1]
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  private setupListeners(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);

    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    });

    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.initSceneObjects();
      this.startLoop();
    });
  }

  public setActivityState(state: QuantumActivityState): void {
    if (this.currentState === state) return;

    this.currentState = state;

    switch (state) {
      case 'ANALYZING':
        this.targetSpeedMultiplier = 2.8;
        this.maxConnectionDist = this.isMobile ? 28 : 36;
        (this.coreOuterMesh.material as THREE.MeshBasicMaterial).opacity = 0.6;
        (this.coreMidMesh.material as THREE.MeshBasicMaterial).opacity = 0.45;
        (this.connectionLines.material as THREE.LineBasicMaterial).opacity = 0.45;
        break;

      case 'SUCCESS':
        this.pulseEnergy = 1.0;
        this.pulseColor.set('#DFB878'); // warm gold
        this.targetSpeedMultiplier = 1.6;
        // Trigger outward expansion wave
        this.pulseWaveActive = true;
        this.pulseWaveRadius = 0;
        this.pulseWaveMesh.visible = true;
        break;

      case 'ERROR':
        this.pulseEnergy = 1.0;
        this.pulseColor.set('#B83A2E'); // subtle warm-red alert
        this.targetSpeedMultiplier = 1.3;
        break;

      case 'IDLE':
      default:
        this.targetSpeedMultiplier = 1.0;
        this.maxConnectionDist = this.isMobile ? 20 : 26;
        (this.coreOuterMesh.material as THREE.MeshBasicMaterial).opacity = 0.28;
        (this.coreMidMesh.material as THREE.MeshBasicMaterial).opacity = 0.22;
        (this.connectionLines.material as THREE.LineBasicMaterial).opacity = 0.22;
        break;
    }
  }

  public setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
  }

  private handleResize(): void {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private startLoop(): void {
    let lastTime = performance.now();

    const animate = (time: number) => {
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (this.reducedMotion) {
        this.renderer.render(this.scene, this.camera);
        return;
      }

      // 1. Mouse Parallax interpolation (gentle background layer shift)
      this.currentMouseX += (this.targetMouseX - this.currentMouseX) * (delta * 2.2);
      this.currentMouseY += (this.targetMouseY - this.currentMouseY) * (delta * 2.2);

      this.camera.position.x = this.currentMouseX * 5.2;
      this.camera.position.y = -this.currentMouseY * 3.8;
      this.camera.lookAt(0, 0, 0);

      // 2. Speed multiplier lerp
      this.currentSpeedMultiplier += (this.targetSpeedMultiplier - this.currentSpeedMultiplier) * (delta * 3.2);

      // 3. Pulse decay for SUCCESS / ERROR
      if (this.pulseEnergy > 0.01) {
        this.pulseEnergy -= delta * 0.42; // decays in ~2.4 seconds
        if (this.pulseEnergy <= 0.01) {
          this.pulseEnergy = 0;
          if (this.currentState === 'SUCCESS' || this.currentState === 'ERROR') {
            this.setActivityState('IDLE');
          }
        }
      }

      // 4. Outward expansion wave animation (SUCCESS)
      if (this.pulseWaveActive) {
        this.pulseWaveRadius += delta * 32.0;
        const waveScale = Math.max(0.1, this.pulseWaveRadius);
        this.pulseWaveMesh.scale.set(waveScale, waveScale, 1);
        const waveMat = this.pulseWaveMesh.material as THREE.MeshBasicMaterial;
        const waveAlpha = Math.max(0, 0.65 - (this.pulseWaveRadius / 45) * 0.65);
        waveMat.opacity = waveAlpha;

        if (this.pulseWaveRadius > 45) {
          this.pulseWaveActive = false;
          this.pulseWaveMesh.visible = false;
        }
      }

      // 5. Multi-Layer Quantum Core Rotation & Breathing
      const coreSpeed = 0.22 * this.currentSpeedMultiplier;
      this.coreOuterMesh.rotation.x += delta * coreSpeed;
      this.coreOuterMesh.rotation.y += delta * (coreSpeed * 1.3);

      this.coreMidMesh.rotation.y -= delta * (coreSpeed * 1.1);
      this.coreMidMesh.rotation.z += delta * (coreSpeed * 0.9);

      this.coreInnerMesh.rotation.x -= delta * (coreSpeed * 0.7);
      this.coreInnerMesh.rotation.z += delta * (coreSpeed * 0.5);

      // Core orbiting particles rotation
      this.coreOrbitParticles.rotation.y += delta * 0.45 * this.currentSpeedMultiplier;
      this.coreOrbitParticles.rotation.x += delta * 0.15 * this.currentSpeedMultiplier;

      // Subtle breathing scale
      const breath = 1 + Math.sin(time * 0.0016 * this.currentSpeedMultiplier) * 0.05 + this.pulseEnergy * 0.15;
      this.coreGroup.scale.setScalar(breath);

      // 6. Orbital Rings Precession
      this.orbitalGroup.rotation.y += delta * 0.07 * this.currentSpeedMultiplier;
      this.orbitalGroup.rotation.x += delta * 0.035 * this.currentSpeedMultiplier;

      // 7. Quantum Nodes dynamics & dynamic connections
      let lineVertexIdx = 0;
      const linePosAttr = this.connectionLines.geometry.getAttribute('position') as THREE.BufferAttribute;
      const lineArray = linePosAttr.array as Float32Array;

      const nodeVelMul = 0.7 + this.currentSpeedMultiplier * 0.55;

      for (let i = 0; i < this.nodeCount; i++) {
        let x = this.nodePositions[i * 3] + this.nodeVelocities[i * 3] * nodeVelMul;
        let y = this.nodePositions[i * 3 + 1] + this.nodeVelocities[i * 3 + 1] * nodeVelMul;
        let z = this.nodePositions[i * 3 + 2] + this.nodeVelocities[i * 3 + 2] * nodeVelMul;

        const boundX = 42;
        const boundY = 28;
        const boundZ = 24;

        if (Math.abs(x) > boundX) {
          this.nodeVelocities[i * 3] *= -1;
          x = Math.sign(x) * boundX;
        }
        if (Math.abs(y) > boundY) {
          this.nodeVelocities[i * 3 + 1] *= -1;
          y = Math.sign(y) * boundY;
        }
        if (Math.abs(z) > boundZ) {
          this.nodeVelocities[i * 3 + 2] *= -1;
          z = Math.sign(z) * boundZ;
        }

        this.nodePositions[i * 3] = x;
        this.nodePositions[i * 3 + 1] = y;
        this.nodePositions[i * 3 + 2] = z;

        this.dummy.position.set(x, y, z);
        this.dummy.scale.setScalar(0.75 + Math.sin(time * 0.002 + i) * 0.15 + this.pulseEnergy * 0.25);
        this.dummy.updateMatrix();
        this.nodeMesh.setMatrixAt(i, this.dummy.matrix);

        // Calculate dynamic connection segments
        for (let j = i + 1; j < this.nodeCount; j++) {
          const dx = x - this.nodePositions[j * 3];
          const dy = y - this.nodePositions[j * 3 + 1];
          const dz = z - this.nodePositions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < this.maxConnectionDist * this.maxConnectionDist && lineVertexIdx < lineArray.length - 6) {
            lineArray[lineVertexIdx++] = x;
            lineArray[lineVertexIdx++] = y;
            lineArray[lineVertexIdx++] = z;
            lineArray[lineVertexIdx++] = this.nodePositions[j * 3];
            lineArray[lineVertexIdx++] = this.nodePositions[j * 3 + 1];
            lineArray[lineVertexIdx++] = this.nodePositions[j * 3 + 2];
          }
        }
      }

      this.nodeMesh.instanceMatrix.needsUpdate = true;

      // Zero out unused line vertices
      for (let k = lineVertexIdx; k < lineArray.length; k++) {
        lineArray[k] = 0;
      }
      linePosAttr.needsUpdate = true;

      // 8. Atmospheric Data Particles Drift (upward stream)
      const particlePosAttr = this.particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
      const pArray = particlePosAttr.array as Float32Array;
      const pSpeed = delta * 1.6 * this.currentSpeedMultiplier;

      for (let p = 0; p < this.particleCount; p++) {
        pArray[p * 3 + 1] += pSpeed * 0.75;
        if (pArray[p * 3 + 1] > 42) {
          pArray[p * 3 + 1] = -42;
        }
      }
      particlePosAttr.needsUpdate = true;

      // 9. State Pulse Material Response
      if (this.pulseEnergy > 0) {
        const lineMat = this.connectionLines.material as THREE.LineBasicMaterial;
        lineMat.color.lerpColors(new THREE.Color(0xDCC09B), this.pulseColor, this.pulseEnergy);
        lineMat.opacity = 0.22 + this.pulseEnergy * 0.45;

        const outerMat = this.coreOuterMesh.material as THREE.MeshBasicMaterial;
        outerMat.color.lerpColors(new THREE.Color(0xC5A46D), this.pulseColor, this.pulseEnergy);
        outerMat.opacity = 0.28 + this.pulseEnergy * 0.48;
      }

      this.renderer.render(this.scene, this.camera);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('mousemove', this.handleMouseMoveBound);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.disposables.forEach((item) => {
      try {
        item.dispose();
      } catch {
        // ignore
      }
    });

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
