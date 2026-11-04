import * as THREE from 'three';

export interface CarAssembly {
  carGroup: THREE.Group;
  bonnetGroup: THREE.Group;
  wheelFrontRight: THREE.Group;
  wheelTireFrontRight: THREE.Group;
  brakeDiscFrontRight: THREE.Group;
  caliperFrontRight: THREE.Group;
  engineGroup: THREE.Group;
  enginePlenum: THREE.Group;
  engineTurbo: THREE.Group;
  engineCover: THREE.Mesh;
  bodyMesh: THREE.Group;
  spotlightTarget: THREE.Object3D;
  hoodStruts: THREE.Group;
  carPaintMaterial: THREE.MeshPhysicalMaterial;
  updateExplodedView: (wheelExplode: number, engineExplode: number, bonnetOpen: number) => void;
  dispose: () => void;
}

/**
 * Creates a photorealistic, life-sized luxury executive sports vehicle with
 * realistic automotive proportions, sculpted body panels, precision multi-part wheels,
 * ventilated brake discs with monobloc calipers, articulated bonnet with gas struts,
 * and detailed twin-turbo powertrain.
 *
 * Size is calibrated ~18% smaller than previous for optimal viewport framing without cropping.
 */
export function createVehicleModel(): CarAssembly {
  const carGroup = new THREE.Group();
  carGroup.name = 'LuxuryAutomobile';

  // 18% smaller scale as requested, perfectly proportioned
  const MODEL_SCALE = 0.82;
  carGroup.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);

  // ----------------------------------------------------
  // Premium Automotive Materials (PBR)
  // ----------------------------------------------------
  // Multi-coat Pearlescent Metallic Paint
  const carPaintMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc, // Pure pearl metallic white
    metalness: 0.9,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 1.0,
    envMapIntensity: 2.2,
  });

  // Satin Carbon Fiber / Structural Undertray
  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x18202c,
    metalness: 0.45,
    roughness: 0.42,
    envMapIntensity: 1.2,
  });

  // Mirror-Polished Chrome & Machined Alloy
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.98,
    roughness: 0.04,
    envMapIntensity: 2.5,
  });

  // Brushed Cast Steel / Titanium (Brake discs & mechanicals)
  const steelMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.88,
    roughness: 0.22,
    envMapIntensity: 1.6,
  });

  // High-Grade Tinted Automotive Glass (Windshield, Panoramic Roof, Windows)
  const automotiveGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x090d16,
    metalness: 0.92,
    roughness: 0.02,
    transmission: 0.68,
    transparent: true,
    opacity: 0.88,
    ior: 1.54,
    envMapIntensity: 2.5,
  });

  // Headlight Polycarbonate Clear Lens
  const headlightLensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.94,
    roughness: 0.02,
    transparent: true,
    opacity: 0.95,
    ior: 1.5,
    envMapIntensity: 2.0,
  });

  // Radiant Orange Performance Accent (MMR Caliper & Powertrain Accents)
  const orangeCaliperMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.22,
    metalness: 0.55,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.8,
  });

  // High-Performance Radial Rubber Tire Compound
  const tireRubberMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c212a,
    roughness: 0.82,
    metalness: 0.06,
  });

  // LED DRL / Headlight Emissive
  const drlEmissiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xff6a00,
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });

  // Crystal Tail Light Red Emissive
  const tailLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.8,
    roughness: 0.08,
  });

  // Interior Trim (Dashboard, Steering, Seats)
  const interiorLeatherMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.2,
  });

  // ----------------------------------------------------
  // 1. Sculpted Body Shell & Chassis Assembly
  // ----------------------------------------------------
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'SculptedBody';

  // Lower Floor Pan & Aerodynamic Undertray
  const undertrayGeo = new THREE.BoxGeometry(1.82, 0.12, 4.3);
  const undertrayMesh = new THREE.Mesh(undertrayGeo, carbonMaterial);
  undertrayMesh.position.set(0, 0.22, 0);
  undertrayMesh.receiveShadow = true;
  bodyGroup.add(undertrayMesh);

  // Sculpted Lower Body Profile (Tapered side rocker panels with concavity)
  const lowerBodyShape = new THREE.BoxGeometry(1.88, 0.44, 4.35, 6, 4, 12);
  const lPos = lowerBodyShape.attributes.position;
  for (let i = 0; i < lPos.count; i++) {
    const x = lPos.getX(i);
    const y = lPos.getY(i);
    const z = lPos.getZ(i);

    // Front nose tumblehome & aerodynamic rake
    if (z > 1.2) {
      const taper = 1.0 - (z - 1.2) * 0.14;
      lPos.setX(i, x * taper);
      if (y > 0) lPos.setY(i, y * 0.86);
    }
    // Rear decklid taper
    if (z < -1.2) {
      const taper = 1.0 - (-1.2 - z) * 0.12;
      lPos.setX(i, x * taper);
    }
    // Waist concavity (sculpted door tuck-in)
    if (Math.abs(z) < 1.0 && y > -0.1) {
      const waistFactor = Math.abs(x) > 0.8 ? 0.96 : 1.0;
      lPos.setX(i, x * waistFactor);
    }
  }
  lowerBodyShape.computeVertexNormals();

  const mainBodyMesh = new THREE.Mesh(lowerBodyShape, carPaintMaterial);
  mainBodyMesh.position.set(0, 0.42, 0);
  mainBodyMesh.castShadow = true;
  mainBodyMesh.receiveShadow = true;
  bodyGroup.add(mainBodyMesh);

  // Wheel Arch Fender Flares (Front and Rear Curves)
  const archPositions = [
    { x: 0.94, z: 1.35, rotY: 0 },
    { x: -0.94, z: 1.35, rotY: Math.PI },
    { x: 0.94, z: -1.35, rotY: 0 },
    { x: -0.94, z: -1.35, rotY: Math.PI },
  ];
  archPositions.forEach((pos) => {
    const archGeo = new THREE.TorusGeometry(0.42, 0.045, 12, 24, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, carPaintMaterial);
    archMesh.position.set(pos.x > 0 ? 0.92 : -0.92, 0.36, pos.z);
    archMesh.rotation.set(0, pos.rotY, Math.PI / 2);
    bodyGroup.add(archMesh);
  });

  // Greenhouse Glass Canopy & Windshield Pillar Structure
  const greenhouseGeo = new THREE.BoxGeometry(1.5, 0.52, 2.38, 4, 3, 6);
  const gPos = greenhouseGeo.attributes.position;
  for (let i = 0; i < gPos.count; i++) {
    const y = gPos.getY(i);
    const z = gPos.getZ(i);
    // Taper inward towards roof for sleek sports sedan tumblehome
    if (y > 0) {
      gPos.setX(i, gPos.getX(i) * 0.8);
      // Windshield rake
      if (z > 0.3) gPos.setZ(i, z * 0.84);
      // Rear fastback rake
      if (z < -0.3) gPos.setZ(i, z * 0.88);
    }
  }
  greenhouseGeo.computeVertexNormals();

  const greenhouseMesh = new THREE.Mesh(greenhouseGeo, automotiveGlassMaterial);
  greenhouseMesh.position.set(0, 0.84, -0.16);
  greenhouseMesh.castShadow = true;
  bodyGroup.add(greenhouseMesh);

  // Sculpted High-Gloss Panoramic Roof Panel
  const roofGeo = new THREE.BoxGeometry(1.2, 0.035, 1.62);
  const roofMesh = new THREE.Mesh(roofGeo, carPaintMaterial);
  roofMesh.position.set(0, 1.1, -0.2);
  bodyGroup.add(roofMesh);

  // Windshield & Pillar Surround (A, B, C-Pillars in Gloss Black)
  const aPillarRight = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.75, 8), carbonMaterial);
  aPillarRight.position.set(0.68, 0.85, 0.45);
  aPillarRight.rotation.set(0.65, 0, -0.35);
  const aPillarLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.75, 8), carbonMaterial);
  aPillarLeft.position.set(-0.68, 0.85, 0.45);
  aPillarLeft.rotation.set(0.65, 0, 0.35);
  bodyGroup.add(aPillarRight, aPillarLeft);

  // Interior Cockpit Silhouette (Dashboard, Sport Steering Wheel, Front Bucket Seats)
  const dashGeo = new THREE.BoxGeometry(1.35, 0.16, 0.42);
  const dashMesh = new THREE.Mesh(dashGeo, interiorLeatherMaterial);
  dashMesh.position.set(0, 0.72, 0.38);
  bodyGroup.add(dashMesh);

  // Steering Wheel
  const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 20), chromeMaterial);
  steeringWheel.position.set(0.35, 0.78, 0.22);
  steeringWheel.rotation.x = 0.4;
  bodyGroup.add(steeringWheel);

  // Driver & Passenger Sport Seats with Headrests
  [-0.34, 0.34].forEach((seatX) => {
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.4), interiorLeatherMaterial);
    seatBase.position.set(seatX, 0.48, -0.1);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.1), interiorLeatherMaterial);
    seatBack.position.set(seatX, 0.72, -0.28);
    seatBack.rotation.x = -0.15;
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.08), interiorLeatherMaterial);
    headrest.position.set(seatX, 0.98, -0.32);
    bodyGroup.add(seatBase, seatBack, headrest);
  });

  // Front Fascia: Aggressive Multi-Tier Bumper & Carbon Splitter
  const frontBumperGeo = new THREE.BoxGeometry(1.82, 0.32, 0.55);
  const frontBumper = new THREE.Mesh(frontBumperGeo, carPaintMaterial);
  frontBumper.position.set(0, 0.34, 2.05);
  bodyGroup.add(frontBumper);

  const frontSplitterGeo = new THREE.BoxGeometry(1.86, 0.045, 0.5);
  const frontSplitter = new THREE.Mesh(frontSplitterGeo, carbonMaterial);
  frontSplitter.position.set(0, 0.18, 2.18);
  bodyGroup.add(frontSplitter);

  // Precision Honeycomb Air Intake Grille & Chrome Frame
  const grilleGeo = new THREE.BoxGeometry(1.12, 0.24, 0.05);
  const grilleMesh = new THREE.Mesh(grilleGeo, carbonMaterial);
  grilleMesh.position.set(0, 0.38, 2.29);
  const grilleFrameGeo = new THREE.BoxGeometry(1.18, 0.28, 0.03);
  const grilleFrame = new THREE.Mesh(grilleFrameGeo, chromeMaterial);
  grilleFrame.position.set(0, 0.38, 2.28);
  bodyGroup.add(grilleMesh, grilleFrame);

  // Twin Sculpted Headlight Modules with Internal Projector Lenses
  [-0.68, 0.68].forEach((hx, idx) => {
    const isRight = idx === 1;
    const hGroup = new THREE.Group();
    hGroup.position.set(hx, 0.5, 2.1);
    hGroup.rotation.y = isRight ? -0.18 : 0.18;

    // Outer Polycarbonate Lens Cover
    const lens = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.18), headlightLensMaterial);
    hGroup.add(lens);

    // Twin Bi-Xenon / LED Projector Spheres
    const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), chromeMaterial);
    p1.position.set(-0.08, 0, 0.04);
    const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), chromeMaterial);
    p2.position.set(0.08, 0, 0.04);
    hGroup.add(p1, p2);

    // Slim Orange DRL Eyebrow Blade
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.018, 0.04), drlEmissiveMaterial);
    drl.position.set(0, 0.045, 0.08);
    hGroup.add(drl);

    bodyGroup.add(hGroup);
  });

  // Aerodynamic Side Mirrors with Slender Stalks & Indicator Strips
  [-0.96, 0.96].forEach((mx, idx) => {
    const isRight = idx === 1;
    const mGroup = new THREE.Group();
    mGroup.position.set(mx, 0.75, 0.55);

    // Stalk
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.12, 8), carbonMaterial);
    stalk.rotation.z = isRight ? -0.5 : 0.5;
    mGroup.add(stalk);

    // Mirror Housing
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.14), carPaintMaterial);
    housing.position.set(isRight ? 0.08 : -0.08, 0.04, 0);
    mGroup.add(housing);

    // Reflective Mirror Glass
    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.08), chromeMaterial);
    mirrorGlass.position.set(isRight ? 0.08 : -0.08, 0.04, -0.075);
    mirrorGlass.rotation.y = Math.PI;
    mGroup.add(mirrorGlass);

    // Amber Turn Indicator Strip
    const blinker = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.015, 0.02), drlEmissiveMaterial);
    blinker.position.set(isRight ? 0.08 : -0.08, 0.04, 0.07);
    mGroup.add(blinker);

    bodyGroup.add(mGroup);
  });

  // Flush Chrome Exterior Door Handles
  [
    { x: 0.94, y: 0.58, z: 0.2 },
    { x: 0.94, y: 0.58, z: -0.6 },
    { x: -0.94, y: 0.58, z: 0.2 },
    { x: -0.94, y: 0.58, z: -0.6 },
  ].forEach((pos) => {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.03, 0.14), chromeMaterial);
    handle.position.set(pos.x, pos.y, pos.z);
    bodyGroup.add(handle);
  });

  // Rear Fascia: Continuous Edge-to-Edge Crystalline LED Tail Light Bar
  const tailLight = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.08), tailLightMaterial);
  tailLight.position.set(0, 0.6, -2.18);
  bodyGroup.add(tailLight);

  // Rear Diffuser with 4 Vertical Aerodynamic Strakes
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.16, 0.35), carbonMaterial);
  diffuser.position.set(0, 0.24, -2.12);
  // Strakes
  [-0.45, -0.15, 0.15, 0.45].forEach((sx) => {
    const strake = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.12, 0.25), carbonMaterial);
    strake.position.set(sx, 0.22, -2.14);
    bodyGroup.add(strake);
  });
  bodyGroup.add(diffuser);

  // Quad Polished Stainless Steel Exhaust Tips
  [-0.62, -0.5, 0.5, 0.62].forEach((ex) => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16), chromeMaterial);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(ex, 0.22, -2.25);
    bodyGroup.add(pipe);
  });

  carGroup.add(bodyGroup);

  // ----------------------------------------------------
  // 2. Articulated Sculpted Bonnet with Hydraulic Gas Struts
  // ----------------------------------------------------
  const bonnetGroup = new THREE.Group();
  bonnetGroup.position.set(0, 0.67, 0.55); // Pivot at cowl base
  bonnetGroup.name = 'ArticulatedBonnet';

  // Sculpted Hood Panel with Aerodynamic Creases
  const hoodShape = new THREE.BoxGeometry(1.64, 0.035, 1.58, 6, 2, 8);
  const hPos = hoodShape.attributes.position;
  for (let i = 0; i < hPos.count; i++) {
    const z = hPos.getZ(i);
    const x = hPos.getX(i);
    // Smooth frontal taper
    if (z > 0.2) {
      hPos.setX(i, x * (1.0 - (z - 0.2) * 0.12));
      hPos.setY(i, hPos.getY(i) - (z - 0.2) * 0.08);
    }
    // Center power bulge crease
    if (Math.abs(x) < 0.4 && z > -0.4 && z < 0.5) {
      hPos.setY(i, hPos.getY(i) + 0.02);
    }
  }
  hoodShape.computeVertexNormals();

  const hoodMesh = new THREE.Mesh(hoodShape, carPaintMaterial);
  hoodMesh.position.set(0, 0, 0.79);
  hoodMesh.castShadow = true;
  bonnetGroup.add(hoodMesh);

  // Inner Hood Composite Stiffening Liner & Soundproofing
  const hoodLiner = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.015, 1.4), carbonMaterial);
  hoodLiner.position.set(0, -0.02, 0.79);
  bonnetGroup.add(hoodLiner);

  // Dual Hydraulic Gas Struts (Pivot with hood)
  const hoodStruts = new THREE.Group();
  [-0.68, 0.68].forEach((sx) => {
    const strutCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), carbonMaterial);
    strutCylinder.position.set(sx, 0.15, 0.5);
    strutCylinder.rotation.x = -0.6;
    const chromeRod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.35, 8), chromeMaterial);
    chromeRod.position.set(sx, 0.22, 0.6);
    chromeRod.rotation.x = -0.6;
    hoodStruts.add(strutCylinder, chromeRod);
  });
  bonnetGroup.add(hoodStruts);

  carGroup.add(bonnetGroup);

  // ----------------------------------------------------
  // 3. Engine Bay & High-Performance V6 Twin-Turbo Powertrain
  // ----------------------------------------------------
  const engineGroup = new THREE.Group();
  engineGroup.position.set(0, 0.46, 1.25);
  engineGroup.name = 'PowertrainCompartment';

  // Bay Surrounding Enclosure & Inner Fenders
  const bayEnclosure = new THREE.Mesh(
    new THREE.BoxGeometry(1.62, 0.35, 1.45),
    new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.75 })
  );
  bayEnclosure.position.set(0, -0.15, 0);
  engineGroup.add(bayEnclosure);

  // Engine Cylinder Block (Cast Alloy)
  const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.34, 0.88), carbonMaterial);
  blockMesh.castShadow = true;
  engineGroup.add(blockMesh);

  // Twin Cam Valve Covers with Radiant MMR Orange Performance Striping
  const coverGroup = new THREE.Group();
  const coverMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.84), carbonMaterial);
  coverMesh.position.set(0, 0.19, 0);
  coverGroup.add(coverMesh);

  const orangeStripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.8), orangeCaliperMaterial);
  orangeStripe.position.set(0, 0.235, 0);
  coverGroup.add(orangeStripe);

  const engineCover = coverGroup as unknown as THREE.Mesh;
  engineGroup.add(engineCover);

  // Intake Plenum & Polished Aluminum Runners (Separates in Stage 3 Exploded View)
  const plenumGroup = new THREE.Group();
  const plenumBody = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.72, 16), chromeMaterial);
  plenumBody.rotation.z = Math.PI / 2;
  plenumBody.position.set(0.18, 0.28, -0.05);
  plenumGroup.add(plenumBody);

  // 4 Curved Polished Intake Runners
  for (let r = 0; r < 4; r++) {
    const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.22, 12), chromeMaterial);
    runner.position.set(-0.24 + r * 0.16, 0.22, 0.12);
    runner.rotation.x = 0.35;
    plenumGroup.add(runner);
  }
  const enginePlenum = plenumGroup;
  engineGroup.add(enginePlenum);

  // Twin-Scroll Turbocharger System & Downpipe
  const turboGroup = new THREE.Group();
  const turbineHousing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.045, 12, 24), steelMaterial);
  turbineHousing.rotation.y = Math.PI / 2;
  turboGroup.add(turbineHousing);

  const compressorScroll = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 16), chromeMaterial);
  compressorScroll.rotation.x = Math.PI / 2;
  compressorScroll.position.set(0.09, 0, 0);
  turboGroup.add(compressorScroll);

  const boostPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.38, 12), orangeCaliperMaterial);
  boostPipe.position.set(0.18, 0.12, 0);
  boostPipe.rotation.z = Math.PI / 4;
  turboGroup.add(boostPipe);

  turboGroup.position.set(-0.46, 0.12, 0.1);
  const engineTurbo = turboGroup;
  engineGroup.add(engineTurbo);

  // Tubular Strut Tower Brace Bar (Satin Black)
  const strutBrace = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.48, 12), carbonMaterial);
  strutBrace.rotation.z = Math.PI / 2;
  strutBrace.position.set(0, 0.32, -0.15);
  engineGroup.add(strutBrace);

  // Front Radiator Cooling Pack with Dual Electric Fans
  const radiator = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.32, 0.08), steelMaterial);
  radiator.position.set(0, 0.05, 0.65);
  engineGroup.add(radiator);

  carGroup.add(engineGroup);

  // ----------------------------------------------------
  // 4. Precision 3D Wheel, Rotor & Caliper Assemblies
  // ----------------------------------------------------
  function createPrecisionWheelAssembly(isRight: boolean) {
    const wheelGroup = new THREE.Group();

    // 1. Multi-Part Radial Low-Profile Rubber Tire
    const tireGroup = new THREE.Group();
    // Tire Main Tread Cylinder with Rounded Shoulders
    const tireGeo = new THREE.CylinderGeometry(0.355, 0.355, 0.245, 36);
    tireGeo.rotateZ(Math.PI / 2);
    const tireTread = new THREE.Mesh(tireGeo, tireRubberMaterial);
    tireTread.castShadow = true;
    tireGroup.add(tireTread);

    // Sculpted Outer Sidewall Rim Bevel Ring
    const sidewallRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 12, 32), tireRubberMaterial);
    sidewallRing.position.set(isRight ? 0.12 : -0.12, 0, 0);
    sidewallRing.rotation.y = Math.PI / 2;
    tireGroup.add(sidewallRing);

    // 2. 10-Spoke Machined Diamond-Cut Alloy Wheel
    const rimGroup = new THREE.Group();
    const rimBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 32), carbonMaterial);
    rimBarrel.rotateZ(Math.PI / 2);
    rimGroup.add(rimBarrel);

    // Outer Polished Alloy Lip
    const lipRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.016, 12, 32), chromeMaterial);
    lipRing.position.set(isRight ? 0.125 : -0.125, 0, 0);
    lipRing.rotation.y = Math.PI / 2;
    rimGroup.add(lipRing);

    // 10 Diamond-Cut Sculpted Spokes
    for (let s = 0; s < 10; s++) {
      const angle = (s * Math.PI * 2) / 10;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.26, 0.04), chromeMaterial);
      spoke.position.set(isRight ? 0.11 : -0.11, 0, 0);
      spoke.rotation.x = angle;
      rimGroup.add(spoke);
    }

    // Center Lock Hub & Lug Nuts
    const centerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.26, 16), orangeCaliperMaterial);
    centerHub.rotateZ(Math.PI / 2);
    rimGroup.add(centerHub);

    // 5 Lug Bolts
    for (let b = 0; b < 5; b++) {
      const bAngle = (b * Math.PI * 2) / 5;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.27, 8), chromeMaterial);
      bolt.rotateZ(Math.PI / 2);
      bolt.position.set(isRight ? 0.12 : -0.12, Math.cos(bAngle) * 0.04, Math.sin(bAngle) * 0.04);
      rimGroup.add(bolt);
    }

    // Combine Rim and Tire into separable sub-group
    const wheelTireGroup = new THREE.Group();
    wheelTireGroup.add(tireGroup, rimGroup);
    wheelGroup.add(wheelTireGroup);

    // 3. Ventilated Ceramic-Composite Brake Rotor (Cross-drilled)
    const discGroup = new THREE.Group();
    // Rotor Disc Friction Ring
    const rotorGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.032, 32);
    rotorGeo.rotateZ(Math.PI / 2);
    const rotorMesh = new THREE.Mesh(rotorGeo, steelMaterial);
    discGroup.add(rotorMesh);

    // Inner Aluminum Mounting Bell (Hat)
    const bellGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.042, 20);
    bellGeo.rotateZ(Math.PI / 2);
    const bellMesh = new THREE.Mesh(bellGeo, carbonMaterial);
    discGroup.add(bellMesh);

    discGroup.position.set(isRight ? -0.06 : 0.06, 0, 0);
    wheelGroup.add(discGroup);

    // 4. Performance 6-Piston Monobloc Brake Caliper (Vibrant Orange)
    const caliperGroup = new THREE.Group();
    const caliperBody = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.18, 0.13), orangeCaliperMaterial);
    caliperBody.castShadow = true;
    caliperGroup.add(caliperBody);

    // Twin Hydraulic Line / Hardware Accents
    const lineGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.15, 8);
    const line = new THREE.Mesh(lineGeo, steelMaterial);
    line.position.set(0, 0, 0.065);
    caliperGroup.add(line);

    caliperGroup.position.set(isRight ? -0.065 : 0.065, 0.14, 0.08);
    wheelGroup.add(caliperGroup);

    // 5. Suspension Strut & Steering Knuckle
    const strutGroup = new THREE.Group();
    const strutDamper = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.36, 12), carbonMaterial);
    strutDamper.position.set(isRight ? -0.16 : 0.16, 0.24, 0);
    strutDamper.rotation.z = isRight ? 0.15 : -0.15;
    strutGroup.add(strutDamper);

    // Orange Suspension Coil Spring
    const coilGeo = new THREE.TorusGeometry(0.045, 0.012, 8, 20);
    for (let c = 0; c < 4; c++) {
      const coil = new THREE.Mesh(coilGeo, orangeCaliperMaterial);
      coil.position.set(isRight ? -0.16 : 0.16, 0.16 + c * 0.05, 0);
      coil.rotation.x = Math.PI / 2;
      strutGroup.add(coil);
    }
    wheelGroup.add(strutGroup);

    return {
      wheelGroup,
      wheelTireGroup,
      discGroup,
      caliperGroup,
      strutGroup,
    };
  }

  // Position 4 Wheels at Realistic Stance
  const trackWidth = 0.92;
  const wheelY = 0.355;
  const wheelbaseFront = 1.34;
  const wheelbaseRear = -1.34;

  // Front Right Wheel (Star of Stage 2 Exploded Engineering View)
  const frAssembly = createPrecisionWheelAssembly(true);
  const wheelFrontRight = frAssembly.wheelGroup;
  wheelFrontRight.position.set(trackWidth, wheelY, wheelbaseFront);
  wheelFrontRight.name = 'FrontRightWheelAssembly';
  carGroup.add(wheelFrontRight);

  // Front Left Wheel
  const flAssembly = createPrecisionWheelAssembly(false);
  flAssembly.wheelGroup.position.set(-trackWidth, wheelY, wheelbaseFront);
  carGroup.add(flAssembly.wheelGroup);

  // Rear Right Wheel
  const rrAssembly = createPrecisionWheelAssembly(true);
  rrAssembly.wheelGroup.position.set(trackWidth, wheelY, wheelbaseRear);
  carGroup.add(rrAssembly.wheelGroup);

  // Rear Left Wheel
  const rlAssembly = createPrecisionWheelAssembly(false);
  rlAssembly.wheelGroup.position.set(-trackWidth, wheelY, wheelbaseRear);
  carGroup.add(rlAssembly.wheelGroup);

  // ----------------------------------------------------
  // 5. Realistic Studio Ground Shadow Texture (High-Def Soft Contact AO)
  // ----------------------------------------------------
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const ctx = shadowCanvas.getContext('2d')!;

  // Multi-stop radial contact drop shadow
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
  grad.addColorStop(0.35, 'rgba(15, 23, 42, 0.45)');
  grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  shadowTexture.colorSpace = THREE.SRGBColorSpace;
  const shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 5.6),
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.8,
    })
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.015, 0);
  carGroup.add(shadowMesh);

  // Spotlight Target
  const spotlightTarget = new THREE.Object3D();
  spotlightTarget.position.set(0, 0.4, 0);
  carGroup.add(spotlightTarget);

  // ----------------------------------------------------
  // Exploded View Dynamics
  // ----------------------------------------------------
  const updateExplodedView = (wheelExplode: number, engineExplode: number, bonnetOpen: number) => {
    // 1. Wheel & Tire Assembly (Firmly mounted, no floating or exploding tires)
    frAssembly.wheelTireGroup.position.x = 0;
    frAssembly.discGroup.position.x = -0.06;
    frAssembly.caliperGroup.position.x = -0.065;
    frAssembly.caliperGroup.position.y = 0.14;

    // 2. Bonnet Opening Hinge (Stage 3)
    bonnetGroup.rotation.x = -bonnetOpen * 0.76;

    // 3. Engine Components Dynamics (Stage 3)
    enginePlenum.position.y = engineExplode * 0.2;
    coverGroup.position.y = engineExplode * 0.08;
    engineTurbo.position.x = -0.46;
    engineTurbo.position.y = 0.12;
  };

  const dispose = () => {
    carGroup.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    shadowTexture.dispose();
  };

  return {
    carGroup,
    bonnetGroup,
    wheelFrontRight,
    wheelTireFrontRight: frAssembly.wheelTireGroup,
    brakeDiscFrontRight: frAssembly.discGroup,
    caliperFrontRight: frAssembly.caliperGroup,
    engineGroup,
    enginePlenum,
    engineTurbo,
    engineCover,
    bodyMesh: bodyGroup,
    spotlightTarget,
    hoodStruts,
    carPaintMaterial,
    updateExplodedView,
    dispose,
  };
}
