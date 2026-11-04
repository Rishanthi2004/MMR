import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Phone, ArrowRight, Wrench, Shield, CheckCircle2, Award, Sparkles, Eye, Palette } from 'lucide-react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createVehicleModel, CarAssembly } from './three/CarModel';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carAssemblyRef = useRef<CarAssembly | null>(null);
  const headlightsRef = useRef<{ spotL: THREE.SpotLight; spotR: THREE.SpotLight } | null>(null);
  const orangeRingRef = useRef<THREE.Mesh | null>(null);

  // Interactive UI State
  const [activeColor, setActiveColor] = useState('pearl-white');
  const [headlightsActive, setHeadlightsActive] = useState(true);
  const [scrollStageText, setScrollStageText] = useState('01 Exterior Reveal');

  // Paint Color Swatches
  const paintColors: { [key: string]: { hex: number; name: string } } = {
    'pearl-white': { hex: 0xf8fafc, name: 'Pearl Metallic White' },
    'daytona-orange': { hex: 0xf97316, name: 'MMR Performance Orange' },
    'liquid-silver': { hex: 0x94a3b8, name: 'Liquid Titanium Silver' },
    'carbon-black': { hex: 0x0f172a, name: 'Midnight Carbon Metallic' },
  };

  const handleColorChange = (key: string) => {
    setActiveColor(key);
    if (carAssemblyRef.current?.carPaintMaterial && paintColors[key]) {
      const c = new THREE.Color(paintColors[key].hex);
      carAssemblyRef.current.carPaintMaterial.color.copy(c);
    }
  };

  const toggleHeadlights = () => {
    const nextState = !headlightsActive;
    setHeadlightsActive(nextState);
    if (headlightsRef.current) {
      headlightsRef.current.spotL.intensity = nextState ? 12 : 0;
      headlightsRef.current.spotR.intensity = nextState ? 12 : 0;
    }
  };

  // ----------------------------------------------------
  // Scroll Progress Calculation (Low & Smooth Sensitivity)
  // ----------------------------------------------------
  const scrollProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
    if (totalScrollable <= 0) {
      scrollProgressRef.current = 0;
      return;
    }
    const currentScrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScrolled / totalScrollable));
    scrollProgressRef.current = progress;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ----------------------------------------------------
  // Three.js Scene Setup & Animation Loop
  // ----------------------------------------------------
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc); // Clean automotive studio white-grey

    const isMobile = width < 768;
    const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 36, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Position camera for a cinematic, spacious studio angle
    camera.position.set(isMobile ? 0 : 0.4, 1.35, 6.4);
    camera.lookAt(isMobile ? 0 : 0.85, 0.45, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // 3. Realistic HDR Studio Environment via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    scene.environment = envTexture;

    // 4. Studio Lighting Rig
    // Soft studio ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Main studio key light
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainLight.position.set(4, 7, 5);
    scene.add(mainLight);

    // Overhead studio softbox
    const overheadLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    overheadLight.position.set(-3, 8, -2);
    scene.add(overheadLight);

    // Subtle MMR orange floor rim accent
    const orangeRimLight = new THREE.DirectionalLight(0xf97316, 0.8);
    orangeRimLight.position.set(5, 1, -4);
    scene.add(orangeRimLight);

    // Xenon headlights
    const spotL = new THREE.SpotLight(0xffffff, 12, 12, Math.PI / 6, 0.4);
    spotL.position.set(-0.65, 0.58, 2.05);
    const spotR = new THREE.SpotLight(0xffffff, 12, 12, Math.PI / 6, 0.4);
    spotR.position.set(0.65, 0.58, 2.05);
    scene.add(spotL);
    scene.add(spotR);
    headlightsRef.current = { spotL, spotR };

    // 5. Studio Floor Grid & Orange Accent Ring
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.65,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Orange Halo Ring on the floor around the vehicle
    const ringGeo = new THREE.RingGeometry(2.2, 2.24, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const orangeRing = new THREE.Mesh(ringGeo, ringMat);
    orangeRing.rotation.x = -Math.PI / 2;
    orangeRing.position.set(isMobile ? 0 : 0.85, 0.005, 0);
    scene.add(orangeRing);
    orangeRingRef.current = orangeRing;

    // 6. Build & Add the 3D Car Model
    const carAssembly = createVehicleModel();
    carAssemblyRef.current = carAssembly;
    carAssembly.carGroup.position.set(isMobile ? 0 : 0.85, 0, 0);
    scene.add(carAssembly.carGroup);

    spotL.target = carAssembly.spotlightTarget;
    spotR.target = carAssembly.spotlightTarget;

    // 7. Interactive Drag to Rotate
    let isDragging = false;
    let prevMouseX = 0;
    let userRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      userRotationY += deltaX * 0.006;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Low & smooth scroll lerp
      const targetProgress = scrollProgressRef.current;
      smoothedProgressRef.current += (targetProgress - smoothedProgressRef.current) * 0.05;
      const p = smoothedProgressRef.current;

      // 5 Stages of 3D Automotive Experience
      const wheelExplode = 0; // Tires stay firmly mounted on the vehicle at all times
      let engineExplode = 0;
      let bonnetOpen = 0;
      let targetRotY = -0.55 + userRotationY;
      let targetCamY = 1.35;
      let targetCamZ = 6.4;
      let targetCamX = isMobile ? 0 : 0.4;
      let stageText = '01 Exterior Reveal';

      if (p < 0.22) {
        // Stage 1: Exterior 3/4 Reveal
        const localP = p / 0.22;
        targetRotY = -0.7 + localP * 0.35 + userRotationY;
        stageText = '01 Exterior Reveal';
      } else if (p < 0.45) {
        // Stage 2: Alloy Wheels & Side Profile (Tires firmly attached, no floating tires)
        const localP = (p - 0.22) / 0.23;
        targetRotY = -0.35 + localP * 0.45 + userRotationY;
        targetCamY = 1.15;
        targetCamZ = 5.8;
        stageText = '02 Aerodynamic Alloy Profile';
      } else if (p < 0.70) {
        // Stage 3: Engine Bay & Bonnet Lift
        const localP = (p - 0.45) / 0.25;
        bonnetOpen = Math.min(1, localP * 1.2);
        engineExplode = Math.min(1, Math.max(0, (localP - 0.2) * 1.25));
        targetRotY = 0.1 + localP * 0.3 + userRotationY;
        targetCamY = 1.55;
        targetCamZ = 5.5;
        stageText = '03 Twin-Turbo Engine Bay';
      } else if (p < 0.88) {
        // Stage 4: Precision Reassembly
        const localP = (p - 0.70) / 0.18;
        bonnetOpen = Math.max(0, 1 - localP);
        engineExplode = Math.max(0, 1 - localP);
        targetRotY = 0.4 + localP * 0.6 + userRotationY;
        stageText = '04 Precision Reassembly';
      } else {
        // Stage 5: Showroom Finale
        const localP = (p - 0.88) / 0.12;
        targetRotY = 1.0 + localP * 0.5 + userRotationY;
        targetCamY = 1.35;
        targetCamZ = 6.4;
        stageText = '05 Showroom Display';
      }

      setScrollStageText(stageText);

      // Update vehicle parts (wheels remain firmly fixed on the chassis)
      carAssembly.updateExplodedView(wheelExplode, engineExplode, bonnetOpen);

      // Smooth vehicle rotation
      carAssembly.carGroup.rotation.y = THREE.MathUtils.lerp(
        carAssembly.carGroup.rotation.y,
        targetRotY,
        0.08
      );

      // Vehicle firmly resting on the showroom floor
      carAssembly.carGroup.position.y = 0;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05);
      camera.lookAt(isMobile ? 0 : 0.85, 0.45, 0);

      if (orangeRingRef.current) {
        orangeRingRef.current.rotation.z += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

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

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      pmremGenerator.dispose();
      envTexture.dispose();
      carAssembly.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-slate-50"
      style={{ height: '260vh' }}
    >
      {/* Sticky Fullscreen 3D Viewport */}
      <section
        id="hero"
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-50"
      >
        {/* Three.js Canvas Mount */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        />

        {/* Ambient Top & Bottom Lighting Sheens */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/90 via-white/40 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none z-10" />

        {/* Hero Section Foreground UI Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-between py-8 sm:py-12 pointer-events-none">
          
          {/* Main Grid: Left Column Copy & CTAs, Right Column Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
            
            {/* LEFT COLUMN: HERO CONTENT */}
            <div className="lg:col-span-5 flex flex-col justify-center pointer-events-auto">
              
              {/* Croydon Automotive Specialists Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-neutral-200/80 shadow-xs mb-5 w-fit">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-800 tracking-wide uppercase">
                  Croydon Automotive Specialists
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-xs text-neutral-500 font-medium">UK Registered</span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-neutral-950 leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                Your Trusted Partner for{' '}
                <span className="relative inline-block text-neutral-950">
                  Vehicle Care
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-orange-500 rounded-full" />
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-lg">
                Vehicle maintenance, repair services and used car sales from{' '}
                <strong className="text-neutral-900 font-semibold">MMR MOTORS LTD</strong>.
                Delivering dealership-grade precision with independent dedication in Croydon.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <a
                  href="tel:+447735508394"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-orange-500/35"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us Now</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </a>

                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-900 font-semibold text-sm rounded-xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all duration-200"
                >
                  <Wrench className="w-4 h-4 text-orange-500" />
                  <span>Explore Our Services</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-9 pt-7 border-t border-neutral-200/70 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-neutral-700">Certified Techs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-neutral-700">OEM Parts Only</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <Award className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-neutral-700">Full Warranty</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE CONTROLS & 3D STATUS */}
            <div className="lg:col-span-7 flex flex-col justify-end items-end pointer-events-auto">
              <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-lg shadow-neutral-900/5 mt-auto">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      3D Inspection
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
                      {scrollStageText}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Eye className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Drag to rotate 360°</span>
                  </div>
                </div>

                {/* Paint Color Swatches & Headlights */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-xs font-medium text-neutral-700">Paint:</span>
                    <span className="text-xs font-bold text-neutral-900">
                      {paintColors[activeColor]?.name.split(' ')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {Object.keys(paintColors).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleColorChange(key)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          activeColor === key
                            ? 'border-orange-500 scale-110 shadow-sm'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: `#${paintColors[key].hex.toString(16).padStart(6, '0')}`,
                        }}
                        title={paintColors[key].name}
                      />
                    ))}
                  </div>

                  {/* Headlights Toggle */}
                  <button
                    type="button"
                    onClick={toggleHeadlights}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      headlightsActive
                        ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {headlightsActive ? 'Lights ON' : 'Lights OFF'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
