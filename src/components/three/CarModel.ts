import * as THREE from 'three';

export interface CarAssembly {
  carGroup: THREE.Group;
  bonnetGroup: THREE.Group;
  wheelFrontRight: THREE.Group;
  wheelTireFrontRight: THREE.Mesh;
  brakeDiscFrontRight: THREE.Mesh;
  caliperFrontRight: THREE.Mesh;
  engineGroup: THREE.Group;
  enginePlenum: THREE.Mesh;
  engineTurbo: THREE.Mesh;
  engineCover: THREE.Mesh;
  bodyMesh: THREE.Mesh;
  spotlightTarget: THREE.Object3D;
  updateExplodedView: (wheelExplode: number, engineExplode: number, bonnetOpen: number) => void;
  dispose: () => void;
}

/**
 * Creates a high-fidelity 3D vehicle model with articulated bonnet,
 * separable front-right wheel assembly (rim, disc, caliper),
 * and exploded engine powertrain components.
 */
export function createVehicleModel(): CarAssembly {
  const carGroup = new THREE.Group();
  carGroup.name = 'VehicleModel';

  // ----------------------------------------------------
  // Materials
  // ----------------------------------------------------
  // Pearlescent Automotive Paint
  const carPaintMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9, // Pearl White
    metalness: 0.85,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
    envMapIntensity: 1.8,
  });

  // Carbon / Dark Trim
  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.4,
    roughness: 0.5,
  });

  // Tinted Obsidian Glass
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.05,
    transmission: 0.65,
    transparent: true,
    opacity: 0.85,
    ior: 1.52,
    envMapIntensity: 2.0,
  });

  // Chrome & Polished Alloy
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.98,
    roughness: 0.08,
    envMapIntensity: 2.2,
  });

  // Brushed Titanium / Steel (Brake Rotors & Engine)
  const steelMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.88,
    roughness: 0.28,
  });

  // Performance Orange Caliper & Accent Paint
  const orangeAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    metalness: 0.5,
    roughness: 0.2,
    emissive: 0xea580c,
    emissiveIntensity: 0.15,
  });

  // Rubber Tire
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.88,
    metalness: 0.08,
  });

  // Headlight Lens & LED DRL
  const headlightGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.9,
    roughness: 0.04,
    transparent: true,
    opacity: 0.9,
  });
  const drlMaterial = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xff7700,
    emissiveIntensity: 1.4,
    roughness: 0.1,
  });

  // Tail Light Emissive
  const tailLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.5,
    roughness: 0.1,
  });

  // ----------------------------------------------------
  // 1. Main Chassis & Lower Body Shell
  // ----------------------------------------------------
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'CarBody';

  // Lower Body Hull (Streamlined aerodynamic cabin base)
  const lowerBodyGeo = new THREE.BoxGeometry(1.88, 0.44, 4.4, 4, 2, 8);
  // Shape the lower vertices for sleek taper
  const pos = lowerBodyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const y = pos.getY(i);
    // Taper front and rear
    if (z > 1.2) {
      pos.setX(i, pos.getX(i) * 0.92);
      if (y > 0) pos.setY(i, y * 0.85);
    } else if (z < -1.4) {
      pos.setX(i, pos.getX(i) * 0.95);
    }
  }
  lowerBodyGeo.computeVertexNormals();

  const bodyMesh = new THREE.Mesh(lowerBodyGeo, carPaintMaterial);
  bodyMesh.position.y = 0.42;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyGroup.add(bodyMesh);

  // Greenhouse Glass Canopy / Roof
  const canopyGeo = new THREE.BoxGeometry(1.5, 0.48, 2.3, 4, 2, 4);
  const canopyPos = canopyGeo.attributes.position;
  for (let i = 0; i < canopyPos.count; i++) {
    const y = canopyPos.getY(i);
    const z = canopyPos.getZ(i);
    if (y > 0) {
      canopyPos.setX(i, canopyPos.getX(i) * 0.82); // Taper roof pillars inward
      if (z > 0.4) canopyPos.setZ(i, z * 0.88); // Rake windshield back
    }
  }
  canopyGeo.computeVertexNormals();
  const canopyMesh = new THREE.Mesh(canopyGeo, glassMaterial);
  canopyMesh.position.set(0, 0.82, -0.15);
  canopyMesh.castShadow = true;
  bodyGroup.add(canopyMesh);

  // Roof Panel
  const roofGeo = new THREE.BoxGeometry(1.22, 0.04, 1.6);
  const roofMesh = new THREE.Mesh(roofGeo, carPaintMaterial);
  roofMesh.position.set(0, 1.07, -0.2);
  bodyGroup.add(roofMesh);

  // Front Bumper & Lower Splitter
  const splitterGeo = new THREE.BoxGeometry(1.82, 0.08, 0.6);
  const splitterMesh = new THREE.Mesh(splitterGeo, carbonMaterial);
  splitterMesh.position.set(0, 0.22, 2.15);
  bodyGroup.add(splitterMesh);

  // Front Mesh Grille
  const grilleGeo = new THREE.BoxGeometry(1.1, 0.28, 0.08);
  const grilleMesh = new THREE.Mesh(grilleGeo, carbonMaterial);
  grilleMesh.position.set(0, 0.42, 2.21);
  bodyGroup.add(grilleMesh);

  // Grille Chrome Trim Border
  const grilleBorderGeo = new THREE.BoxGeometry(1.16, 0.32, 0.04);
  const grilleBorder = new THREE.Mesh(grilleBorderGeo, chromeMaterial);
  grilleBorder.position.set(0, 0.42, 2.2);
  bodyGroup.add(grilleBorder);

  // Dual Headlight Clusters (Right & Left)
  const headlightGeo = new THREE.BoxGeometry(0.36, 0.12, 0.22);
  // Right Headlight
  const rightHeadlight = new THREE.Mesh(headlightGeo, headlightGlass);
  rightHeadlight.position.set(0.68, 0.52, 2.05);
  rightHeadlight.rotation.y = -0.15;
  const rightDrl = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.04), drlMaterial);
  rightDrl.position.set(0.68, 0.56, 2.15);
  rightDrl.rotation.y = -0.15;
  bodyGroup.add(rightHeadlight, rightDrl);

  // Left Headlight
  const leftHeadlight = new THREE.Mesh(headlightGeo, headlightGlass);
  leftHeadlight.position.set(-0.68, 0.52, 2.05);
  leftHeadlight.rotation.y = 0.15;
  const leftDrl = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.04), drlMaterial);
  leftDrl.position.set(-0.68, 0.56, 2.15);
  leftDrl.rotation.y = 0.15;
  bodyGroup.add(leftHeadlight, leftDrl);

  // Rear Light Strip & Diffuser
  const tailLightGeo = new THREE.BoxGeometry(1.68, 0.06, 0.06);
  const tailLightMesh = new THREE.Mesh(tailLightGeo, tailLightMaterial);
  tailLightMesh.position.set(0, 0.56, -2.18);
  bodyGroup.add(tailLightMesh);

  const diffuserGeo = new THREE.BoxGeometry(1.6, 0.14, 0.3);
  const diffuserMesh = new THREE.Mesh(diffuserGeo, carbonMaterial);
  diffuserMesh.position.set(0, 0.24, -2.12);
  bodyGroup.add(diffuserMesh);

  // Twin Chrome Exhaust Tips
  const exhaustGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16);
  exhaustGeo.rotateX(Math.PI / 2);
  const rightExhaust = new THREE.Mesh(exhaustGeo, chromeMaterial);
  rightExhaust.position.set(0.55, 0.22, -2.25);
  const leftExhaust = new THREE.Mesh(exhaustGeo, chromeMaterial);
  leftExhaust.position.set(-0.55, 0.22, -2.25);
  bodyGroup.add(rightExhaust, leftExhaust);

  // Side Skirts & Mirrors
  const mirrorGeo = new THREE.BoxGeometry(0.18, 0.08, 0.12);
  const rightMirror = new THREE.Mesh(mirrorGeo, carPaintMaterial);
  rightMirror.position.set(0.92, 0.72, 0.55);
  const leftMirror = new THREE.Mesh(mirrorGeo, carPaintMaterial);
  leftMirror.position.set(-0.92, 0.72, 0.55);
  bodyGroup.add(rightMirror, leftMirror);

  carGroup.add(bodyGroup);

  // ----------------------------------------------------
  // 2. Articulated Bonnet (Hood)
  // ----------------------------------------------------
  // Pivots at base of windshield (z: 0.55, y: 0.65)
  const bonnetGroup = new THREE.Group();
  bonnetGroup.position.set(0, 0.66, 0.55);
  bonnetGroup.name = 'BonnetHinge';

  // Hood panel geometry relative to pivot
  const hoodShape = new THREE.BoxGeometry(1.62, 0.04, 1.55);
  const hoodPos = hoodShape.attributes.position;
  for (let i = 0; i < hoodPos.count; i++) {
    const z = hoodPos.getZ(i);
    if (z > 0.3) {
      // Taper toward front nose
      hoodPos.setX(i, hoodPos.getX(i) * 0.9);
      hoodPos.setY(i, hoodPos.getY(i) - 0.04);
    }
  }
  hoodShape.computeVertexNormals();

  const hoodMesh = new THREE.Mesh(hoodShape, carPaintMaterial);
  // Center of hood sits at half length (+0.75m forward from hinge)
  hoodMesh.position.set(0, 0, 0.78);
  hoodMesh.castShadow = true;
  bonnetGroup.add(hoodMesh);

  // Inner hood soundproofing / carbon liner
  const linerGeo = new THREE.BoxGeometry(1.5, 0.02, 1.4);
  const linerMesh = new THREE.Mesh(linerGeo, carbonMaterial);
  linerMesh.position.set(0, -0.02, 0.78);
  bonnetGroup.add(linerMesh);

  carGroup.add(bonnetGroup);

  // ----------------------------------------------------
  // 3. Engine Bay & Powertrain Assembly (Under Bonnet)
  // ----------------------------------------------------
  const engineGroup = new THREE.Group();
  engineGroup.position.set(0, 0.48, 1.25);
  engineGroup.name = 'EngineCompartment';

  // Bay Surrounding Apron
  const bayApronGeo = new THREE.BoxGeometry(1.6, 0.3, 1.4);
  const bayApron = new THREE.Mesh(
    bayApronGeo,
    new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.7 })
  );
  bayApron.position.set(0, -0.15, 0);
  engineGroup.add(bayApron);

  // Engine Cylinder Block (Metallic Cast Alloy)
  const engineBlockGeo = new THREE.BoxGeometry(0.72, 0.32, 0.85);
  const engineBlock = new THREE.Mesh(engineBlockGeo, carbonMaterial);
  engineBlock.position.set(0, 0, 0);
  engineBlock.castShadow = true;
  engineGroup.add(engineBlock);

  // Engine Cam/Valve Cover with Orange MMR Performance Strip
  const coverGeo = new THREE.BoxGeometry(0.68, 0.08, 0.82);
  const engineCover = new THREE.Mesh(coverGeo, carbonMaterial);
  engineCover.position.set(0, 0.18, 0);
  const orangeStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.02, 0.8),
    orangeAccentMaterial
  );
  orangeStripe.position.set(0, 0.23, 0);
  engineCover.add(orangeStripe);
  engineGroup.add(engineCover);

  // Intake Plenum & Chrome Runners (Separates upward in exploded view)
  const plenumGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16);
  plenumGeo.rotateZ(Math.PI / 2);
  const enginePlenum = new THREE.Mesh(plenumGeo, chromeMaterial);
  enginePlenum.position.set(0.18, 0.26, -0.05);
  enginePlenum.castShadow = true;
  // 4 Intake Runners
  for (let r = 0; r < 4; r++) {
    const runnerGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12);
    const runner = new THREE.Mesh(runnerGeo, chromeMaterial);
    runner.position.set(-0.25 + r * 0.16, -0.06, 0.14);
    runner.rotation.x = 0.3;
    enginePlenum.add(runner);
  }
  engineGroup.add(enginePlenum);

  // Turbocharger Assembly (Turbine housing + Compressor + Downpipe)
  const turboGroup = new THREE.Group();
  const turbineGeo = new THREE.TorusGeometry(0.1, 0.045, 12, 24);
  const turbineMesh = new THREE.Mesh(turbineGeo, steelMaterial);
  turbineMesh.rotation.y = Math.PI / 2;
  turboGroup.add(turbineMesh);

  const compressorGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 16);
  compressorGeo.rotateX(Math.PI / 2);
  const compressorMesh = new THREE.Mesh(compressorGeo, chromeMaterial);
  compressorMesh.position.set(0.08, 0, 0);
  turboGroup.add(compressorMesh);

  // Turbocharger orange performance boost conduit
  const boostPipeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 12);
  boostPipeGeo.rotateZ(Math.PI / 4);
  const boostPipe = new THREE.Mesh(boostPipeGeo, orangeAccentMaterial);
  boostPipe.position.set(0.16, 0.1, 0);
  turboGroup.add(boostPipe);

  const engineTurbo = turboGroup as unknown as THREE.Mesh;
  engineTurbo.position.set(-0.45, 0.12, 0.1);
  engineGroup.add(engineTurbo);

  // Radiator & Cooling Pack (Front of Bay)
  const radiatorGeo = new THREE.BoxGeometry(0.9, 0.32, 0.06);
  const radiatorMesh = new THREE.Mesh(radiatorGeo, steelMaterial);
  radiatorMesh.position.set(0, 0.05, 0.65);
  engineGroup.add(radiatorMesh);

  carGroup.add(engineGroup);

  // ----------------------------------------------------
  // Helper: Build a Wheel Assembly (Rim + Tire + Brake Rotor + Caliper)
  // ----------------------------------------------------
  function createWheelNode(isRight: boolean) {
    const wheelGroup = new THREE.Group();

    // 1. Rubber Tire
    const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.24, 32);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, tireMaterial);
    tireMesh.castShadow = true;

    // 2. Diamond-Cut Alloy Rim
    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.25, 24);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
    // 5 Spokes
    for (let s = 0; s < 5; s++) {
      const spokeGeo = new THREE.BoxGeometry(0.04, 0.26, 0.06);
      const spoke = new THREE.Mesh(spokeGeo, steelMaterial);
      spoke.rotation.x = (s * Math.PI * 2) / 5;
      rimMesh.add(spoke);
    }
    // Orange MMR Center Hub
    const hubGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.26, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, orangeAccentMaterial);
    rimMesh.add(hub);

    const wheelTireMesh = new THREE.Group() as unknown as THREE.Mesh;
    wheelTireMesh.add(tireMesh);
    wheelTireMesh.add(rimMesh);
    wheelGroup.add(wheelTireMesh);

    // 3. Ventilated Brake Disc Rotor
    const discGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 32);
    discGeo.rotateZ(Math.PI / 2);
    const brakeDiscMesh = new THREE.Mesh(discGeo, steelMaterial);
    brakeDiscMesh.position.x = isRight ? -0.06 : 0.06;
    wheelGroup.add(brakeDiscMesh);

    // 4. Performance Caliper (Vibrant Orange)
    const caliperGeo = new THREE.BoxGeometry(0.08, 0.16, 0.12);
    const caliperMesh = new THREE.Mesh(caliperGeo, orangeAccentMaterial);
    caliperMesh.position.set(isRight ? -0.06 : 0.06, 0.14, 0.08);
    caliperMesh.castShadow = true;
    wheelGroup.add(caliperMesh);

    return { wheelGroup, wheelTireMesh, brakeDiscMesh, caliperMesh };
  }

  // ----------------------------------------------------
  // 4. Wheels Placement
  // ----------------------------------------------------
  const trackWidth = 0.94;
  const wheelY = 0.36;
  const wheelbaseFront = 1.35;
  const wheelbaseRear = -1.35;

  // Front Right Wheel (The Star of Stage 2 Exploded Engineering View!)
  const frontRightAssembly = createWheelNode(true);
  const wheelFrontRight = frontRightAssembly.wheelGroup;
  wheelFrontRight.position.set(trackWidth, wheelY, wheelbaseFront);
  wheelFrontRight.name = 'FrontRightWheelAssembly';
  carGroup.add(wheelFrontRight);

  // Front Left Wheel
  const frontLeftAssembly = createWheelNode(false);
  frontLeftAssembly.wheelGroup.position.set(-trackWidth, wheelY, wheelbaseFront);
  carGroup.add(frontLeftAssembly.wheelGroup);

  // Rear Right Wheel
  const rearRightAssembly = createWheelNode(true);
  rearRightAssembly.wheelGroup.position.set(trackWidth, wheelY, wheelbaseRear);
  carGroup.add(rearRightAssembly.wheelGroup);

  // Rear Left Wheel
  const rearLeftAssembly = createWheelNode(false);
  rearLeftAssembly.wheelGroup.position.set(-trackWidth, wheelY, wheelbaseRear);
  carGroup.add(rearLeftAssembly.wheelGroup);

  // ----------------------------------------------------
  // 5. Contact Floor Ground Shadow
  // ----------------------------------------------------
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
  gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  shadowTexture.colorSpace = THREE.SRGBColorSpace;
  const shadowGeo = new THREE.PlaneGeometry(3.0, 5.4);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.75,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.015, 0);
  carGroup.add(shadowMesh);

  // ----------------------------------------------------
  // 6. Floor Spotlight Target
  // ----------------------------------------------------
  const spotlightTarget = new THREE.Object3D();
  spotlightTarget.position.set(0, 0.3, 0);
  carGroup.add(spotlightTarget);

  // ----------------------------------------------------
  // Exploded View Transform Function
  // ----------------------------------------------------
  /**
   * @param wheelExplode 0 (assembled) -> 1 (fully separated wheel, disc, caliper)
   * @param engineExplode 0 (assembled) -> 1 (intake, turbo, block elevated)
   * @param bonnetOpen 0 (closed) -> 1 (open at 45 degrees)
   */
  const updateExplodedView = (wheelExplode: number, engineExplode: number, bonnetOpen: number) => {
    // 1. Wheel Exploded Transformation
    // Rim & tire translates outward along +X
    frontRightAssembly.wheelTireMesh.position.x = wheelExplode * 0.75;
    // Brake rotor disc floats midway
    frontRightAssembly.brakeDiscMesh.position.x = -0.06 + wheelExplode * 0.38;
    // Caliper offsets slightly outward and upward
    frontRightAssembly.caliperMesh.position.x = -0.06 + wheelExplode * 0.22;
    frontRightAssembly.caliperMesh.position.y = 0.14 + wheelExplode * 0.08;

    // 2. Bonnet Opening Hinge (Rotation on X)
    // Angles down to open forward/upward
    bonnetGroup.rotation.x = -bonnetOpen * 0.78;

    // 3. Engine Components Exploded Transformation
    enginePlenum.position.y = 0.26 + engineExplode * 0.32;
    engineCover.position.y = 0.18 + engineExplode * 0.12;
    engineTurbo.position.x = -0.45 - engineExplode * 0.28;
    engineTurbo.position.y = 0.12 + engineExplode * 0.16;
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
    wheelTireFrontRight: frontRightAssembly.wheelTireMesh,
    brakeDiscFrontRight: frontRightAssembly.brakeDiscMesh,
    caliperFrontRight: frontRightAssembly.caliperMesh,
    engineGroup,
    enginePlenum,
    engineTurbo,
    engineCover,
    bodyMesh,
    spotlightTarget,
    updateExplodedView,
    dispose,
  };
}
