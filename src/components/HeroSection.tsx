import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Phone, ArrowRight, Wrench, Shield, ChevronDown, Check, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createVehicleModel, CarAssembly } from './three/CarModel';

interface HeroSectionProps {
  heroCarSrc?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [activeStage, setActiveStage] = useState(1);
  const [isLightSweepDone, setIsLightSweepDone] = useState(false);

  // References for mutable animation state outside React render cycle
  const animStateRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
    cameraPos: new THREE.Vector3(0.5, 1.1, 5.0),
    cameraLookAt: new THREE.Vector3(0, 0.5, 0),
    wheelExplode: 0,
    engineExplode: 0,
    bonnetOpen: 0,
    carRotY: 0.15,
    spotlightX: 0,
    spotlightZ: 0,
    lightSweep: 0,
  });

  // Track user scroll progress within the long hero container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      animStateRef.current.targetProgress = progress;

      // Determine active stage
      if (progress < 0.22) {
        setActiveStage(1);
      } else if (progress < 0.46) {
        setActiveStage(2);
      } else if (progress < 0.7) {
        setActiveStage(3);
      } else if (progress < 0.88) {
        setActiveStage(4);
      } else {
        setActiveStage(5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ----------------------------------------------------
  // Three.js Scene Setup & Render Loop
  // ----------------------------------------------------
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Clean automotive studio white-grey
    scene.fog = new THREE.Fog(0xf8fafc, 8, 22);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0.5, 1.1, 5.0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    // 3. Studio Environment Reflections (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig
    // Cool/Warm Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.85);
    scene.add(hemiLight);

    // Overhead Studio Softbox Key Light
    const keyLight = new THREE.DirectionalLight(0xfffbf5, 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Subtle Warm Orange Accent Rim Light
    const orangeRimLight = new THREE.DirectionalLight(0xf97316, 1.4);
    orangeRimLight.position.set(-5, 3.5, -4);
    scene.add(orangeRimLight);

    // Moving Studio Floor Spotlight (for opening sweep)
    const floorSpotlight = new THREE.SpotLight(0xffffff, 3.5, 15, Math.PI / 6, 0.5, 1.2);
    floorSpotlight.position.set(-4, 6, 4);
    scene.add(floorSpotlight);

    // 5. Studio Floor Plane
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.08,
      envMapIntensity: 0.6,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // Circular Orange Light Ring on Floor
    const ringGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(0, 0.012, 0);
    scene.add(ringMesh);

    // 6. Build 3D Car Model
    const carAssembly: CarAssembly = createVehicleModel();
    scene.add(carAssembly.carGroup);
    floorSpotlight.target = carAssembly.spotlightTarget;

    // Opening cinematic sweep timer
    const sweepTimer = setTimeout(() => {
      setIsLightSweepDone(true);
    }, 1200);

    // 7. Render Loop with Smooth Damped Camera & Kinematics
    let frameId = 0;
    let clock = new THREE.Clock();

    const renderTick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = animStateRef.current;

      // Smooth gentle progress damping for calm, relaxed scrolling
      state.currentProgress = THREE.MathUtils.damp(
        state.currentProgress,
        state.targetProgress,
        3.2,
        delta
      );
      const p = state.currentProgress;

      // Calculate camera trajectory and 3D targets based on scroll progress
      let targetCamX = 0.5;
      let targetCamY = 1.1;
      let targetCamZ = 5.0;
      let lookX = 0;
      let lookY = 0.5;
      let lookZ = 0;

      let targetWheelExplode = 0;
      let targetEngineExplode = 0;
      let targetBonnetOpen = 0;
      let targetCarRotY = 0.15;

      if (p < 0.22) {
        // Stage 1: Opening to Exterior Reveal
        // Camera moves from low front angle to 3/4 view; car rotates smoothly
        const t = p / 0.22;
        targetCamX = THREE.MathUtils.lerp(0.5, 3.2, t);
        targetCamY = THREE.MathUtils.lerp(1.1, 1.45, t);
        targetCamZ = THREE.MathUtils.lerp(5.0, 4.0, t);
        lookX = THREE.MathUtils.lerp(0, 0.2, t);
        lookY = THREE.MathUtils.lerp(0.5, 0.6, t);
        lookZ = THREE.MathUtils.lerp(0, 0.4, t);
        targetCarRotY = THREE.MathUtils.lerp(0.15, 0.45, t);

        // Spotlight sweep moves across
        state.spotlightX = THREE.MathUtils.lerp(-4, 3, t);
        state.spotlightZ = THREE.MathUtils.lerp(4, 2, t);
      } else if (p < 0.46) {
        // Stage 2: Vehicle Engineering (Wheel Exploded View)
        // Camera zooms into front-right wheel; wheel separates outward
        const t = (p - 0.22) / 0.24;
        targetCamX = THREE.MathUtils.lerp(3.2, 2.15, t);
        targetCamY = THREE.MathUtils.lerp(1.45, 0.65, t);
        targetCamZ = THREE.MathUtils.lerp(4.0, 2.1, t);
        lookX = THREE.MathUtils.lerp(0.2, 1.05, t);
        lookY = THREE.MathUtils.lerp(0.6, 0.38, t);
        lookZ = THREE.MathUtils.lerp(0.4, 1.35, t);
        targetCarRotY = THREE.MathUtils.lerp(0.45, 0.2, t);

        targetWheelExplode = THREE.MathUtils.smoothstep(t, 0.1, 0.95);
        targetEngineExplode = 0;
        targetBonnetOpen = 0;
      } else if (p < 0.7) {
        // Stage 3: Engine Reveal
        // Wheel returns; camera ascends over bonnet; bonnet opens in 3D; engine parts separate
        const t = (p - 0.46) / 0.24;
        targetCamX = THREE.MathUtils.lerp(2.15, 1.35, t);
        targetCamY = THREE.MathUtils.lerp(0.65, 2.15, t);
        targetCamZ = THREE.MathUtils.lerp(2.1, 2.5, t);
        lookX = THREE.MathUtils.lerp(1.05, 0.0, t);
        lookY = THREE.MathUtils.lerp(0.38, 0.65, t);
        lookZ = THREE.MathUtils.lerp(1.35, 1.25, t);
        targetCarRotY = THREE.MathUtils.lerp(0.2, 0.1, t);

        targetWheelExplode = THREE.MathUtils.lerp(1, 0, Math.min(1, t * 2.5));
        targetBonnetOpen = THREE.MathUtils.smoothstep(t, 0.15, 0.9);
        targetEngineExplode = THREE.MathUtils.smoothstep(t, 0.3, 0.95);
      } else if (p < 0.88) {
        // Stage 4: Reassembly
        // Engine parts reseat, bonnet closes flush, car reassembles completely
        const t = (p - 0.7) / 0.18;
        targetCamX = THREE.MathUtils.lerp(1.35, 3.2, t);
        targetCamY = THREE.MathUtils.lerp(2.15, 1.35, t);
        targetCamZ = THREE.MathUtils.lerp(2.5, -2.4, t);
        lookX = THREE.MathUtils.lerp(0.0, 0.1, t);
        lookY = THREE.MathUtils.lerp(0.65, 0.55, t);
        lookZ = THREE.MathUtils.lerp(1.25, 0.0, t);
        targetCarRotY = THREE.MathUtils.lerp(0.1, 0.7, t);

        targetWheelExplode = 0;
        targetBonnetOpen = THREE.MathUtils.lerp(1, 0, Math.min(1, t * 1.8));
        targetEngineExplode = THREE.MathUtils.lerp(1, 0, Math.min(1, t * 2.2));
      } else {
        // Stage 5: Final Cinematic View
        // Camera pulls backward smoothly to reveal the complete vehicle
        const t = (p - 0.88) / 0.12;
        targetCamX = THREE.MathUtils.lerp(3.2, 3.8, t);
        targetCamY = THREE.MathUtils.lerp(1.35, 1.55, t);
        targetCamZ = THREE.MathUtils.lerp(-2.4, 3.6, t);
        lookX = THREE.MathUtils.lerp(0.1, 0.0, t);
        lookY = THREE.MathUtils.lerp(0.55, 0.55, t);
        lookZ = THREE.MathUtils.lerp(0.0, 0.0, t);
        targetCarRotY = THREE.MathUtils.lerp(0.7, 0.45, t);

        targetWheelExplode = 0;
        targetEngineExplode = 0;
        targetBonnetOpen = 0;
      }

      // Smoothly interpolate camera position & orientation
      state.cameraPos.x = THREE.MathUtils.damp(state.cameraPos.x, targetCamX, 3.2, delta);
      state.cameraPos.y = THREE.MathUtils.damp(state.cameraPos.y, targetCamY, 3.2, delta);
      state.cameraPos.z = THREE.MathUtils.damp(state.cameraPos.z, targetCamZ, 3.2, delta);

      state.cameraLookAt.x = THREE.MathUtils.damp(state.cameraLookAt.x, lookX, 3.2, delta);
      state.cameraLookAt.y = THREE.MathUtils.damp(state.cameraLookAt.y, lookY, 3.2, delta);
      state.cameraLookAt.z = THREE.MathUtils.damp(state.cameraLookAt.z, lookZ, 3.2, delta);

      camera.position.copy(state.cameraPos);
      camera.lookAt(state.cameraLookAt);

      // Smoothly interpolate model rotation & exploded transformation
      state.carRotY = THREE.MathUtils.damp(state.carRotY, targetCarRotY, 3.2, delta);
      carAssembly.carGroup.rotation.y = state.carRotY;

      state.wheelExplode = THREE.MathUtils.damp(state.wheelExplode, targetWheelExplode, 3.6, delta);
      state.engineExplode = THREE.MathUtils.damp(state.engineExplode, targetEngineExplode, 3.6, delta);
      state.bonnetOpen = THREE.MathUtils.damp(state.bonnetOpen, targetBonnetOpen, 3.6, delta);

      carAssembly.updateExplodedView(state.wheelExplode, state.engineExplode, state.bonnetOpen);

      // Spotlight target follows car
      floorSpotlight.position.x = state.spotlightX;
      floorSpotlight.position.z = state.spotlightZ;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(renderTick);
    };

    renderTick();

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(sweepTimer);
      carAssembly.dispose();
      renderer.dispose();
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    // Generous 540vh container providing calm, gradual, and slow scroll travel
    <section ref={containerRef} id="hero" className="relative h-[540vh] bg-neutral-50">
      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* ================= THREE.JS 3D CANVAS MOUNT ================= */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        />

        {/* ================= EDITORIAL STAGE OVERLAYS (Framer Motion) ================= */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pointer-events-none">
          {/* STAGE 1: Opening / Exterior Reveal */}
          <AnimatePresence mode="wait">
            {activeStage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl pointer-events-auto"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold tracking-wider text-orange-600 uppercase">
                    Croydon, United Kingdom
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-xs font-medium text-neutral-500">
                    Interactive 3D Showcase
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 leading-[1.12]"
                  style={{ textWrap: 'balance' }}
                >
                  Your Trusted Partner for{' '}
                  <span className="relative inline-block text-neutral-950">
                    Vehicle Care
                    <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-orange-500 rounded-full" />
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed">
                  Vehicle maintenance, repair services and used car sales from MMR MOTORS LTD.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="tel:+447735508394"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Us Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/90 backdrop-blur-md hover:bg-white text-neutral-800 font-semibold text-sm rounded-xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all duration-200"
                  >
                    <Wrench className="w-4 h-4 text-orange-500" />
                    <span>Explore Our Services</span>
                  </a>
                </div>

                {/* Subtle Scroll Hint */}
                <div className="mt-8 flex items-center gap-2 text-xs font-medium text-neutral-400">
                  <ChevronDown className="w-4 h-4 text-orange-500 animate-bounce" />
                  <span>Scroll down to inspect internal engineering & 3D transformation</span>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: Wheel & Brake Engineering Exploded View */}
            {activeStage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md pointer-events-auto"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Stage 02 · Wheel & Brake Assembly</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
                  Precision in Every Detail
                </h2>

                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  Controlled 3D exploded view revealing the high-performance alloy rim, ventilated
                  floating brake rotor, and 4-piston caliper inspected during scheduled maintenance.
                </p>

                {/* Floating Component HUD Labels */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>20-Inch Diamond-Cut Alloy Rim</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Ventilated Cross-Drilled Rotor Disc</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>MMR Performance 4-Piston Caliper</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: Engine Bay & Powertrain Reveal */}
            {activeStage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md pointer-events-auto"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold mb-3">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Stage 03 · Powertrain & Engine Bay</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
                  Built Around Better Vehicle Care
                </h2>

                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  The bonnet lifts to reveal the twin-scroll turbocharger, intake plenum runners, and
                  cylinder head assembly with orange diagnostic service highlights.
                </p>

                {/* Engine Component HUD Labels */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span>Twin-Scroll Turbocharger System</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span>Precision Intake Plenum Runners</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span>Anodized Camshaft Valve Covers</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: Reassembly & Alignment */}
            {activeStage === 4 && (
              <motion.div
                key="stage4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md pointer-events-auto"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold mb-3">
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                  <span>Stage 04 · Complete Reassembly</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
                  Precision Engineering Restored
                </h2>

                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  Bonnet closes flush, wheel and braking assemblies lock back into the chassis,
                  restoring complete exterior aerodynamic harmony.
                </p>
              </motion.div>
            )}

            {/* STAGE 5: Final Cinematic View */}
            {activeStage === 5 && (
              <motion.div
                key="stage5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-lg pointer-events-auto"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold mb-3">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Stage 05 · Complete Vehicle Showcase</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
                  Ready for Your Next Drive?
                </h2>

                <p className="mt-4 text-base text-neutral-600 leading-relaxed">
                  Visit our Croydon workshop for dependable vehicle maintenance, thorough repairs, or
                  explore our curated used car sales inventory.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm rounded-xl border border-neutral-200 shadow-xs transition-all duration-200"
                  >
                    <span>Explore Our Services</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
