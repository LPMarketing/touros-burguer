import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BrandMark } from './BrandMark';

export type IntroScene = 1 | 2 | 3 | 4 | 5;

interface BullMascotProps {
  onSceneChange?: (scene: IntroScene) => void;
}

interface CrumbParticle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  life: number;
  maxLife: number;
  active: boolean;
}

const _tmpVec = new THREE.Vector3();

function createTaperedHornGeometry(
  curve: THREE.CatmullRomCurve3,
  tubularSegments = 28,
  radialSegments = 14,
  baseRadius = 0.145,
  tipRadius = 0.018
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const point = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    // Smooth organic taper from thick base to sharp tip
    const radius = THREE.MathUtils.lerp(baseRadius, tipRadius, Math.pow(t, 0.82));

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);

      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;

      normals.push(nx, ny, nz);
      positions.push(point.x + radius * nx, point.y + radius * ny, point.z + radius * nz);
      uvs.push(t, j / radialSegments);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

function createApronCrestTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    // Subtle dark leather badge backdrop
    ctx.fillStyle = '#141413';
    ctx.beginPath();
    ctx.arc(128, 128, 108, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFD000';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 128, 98, 0, Math.PI * 2);
    ctx.stroke();

    // Stylized fierce Touros bull silhouette
    ctx.fillStyle = '#FFD000';
    ctx.beginPath();
    ctx.moveTo(64, 72);
    ctx.quadraticCurveTo(56, 114, 88, 124);
    ctx.lineTo(82, 174);
    ctx.quadraticCurveTo(86, 198, 128, 198);
    ctx.quadraticCurveTo(170, 198, 174, 174);
    ctx.lineTo(168, 124);
    ctx.quadraticCurveTo(200, 114, 192, 72);
    ctx.quadraticCurveTo(174, 100, 148, 102);
    ctx.lineTo(108, 102);
    ctx.quadraticCurveTo(82, 100, 64, 72);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#141413';
    ctx.beginPath();
    ctx.arc(106, 142, 8, 0, Math.PI * 2);
    ctx.arc(150, 142, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createFurBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const len = 5 + Math.random() * 10;
      const v = Math.floor(95 + Math.random() * 80);
      ctx.strokeStyle = `rgb(${v},${v},${v})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 3, y + len);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildBurgerWedge(
  thetaStart: number,
  thetaLength: number,
  mats: {
    bunTop: THREE.Material;
    bunBottom: THREE.Material;
    patty: THREE.Material;
    cheese: THREE.Material;
    lettuce: THREE.Material;
    bacon: THREE.Material;
    sesame: THREE.Material;
  }
): THREE.Group {
  const wedge = new THREE.Group();
  const r = 0.43;

  // Bottom brioche bun slice
  const botGeo = new THREE.CylinderGeometry(r * 0.96, r * 0.92, 0.11, 20, 1, false, thetaStart, thetaLength);
  const bot = new THREE.Mesh(botGeo, mats.bunBottom);
  bot.position.y = -0.14;
  bot.castShadow = true;
  wedge.add(bot);

  // Thick seared beef patty slice
  const pattyGeo = new THREE.CylinderGeometry(r * 1.02, r * 1.02, 0.13, 20, 1, false, thetaStart, thetaLength);
  const patty = new THREE.Mesh(pattyGeo, mats.patty);
  patty.position.y = -0.02;
  patty.castShadow = true;
  wedge.add(patty);

  // Melted cheddar layer + overhang drips
  const cheeseGeo = new THREE.CylinderGeometry(r * 1.05, r * 1.03, 0.045, 20, 1, false, thetaStart, thetaLength);
  const cheese = new THREE.Mesh(cheeseGeo, mats.cheese);
  cheese.position.y = 0.065;
  wedge.add(cheese);

  const midAngle = thetaStart + thetaLength * 0.5;
  const dripGeo = new THREE.ConeGeometry(0.065, 0.14, 10);
  const drip = new THREE.Mesh(dripGeo, mats.cheese);
  drip.position.set(Math.sin(midAngle) * r * 0.98, 0.01, Math.cos(midAngle) * r * 0.98);
  drip.rotation.x = Math.PI;
  wedge.add(drip);

  // Crispy bacon slab
  const baconGeo = new THREE.CylinderGeometry(r * 0.97, r * 0.97, 0.036, 18, 1, false, thetaStart, thetaLength);
  const bacon = new THREE.Mesh(baconGeo, mats.bacon);
  bacon.position.y = 0.105;
  wedge.add(bacon);

  // Crisp lettuce frill
  const letGeo = new THREE.CylinderGeometry(r * 1.07, r * 1.02, 0.04, 18, 1, false, thetaStart, thetaLength);
  const lettuce = new THREE.Mesh(letGeo, mats.lettuce);
  lettuce.position.y = 0.14;
  wedge.add(lettuce);

  // Glossy top brioche dome slice
  const topGeo = new THREE.SphereGeometry(r * 0.98, 22, 14, thetaStart, thetaLength, 0, Math.PI * 0.5);
  const top = new THREE.Mesh(topGeo, mats.bunTop);
  top.scale.set(1, 0.68, 1);
  top.position.y = 0.155;
  top.castShadow = true;
  wedge.add(top);

  // Sesame seeds on the crown
  for (let s = 0; s < 5; s++) {
    const a = thetaStart + thetaLength * (0.18 + (s / 5) * 0.65);
    const rad = r * (0.42 + (s % 2) * 0.25);
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), mats.sesame);
    seed.scale.set(1.5, 0.6, 0.9);
    const yHeight = 0.155 + Math.sqrt(Math.max(0.02, r * r - rad * rad)) * 0.67;
    seed.position.set(Math.sin(a) * rad, yHeight, Math.cos(a) * rad);
    wedge.add(seed);
  }

  return wedge;
}

export function BullMascot({ onSceneChange }: BullMascotProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection per Three.js skill protocol
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    // 2. Scene, Camera & Studio Environment Reflection
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);
    scene.fog = new THREE.FogExp2(0x080808, 0.048);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / Math.max(1, height);
    const camera = new THREE.PerspectiveCamera(aspect < 0.75 ? 45 : 37, aspect, 0.1, 40);
    const baseCamZ = aspect < 0.75 ? 6.1 : 4.75;
    camera.position.set(0, 0.75, baseCamZ);
    camera.lookAt(0, 0.52, 0);

    // 3. Three-Point Studio Lighting Rig (Warm Key, Cool Hemi Fill, Yellow Rim)
    const keyLight = new THREE.DirectionalLight(0xffe1b0, 2.5);
    keyLight.position.set(3.2, 4.6, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    const d = 3.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiFill = new THREE.HemisphereLight(0x9ab4d8, 0x26170b, 0.75);
    scene.add(hemiFill);

    const rimLight = new THREE.SpotLight(0xffd000, 5.5, 16, Math.PI / 3.2, 0.7, 1.4);
    rimLight.position.set(-2.4, 3.6, -3.4);
    rimLight.target.position.set(0, 0.9, 0);
    scene.add(rimLight);
    scene.add(rimLight.target);

    const warmFrontBounce = new THREE.PointLight(0xffb44c, 1.2, 9, 2);
    warmFrontBounce.position.set(0.2, 0.4, 2.5);
    scene.add(warmFrontBounce);

    // 4. Ground & Contact Shadow Plane
    const shadowTex = createContactShadowTexture();
    const groundShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.7 })
    );
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.15;
    scene.add(groundShadow);

    // Subtle dark stage floor receiving key light shadow
    const stageFloor = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: 0x0a0a09, roughness: 0.9, metalness: 0.05 })
    );
    stageFloor.rotation.x = -Math.PI / 2;
    stageFloor.position.y = -1.17;
    stageFloor.receiveShadow = true;
    scene.add(stageFloor);

    // 5. PBR Materials Library (varied roughness/metalness per skill rules)
    const furBump = createFurBumpTexture();
    const apronCrestTex = createApronCrestTexture();

    const furMat = new THREE.MeshStandardMaterial({
      color: 0x6f3b1e,
      roughness: 0.84,
      metalness: 0.04,
      bumpMap: furBump,
      bumpScale: 0.025,
    });
    const furDarkMat = new THREE.MeshStandardMaterial({
      color: 0x452210,
      roughness: 0.88,
      metalness: 0.03,
      bumpMap: furBump,
      bumpScale: 0.025,
    });
    const snoutMat = new THREE.MeshStandardMaterial({
      color: 0xa6704c,
      roughness: 0.62,
      metalness: 0.04,
    });
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0xefe1b8,
      roughness: 0.34,
      metalness: 0.08,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd000,
      roughness: 0.18,
      metalness: 0.92,
    });
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x161615,
      roughness: 0.78,
      metalness: 0.06,
    });
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0xffd000,
      roughness: 0.45,
      metalness: 0.12,
    });
    const crestMat = new THREE.MeshStandardMaterial({
      map: apronCrestTex,
      transparent: true,
      roughness: 0.5,
      metalness: 0.15,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8f6f0,
      roughness: 0.12,
      metalness: 0.02,
    });
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x261205,
      roughness: 0.1,
      metalness: 0.1,
    });
    const mouthInnerMat = new THREE.MeshStandardMaterial({
      color: 0x2d0a08,
      roughness: 0.55,
      metalness: 0.0,
    });
    const teethMat = new THREE.MeshStandardMaterial({
      color: 0xfff8e8,
      roughness: 0.25,
      metalness: 0.04,
    });

    const burgerMats = {
      bunTop: new THREE.MeshStandardMaterial({ color: 0xdf8225, roughness: 0.36, metalness: 0.05 }),
      bunBottom: new THREE.MeshStandardMaterial({ color: 0xc9701c, roughness: 0.52, metalness: 0.03 }),
      patty: new THREE.MeshStandardMaterial({ color: 0x3b1a0c, roughness: 0.88, metalness: 0.02 }),
      cheese: new THREE.MeshStandardMaterial({ color: 0xffc800, roughness: 0.24, metalness: 0.04 }),
      lettuce: new THREE.MeshStandardMaterial({ color: 0x4ca634, roughness: 0.58, metalness: 0.02 }),
      bacon: new THREE.MeshStandardMaterial({ color: 0x8c2315, roughness: 0.42, metalness: 0.08 }),
      sesame: new THREE.MeshStandardMaterial({ color: 0xfff2cf, roughness: 0.45, metalness: 0.02 }),
    };

    // 6. Sculpted Composite 3D Anthropomorphic Bull Group
    const bullRoot = new THREE.Group();
    bullRoot.position.set(0, -1.15, 0);
    scene.add(bullRoot);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.08, 0);
    bullRoot.add(torsoGroup);

    // Muscular Torso & Shoulders
    const chestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.56, 1.35, 28), furDarkMat);
    chestMesh.scale.set(1.16, 1, 0.82);
    chestMesh.castShadow = true;
    torsoGroup.add(chestMesh);

    const shirtTee = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.58, 1.15, 28), apronMat);
    shirtTee.scale.set(1.17, 1, 0.83);
    shirtTee.position.y = -0.04;
    shirtTee.castShadow = true;
    torsoGroup.add(shirtTee);

    // Apron Bib & Skirt + Yellow Straps + Brass Rivets + Chest Crest
    const apronFront = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.65, 1.32, 24, 1, false, -0.85, 1.7), apronMat);
    apronFront.position.set(0, -0.22, 0.08);
    apronFront.scale.set(1.08, 1, 0.78);
    apronFront.castShadow = true;
    torsoGroup.add(apronFront);

    const strapLeft = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.74, 0.08), strapMat);
    strapLeft.position.set(-0.34, 0.42, 0.34);
    strapLeft.rotation.set(-0.28, 0, -0.14);
    torsoGroup.add(strapLeft);

    const strapRight = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.74, 0.08), strapMat);
    strapRight.position.set(0.34, 0.42, 0.34);
    strapRight.rotation.set(-0.28, 0, 0.14);
    torsoGroup.add(strapRight);

    const rivetGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.04, 14);
    const rivetL = new THREE.Mesh(rivetGeo, goldMat);
    rivetL.rotation.x = Math.PI / 2;
    rivetL.position.set(-0.3, 0.16, 0.55);
    torsoGroup.add(rivetL);

    const rivetR = new THREE.Mesh(rivetGeo, goldMat);
    rivetR.rotation.x = Math.PI / 2;
    rivetR.position.set(0.3, 0.16, 0.55);
    torsoGroup.add(rivetR);

    const crestPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), crestMat);
    crestPlane.position.set(0, 0.02, 0.605);
    torsoGroup.add(crestPlane);

    // Thick Neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.48, 0.48, 20), furMat);
    neckMesh.position.set(0, 0.76, -0.02);
    neckMesh.castShadow = true;
    torsoGroup.add(neckMesh);

    // HEAD GROUP
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.08, 0.04);
    torsoGroup.add(headGroup);

    // Sculpted Cranium
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.46, 26, 22), furMat);
    cranium.scale.set(1.04, 1.06, 1.08);
    cranium.castShadow = true;
    headGroup.add(cranium);

    // Broad Upper Snout
    const upperSnout = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.48), snoutMat);
    upperSnout.position.set(0, -0.1, 0.34);
    headGroup.add(upperSnout);

    const snoutTip = new THREE.Mesh(new THREE.SphereGeometry(0.29, 20, 16), snoutMat);
    snoutTip.scale.set(1.12, 0.56, 0.85);
    snoutTip.position.set(0, -0.08, 0.44);
    headGroup.add(snoutTip);

    // Nostrils
    const nostrilGeo = new THREE.SphereGeometry(0.055, 12, 10);
    const nostrilL = new THREE.Mesh(nostrilGeo, furDarkMat);
    nostrilL.position.set(-0.14, -0.11, 0.65);
    headGroup.add(nostrilL);

    const nostrilR = new THREE.Mesh(nostrilGeo, furDarkMat);
    nostrilR.position.set(0.14, -0.11, 0.65);
    headGroup.add(nostrilR);

    // Brushed Gold Nose Ring
    const noseRing = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.028, 14, 28), goldMat);
    noseRing.position.set(0, -0.22, 0.62);
    noseRing.rotation.x = 0.25;
    headGroup.add(noseRing);

    // Mouth Interior Cavity + Upper Teeth
    const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), mouthInnerMat);
    mouthCavity.scale.set(1.1, 0.65, 0.9);
    mouthCavity.position.set(0, -0.24, 0.34);
    headGroup.add(mouthCavity);

    const upperTeeth = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.05, 16, 1, false, -1.1, 2.2), teethMat);
    upperTeeth.position.set(0, -0.2, 0.42);
    headGroup.add(upperTeeth);

    // ARTICULATED LOWER JAW (opens wide & chews!)
    const jawGroup = new THREE.Group();
    jawGroup.position.set(0, -0.22, 0.14);
    headGroup.add(jawGroup);

    const lowerJawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.42), furMat);
    lowerJawMesh.position.set(0, -0.09, 0.23);
    lowerJawMesh.castShadow = true;
    jawGroup.add(lowerJawMesh);

    const chinMesh = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 12), snoutMat);
    chinMesh.scale.set(1.12, 0.58, 0.9);
    chinMesh.position.set(0, -0.12, 0.38);
    jawGroup.add(chinMesh);

    const lowerTeeth = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.045, 16, 1, false, -1.0, 2.0), teethMat);
    lowerTeeth.position.set(0, -0.02, 0.28);
    jawGroup.add(lowerTeeth);

    // Fierce Expressive Eyes + Brows + Blinking/Squinting Eyelids
    const eyeGroupL = new THREE.Group();
    eyeGroupL.position.set(-0.2, 0.11, 0.41);
    headGroup.add(eyeGroupL);

    const eyeGroupR = new THREE.Group();
    eyeGroupR.position.set(0.2, 0.11, 0.41);
    headGroup.add(eyeGroupR);

    const eyeBallGeo = new THREE.SphereGeometry(0.088, 16, 14);
    const irisGeo = new THREE.SphereGeometry(0.052, 14, 12);

    const eyeL = new THREE.Mesh(eyeBallGeo, eyeWhiteMat);
    const irisL = new THREE.Mesh(irisGeo, irisMat);
    irisL.position.set(0.01, 0, 0.056);
    const lidL = new THREE.Mesh(new THREE.SphereGeometry(0.096, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), furDarkMat);
    lidL.rotation.x = -0.7;
    eyeGroupL.add(eyeL, irisL, lidL);

    const eyeR = new THREE.Mesh(eyeBallGeo, eyeWhiteMat);
    const irisR = new THREE.Mesh(irisGeo, irisMat);
    irisR.position.set(-0.01, 0, 0.056);
    const lidR = new THREE.Mesh(new THREE.SphereGeometry(0.096, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), furDarkMat);
    lidR.rotation.x = -0.7;
    eyeGroupR.add(eyeR, irisR, lidR);

    const browGeo = new THREE.BoxGeometry(0.22, 0.065, 0.1);
    const browL = new THREE.Mesh(browGeo, furDarkMat);
    browL.position.set(-0.21, 0.22, 0.44);
    browL.rotation.z = -0.22;
    headGroup.add(browL);

    const browR = new THREE.Mesh(browGeo, furDarkMat);
    browR.position.set(0.21, 0.22, 0.44);
    browR.rotation.z = 0.22;
    headGroup.add(browR);

    // Ears
    const earGeo = new THREE.ConeGeometry(0.12, 0.34, 12);
    const earL = new THREE.Mesh(earGeo, furDarkMat);
    earL.position.set(-0.52, 0.16, 0.0);
    earL.rotation.z = Math.PI * 0.62;
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, furDarkMat);
    earR.position.set(0.52, 0.16, 0.0);
    earR.rotation.z = -Math.PI * 0.62;
    headGroup.add(earR);

    // Massive Curved 3D Horns
    const leftHornCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.32, 0.32, -0.02),
      new THREE.Vector3(-0.68, 0.38, 0.04),
      new THREE.Vector3(-0.92, 0.66, 0.14),
      new THREE.Vector3(-0.82, 1.02, 0.2),
    ]);
    const rightHornCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.32, 0.32, -0.02),
      new THREE.Vector3(0.68, 0.38, 0.04),
      new THREE.Vector3(0.92, 0.66, 0.14),
      new THREE.Vector3(0.82, 1.02, 0.2),
    ]);
    const leftHorn = new THREE.Mesh(createTaperedHornGeometry(leftHornCurve), hornMat);
    leftHorn.castShadow = true;
    const rightHorn = new THREE.Mesh(createTaperedHornGeometry(rightHornCurve), hornMat);
    rightHorn.castShadow = true;
    headGroup.add(leftHorn, rightHorn);

    // LEFT ARM & HAND
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.82, 0.48, 0.04);
    torsoGroup.add(leftShoulder);

    const leftUpperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.44, 10, 14), furMat);
    leftUpperArm.position.set(0, -0.26, 0.04);
    leftUpperArm.castShadow = true;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.set(0, -0.52, 0.08);
    leftShoulder.add(leftElbow);

    const leftForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.42, 10, 14), furMat);
    leftForearm.position.set(0.08, -0.18, 0.24);
    leftForearm.rotation.x = 1.05;
    leftForearm.rotation.z = -0.35;
    leftForearm.castShadow = true;
    leftElbow.add(leftForearm);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 12), furDarkMat);
    leftHand.scale.set(1.05, 0.85, 1.25);
    leftHand.position.set(0.24, -0.24, 0.56);
    leftElbow.add(leftHand);

    // RIGHT ARM & HAND (also forms Thumbs-Up / Approval gesture in Scene 4!)
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.82, 0.48, 0.04);
    torsoGroup.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.44, 10, 14), furMat);
    rightUpperArm.position.set(0, -0.26, 0.04);
    rightUpperArm.castShadow = true;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.set(0, -0.52, 0.08);
    rightShoulder.add(rightElbow);

    const rightForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.42, 10, 14), furMat);
    rightForearm.position.set(-0.08, -0.18, 0.24);
    rightForearm.rotation.x = 1.05;
    rightForearm.rotation.z = 0.35;
    rightForearm.castShadow = true;
    rightElbow.add(rightForearm);

    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(-0.24, -0.24, 0.56);
    rightElbow.add(rightHandGroup);

    const rightPalm = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 12), furDarkMat);
    rightPalm.scale.set(1.05, 0.85, 1.25);
    rightHandGroup.add(rightPalm);

    const thumbUp = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.16, 8, 10), snoutMat);
    thumbUp.position.set(-0.04, 0.16, 0.02);
    thumbUp.visible = false;
    rightHandGroup.add(thumbUp);

    // 7. 3-STAGE BITEABLE 3D GOURMET BURGER
    const burgerGroup = new THREE.Group();
    burgerGroup.position.set(0, -0.05, 0.88);
    torsoGroup.add(burgerGroup);

    // Three 120-degree sectors that disappear cleanly with each real bite!
    const wedge1 = buildBurgerWedge(-Math.PI * 0.33, Math.PI * 0.67, burgerMats); // Front-center wedge (Bite 1)
    const wedge2 = buildBurgerWedge(Math.PI * 0.34, Math.PI * 0.67, burgerMats); // Right-back wedge (Bite 2)
    const wedge3 = buildBurgerWedge(Math.PI * 1.01, Math.PI * 0.66, burgerMats); // Final wedge (Bite 3)
    burgerGroup.add(wedge1, wedge2, wedge3);

    // 8. 3D CRUMB PARTICLES + GRILL EMBERS
    const crumbs: CrumbParticle[] = [];
    const crumbGeo = new THREE.DodecahedronGeometry(0.036, 0);
    for (let i = 0; i < 22; i++) {
      const mat = i % 3 === 0 ? burgerMats.cheese : burgerMats.bunTop;
      const m = new THREE.Mesh(crumbGeo, mat);
      m.visible = false;
      scene.add(m);
      crumbs.push({
        mesh: m,
        vx: 0,
        vy: 0,
        vz: 0,
        rx: 0,
        ry: 0,
        life: 0,
        maxLife: 0.9,
        active: false,
      });
    }

    const emberCount = 26;
    const emberGeo = new THREE.SphereGeometry(0.022, 6, 6);
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xffc800 });
    const emberMesh = new THREE.InstancedMesh(emberGeo, emberMat, emberCount);
    emberMesh.frustumCulled = false;
    const emberSeeds = Array.from({ length: emberCount }, () => ({
      x: (Math.random() - 0.5) * 4.5,
      y: -1.1 + Math.random() * 2.8,
      z: -1.8 + Math.random() * 2.6,
      speed: 0.45 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.9,
    }));
    scene.add(emberMesh);

    const spawnCrumbBurst = (originY: number, originZ: number) => {
      let spawned = 0;
      for (const c of crumbs) {
        if (!c.active && spawned < 10) {
          c.active = true;
          c.life = 0;
          c.maxLife = 0.65 + Math.random() * 0.35;
          c.mesh.visible = true;
          c.mesh.position.set((Math.random() - 0.5) * 0.22, originY, originZ);
          c.mesh.scale.setScalar(0.8 + Math.random() * 0.8);
          c.vx = (Math.random() - 0.5) * 1.8;
          c.vy = 0.8 + Math.random() * 1.4;
          c.vz = 0.6 + Math.random() * 1.1;
          c.rx = (Math.random() - 0.5) * 12;
          c.ry = (Math.random() - 0.5) * 12;
          spawned++;
        }
      }
    };

    // Pre-compile shaders on hardware GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 9. Animation Loop with Time-Based Eating Choreography
    const clock = new THREE.Clock();
    const dummy = new THREE.Object3D();
    let frameId = 0;
    let disposed = false;
    let currentScene: IntroScene = 1;
    let bite1Triggered = false;
    let bite2Triggered = false;
    let bite3Triggered = false;

    const setScene = (next: IntroScene) => {
      if (currentScene !== next) {
        currentScene = next;
        onSceneChange?.(next);
      }
    };

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const asp = w / Math.max(1, h);
      camera.fov = asp < 0.75 ? 45 : 37;
      camera.aspect = asp;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.08);
      const t = clock.getElapsedTime();

      // Determine choreography targets across the 3.9s eating sequence
      let targetBurgerY = -0.05;
      let targetBurgerZ = 0.88;
      let targetBurgerRotX = 0.08;
      let targetLeftArmX = -0.22;
      let targetLeftArmZ = 0.05;
      let targetRightArmX = -0.22;
      let targetRightArmZ = -0.05;
      let targetJawRotX = 0.02;
      let targetHeadRotX = 0.14; // looking at burger
      let targetHeadRotY = 0;
      let targetSquint = -0.7; // open eyes
      let targetCamZ = baseCamZ;
      let targetCamY = 0.75;

      if (t < 0.72) {
        // Scene 1: Presentation — bull eyes the burger eagerly
        setScene(1);
        targetBurgerY = -0.05 + Math.sin(t * 4) * 0.02;
        targetCamZ = baseCamZ - t * 0.35;
      } else if (t < 1.82) {
        // Scene 2: First BIG Bite!
        setScene(2);
        const phase = t - 0.72;
        targetBurgerY = 0.78;
        targetBurgerZ = 0.64;
        targetBurgerRotX = -0.24;
        targetLeftArmX = -1.22;
        targetLeftArmZ = 0.25;
        targetRightArmX = -1.22;
        targetRightArmZ = -0.25;
        targetHeadRotX = 0.18;
        targetCamZ = baseCamZ - 0.65;
        targetCamY = 0.92;

        if (phase < 0.25) {
          targetJawRotX = 0.56; // Open wide!
        } else if (phase < 0.42) {
          targetJawRotX = 0.04; // CHOMP!
          if (!bite1Triggered) {
            bite1Triggered = true;
            wedge1.visible = false;
            spawnCrumbBurst(0.75, 0.55);
          }
        } else {
          // Satisfied chew oscillations
          targetJawRotX = 0.08 + Math.abs(Math.sin((phase - 0.42) * 16)) * 0.24;
          targetSquint = -0.15;
          targetBurgerY = 0.45;
          targetBurgerZ = 0.78;
          targetLeftArmX = -0.75;
          targetRightArmX = -0.75;
        }
      } else if (t < 2.88) {
        // Scene 3: Second Bite + Final Bite!
        setScene(3);
        const phase = t - 1.82;
        targetBurgerY = 0.79;
        targetBurgerZ = 0.62;
        targetBurgerRotX = -0.28;
        targetLeftArmX = -1.24;
        targetLeftArmZ = 0.28;
        targetRightArmX = -1.24;
        targetRightArmZ = -0.28;
        targetHeadRotX = 0.16;
        targetCamZ = baseCamZ - 0.75;
        targetCamY = 0.95;

        if (phase < 0.22) {
          targetJawRotX = 0.54;
        } else if (phase < 0.42) {
          targetJawRotX = 0.04;
          if (!bite2Triggered) {
            bite2Triggered = true;
            wedge2.visible = false;
            spawnCrumbBurst(0.78, 0.54);
          }
        } else if (phase < 0.74) {
          targetJawRotX = 0.08 + Math.abs(Math.sin((phase - 0.42) * 17)) * 0.22;
          targetSquint = -0.05;
        } else {
          // Finishes the last piece!
          if (!bite3Triggered) {
            bite3Triggered = true;
            wedge3.visible = false;
            burgerGroup.visible = false;
            spawnCrumbBurst(0.76, 0.52);
          }
          targetJawRotX = 0.06 + Math.abs(Math.sin((phase - 0.74) * 18)) * 0.18;
          targetSquint = 0.05;
          targetLeftArmX = -0.15;
          targetRightArmX = -0.5;
        }
      } else {
        // Scene 4: Finished & Satisfied Approval Gesture!
        setScene(t < 3.4 ? 4 : 5);
        burgerGroup.visible = false;
        thumbUp.visible = true;
        targetLeftArmX = 0.12;
        targetLeftArmZ = -0.12;
        targetRightArmX = -1.05;
        targetRightArmZ = 0.18;
        targetJawRotX = 0.05;
        targetHeadRotX = -0.05 + Math.sin(t * 6) * 0.04; // approving nod
        targetHeadRotY = -0.12;
        targetSquint = -0.68;
        targetCamZ = baseCamZ - 0.15;
        targetCamY = 0.78;
      }

      // Smooth exponential damping (no abrupt snaps!)
      const k = 12;
      burgerGroup.position.y = THREE.MathUtils.damp(burgerGroup.position.y, targetBurgerY, k, dt);
      burgerGroup.position.z = THREE.MathUtils.damp(burgerGroup.position.z, targetBurgerZ, k, dt);
      burgerGroup.rotation.x = THREE.MathUtils.damp(burgerGroup.rotation.x, targetBurgerRotX, k, dt);
      burgerGroup.rotation.y += dt * 0.45;

      leftShoulder.rotation.x = THREE.MathUtils.damp(leftShoulder.rotation.x, targetLeftArmX, k, dt);
      leftShoulder.rotation.z = THREE.MathUtils.damp(leftShoulder.rotation.z, targetLeftArmZ, k, dt);
      rightShoulder.rotation.x = THREE.MathUtils.damp(rightShoulder.rotation.x, targetRightArmX, k, dt);
      rightShoulder.rotation.z = THREE.MathUtils.damp(rightShoulder.rotation.z, targetRightArmZ, k, dt);

      jawGroup.rotation.x = THREE.MathUtils.damp(jawGroup.rotation.x, targetJawRotX, 18, dt);
      headGroup.rotation.x = THREE.MathUtils.damp(headGroup.rotation.x, targetHeadRotX, 10, dt);
      headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, targetHeadRotY, 10, dt);
      lidL.rotation.x = THREE.MathUtils.damp(lidL.rotation.x, targetSquint, 14, dt);
      lidR.rotation.x = THREE.MathUtils.damp(lidR.rotation.x, targetSquint, 14, dt);

      torsoGroup.position.y = 1.08 + Math.sin(t * 3.2) * 0.025;
      bullRoot.rotation.y = Math.sin(t * 1.4) * 0.06;

      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 6, dt);
      _tmpVec.set(0, 0.55, 0);
      camera.lookAt(_tmpVec);

      // Update active flying crumbs with gravity
      for (const c of crumbs) {
        if (!c.active) continue;
        c.life += dt;
        if (c.life >= c.maxLife) {
          c.active = false;
          c.mesh.visible = false;
          continue;
        }
        c.vy -= 5.8 * dt;
        c.mesh.position.x += c.vx * dt;
        c.mesh.position.y += c.vy * dt;
        c.mesh.position.z += c.vz * dt;
        c.mesh.rotation.x += c.rx * dt;
        c.mesh.rotation.y += c.ry * dt;
        const fade = Math.max(0, 1 - c.life / c.maxLife);
        c.mesh.scale.setScalar(fade * 1.1);
      }

      // Update rising grill embers
      for (let i = 0; i < emberCount; i++) {
        const s = emberSeeds[i];
        const yOffset = ((t * s.speed + s.phase) % 2.8) - 1.1;
        dummy.position.set(
          s.x + Math.sin(t * 1.5 + s.phase) * 0.16,
          yOffset,
          s.z
        );
        const fadeScale = Math.sin(((yOffset + 1.1) / 2.8) * Math.PI) * s.scale;
        dummy.scale.setScalar(Math.max(0.01, fadeScale));
        dummy.updateMatrix();
        emberMesh.setMatrixAt(i, dummy.matrix);
      }
      emberMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      furBump.dispose();
      apronCrestTex.dispose();
      shadowTex.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [onSceneChange]);

  if (webglFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#080808]">
        <BrandMark className="w-24 h-24" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      role="img"
      aria-label="Animação 3D do mascote Touro comendo o hambúrguer da Touros Burguer"
    />
  );
}
