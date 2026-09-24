import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Surround3DBackground:
 * Full-screen immersive 3D digital universe surrounding the entire website.
 * Features:
 * - Central 3D Digital World Globe with cobalt wireframe, inner dark core, and atmospheric depth.
 * - 1,800+ glowing digital data constellation nodes on the globe surface (cyan, gold, white).
 * - Signature golden metallic orbital ring and secondary cyan orbital ring inclined in 3D space.
 * - Floating geometric 3D polyhedra (wireframe icosahedrons and octahedrons) orbiting smoothly.
 * - 2,500+ ambient starry cosmic particles distributed throughout deep 3D space.
 * - Dynamic scroll parallax: As the user scrolls through the page, the 3D cosmos gently orbits and tracks.
 * - Soft transparent vignette so 3D elements remain completely visible across the entire user experience.
 */
export const Surround3DBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 3000);
      
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      camera.position.z = isMobile ? 380 : isTablet ? 340 : 310;
      camera.position.y = 0;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Main Group holding the 3D World Globe & Orbital Systems
      const worldGroup = new THREE.Group();
      scene.add(worldGroup);

      const globeRadius = isMobile ? 80 : 95;

      // 1. Digital Wireframe World Sphere
      const wireframeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb, // Cobalt electric blue
        wireframe: true,
        transparent: true,
        opacity: 0.32
      });
      const wireframeGlobe = new THREE.Mesh(wireframeGeo, wireframeMat);
      worldGroup.add(wireframeGlobe);

      // 2. Inner Core
      const coreGeo = new THREE.SphereGeometry(globeRadius * 0.96, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x030712,
        transparent: true,
        opacity: 0.88
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      worldGroup.add(coreMesh);

      // 3. Digital Data Nodes & Constellations on Globe
      const particleCount = isMobile ? 1000 : 1800;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorBlue = new THREE.Color(0x38bdf8); // Cyan
      const colorGold = new THREE.Color(0xf59e0b); // Gold
      const colorWhite = new THREE.Color(0xffffff);

      for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        const r = globeRadius + (Math.random() * 5 - 2.5);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const rand = Math.random();
        const col = rand < 0.6 ? colorBlue : rand < 0.88 ? colorGold : colorWhite;
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: isMobile ? 2.2 : 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      worldGroup.add(particleSystem);

      // 4. Primary Golden Metallic Orbital Ring
      const ringGroup1 = new THREE.Group();
      ringGroup1.rotation.x = Math.PI / 3;
      ringGroup1.rotation.y = -Math.PI / 6;

      const ringRadius1 = globeRadius * 1.55;
      const ringGeo1 = new THREE.TorusGeometry(ringRadius1, 0.9, 16, 120);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.9
      });
      const orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
      ringGroup1.add(orbitRing1);
      worldGroup.add(ringGroup1);

      // 5. Secondary Cyan Orbital Ring
      const ringGroup2 = new THREE.Group();
      ringGroup2.rotation.x = -Math.PI / 3.6;
      ringGroup2.rotation.z = Math.PI / 4;

      const ringRadius2 = globeRadius * 1.85;
      const ringGeo2 = new THREE.TorusGeometry(ringRadius2, 0.7, 16, 120);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65
      });
      const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
      ringGroup2.add(orbitRing2);
      worldGroup.add(ringGroup2);

      // 6. Floating 3D Geometric Polyhedra (Deep Space Crystals)
      const crystalsGroup = new THREE.Group();
      scene.add(crystalsGroup);

      const crystalGeo1 = new THREE.IcosahedronGeometry(12, 0);
      const crystalMat1 = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const crystal1 = new THREE.Mesh(crystalGeo1, crystalMat1);
      crystal1.position.set(-180, 80, -90);
      crystalsGroup.add(crystal1);

      const crystalGeo2 = new THREE.OctahedronGeometry(10, 0);
      const crystalMat2 = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const crystal2 = new THREE.Mesh(crystalGeo2, crystalMat2);
      crystal2.position.set(190, -70, -110);
      crystalsGroup.add(crystal2);

      const crystalGeo3 = new THREE.DodecahedronGeometry(8, 0);
      const crystalMat3 = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const crystal3 = new THREE.Mesh(crystalGeo3, crystalMat3);
      crystal3.position.set(140, 130, -140);
      crystalsGroup.add(crystal3);

      // 7. Orbiting Golden Flight Beacon
      const beaconGeo = new THREE.ConeGeometry(4, 11, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      scene.add(beacon);

      const beaconGlowGeo = new THREE.SphereGeometry(3.5, 16, 16);
      const beaconGlowMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.85
      });
      const beaconGlow = new THREE.Mesh(beaconGlowGeo, beaconGlowMat);
      scene.add(beaconGlow);

      // 8. 2,500+ Ambient Deep Space Stars
      const starCount = isMobile ? 1200 : 2500;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 2200;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1400;

        const starRand = Math.random();
        const sCol = starRand < 0.6 ? colorBlue : starRand < 0.85 ? colorGold : colorWhite;
        starColors[i * 3] = sCol.r;
        starColors[i * 3 + 1] = sCol.g;
        starColors[i * 3 + 2] = sCol.b;
      }

      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // Mouse, Touch & Scroll Controls
      let mouseX = 0;
      let mouseY = 0;
      let scrollY = window.scrollY;

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX = x * 0.35;
        mouseY = y * 0.25;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const x = (touch.clientX / window.innerWidth) * 2 - 1;
          const y = (touch.clientY / window.innerHeight) * 2 - 1;
          mouseX = x * 0.25;
          mouseY = y * 0.2;
        }
      };

      const handleScroll = () => {
        scrollY = window.scrollY;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;

        const mobile = w < 640;
        const tablet = w >= 640 && w < 1024;
        camera.position.z = mobile ? 380 : tablet ? 340 : 310;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop
      let angle = 0;
      let targetRotY = 0;
      const rotSpeed = 0.003;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        targetRotY += rotSpeed;
        angle += 0.016;

        // Smooth scroll normalization
        const scrollFactor = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight || 2500), 1);
        const scrollRotation = scrollFactor * Math.PI;

        // Rotate the 3D World Globe with scroll responsiveness
        worldGroup.rotation.y = targetRotY + mouseX * 0.4 + scrollRotation;
        worldGroup.rotation.x = mouseY * 0.25 + scrollFactor * 0.3;
        worldGroup.position.y = -scrollFactor * 40;

        // Smoothly rotate deep space crystals
        crystal1.rotation.x += 0.008;
        crystal1.rotation.y += 0.012;
        crystal2.rotation.y -= 0.01;
        crystal2.rotation.z += 0.007;
        crystal3.rotation.x += 0.005;
        crystal3.rotation.z -= 0.009;

        // Counter-rotate orbital rings smoothly
        ringGroup1.rotation.z += 0.003;
        ringGroup2.rotation.y -= 0.0025;

        // Orbit beacon position
        const orbitRadius = globeRadius * 1.55;
        const bx = Math.cos(angle) * orbitRadius;
        const by = Math.sin(angle) * (globeRadius * 0.95);
        const bz = Math.sin(angle * 0.8) * 15;

        const v = new THREE.Vector3(bx, by, bz);
        v.applyEuler(ringGroup1.rotation);
        
        beacon.position.copy(v);
        beaconGlow.position.copy(v);
        beacon.rotation.z = angle + Math.PI / 2;

        // Starfield ambient drift
        starField.rotation.y += 0.0004;

        renderer?.render(scene!, camera!);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('WebGL initialization fallback for 3D background:', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="surround-3d-background-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Soft radial vignette so 3D background remains visible everywhere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.3)_65%,rgba(3,7,18,0.65)_100%)] pointer-events-none"></div>
    </div>
  );
};
