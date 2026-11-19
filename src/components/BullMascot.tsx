import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BrandMark } from './BrandMark';
import { createBullTexturePack } from '../three/proceduralTextures';
import {
  createSculptedBullHeadGeometry,
  createSculptedNosePadGeometry,
  createSculptedJawGeometry,
  createSculptedTorsoGeometry,
  createMuscularLimbGeometry,
  createSculptedEarGeometry,
  createTaperedHornGeometry,
  createStylizedHand,
} from '../three/sculptedGeometry';
import { createBiteableBurger } from '../three/biteableBurger';

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

// Pre-allocated math temporaries (zero per-frame heap allocations)
const _tmpVec = new THREE.Vector3();
const _downY = new THREE.Vector3(0, -1, 0);
const _st = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _elbow = new THREE.Vector3();
const _uDir = new THREE.Vector3();
const _fDir = new THREE.Vector3();
const _shoulderL = new THREE.Vector3(-0.76, 0.44, 0.02);
const _shoulderR = new THREE.Vector3(0.76, 0.44, 0.02);
const _poleL = new THREE.Vector3(-0.85, -0.52, -0.45).normalize();
const _poleR = new THREE.Vector3(0.85, -0.52, -0.45).normalize();
const _handTargetL = new THREE.Vector3();
const _handTargetR = new THREE.Vector3();
const _currentHandL = new THREE.Vector3(-0.39, -0.04, 0.88);
const _currentHandR = new THREE.Vector3(0.39, -0.04, 0.88);

function createSculptedEyeballGeometry(radius = 0.092): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, 28, 22);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (z > -0.015) {
      // Planar front projection onto the +Z cornea so iris & studio catchlights are crisp and circular
      const u = THREE.MathUtils.clamp(0.5 + (x / (radius * 1.48)) * 0.5, 0.02, 0.98);
      const v = THREE.MathUtils.clamp(0.5 + (y / (radius * 1.48)) * 0.5, 0.02, 0.98);
      uv.setXY(i, u, v);
    } else {
      // Pure sclera white area in eye texture
      uv.setXY(i, 0.03, 0.03);
    }
  }
  uv.needsUpdate = true;
  return geo;
}

function createTeethArc(teethMat: THREE.Material, count: number, radius: number, invert = false): THREE.Group {
  const group = new THREE.Group();
  const toothGeo = new THREE.CapsuleGeometry(0.021, 0.024, 6, 10);
  for (let i = 0; i < count; i++) {
    const frac = count === 1 ? 0.5 : i / (count - 1);
    const angle = THREE.MathUtils.lerp(-0.85, 0.85, frac);
    const tooth = new THREE.Mesh(toothGeo, teethMat);
    tooth.position.set(
      Math.sin(angle) * radius,
      invert ? -0.005 : 0.005,
      Math.cos(angle) * radius * 0.86
    );
    tooth.scale.set(1.15, 0.95, 0.72);
    group.add(tooth);
  }
  return group;
}

function createCurvedEyebrow(side: 'left' | 'right', mat: THREE.Material): THREE.Group {
  const s = side === 'left' ? -1 : 1;
  const pivot = new THREE.Group();

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(s * -0.09, -0.015, 0.01),
    new THREE.Vector3(0, 0.032, 0.03),
    new THREE.Vector3(s * 0.095, 0.01, -0.01),
  ]);
  const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.026, 10, false);
  const tube = new THREE.Mesh(tubeGeo, mat);
  tube.castShadow = true;
  pivot.add(tube);

  const capGeo = new THREE.SphereGeometry(0.025, 10, 8);
  const startCap = new THREE.Mesh(capGeo, mat);
  startCap.position.set(s * -0.09, -0.015, 0.01);
  const endCap = new THREE.Mesh(capGeo, mat);
  endCap.position.set(s * 0.095, 0.01, -0.01);
  pivot.add(startCap, endCap);

  return pivot;
}

function solveTwoBoneArm(
  shoulder: THREE.Vector3,
  handTarget: THREE.Vector3,
  poleHint: THREE.Vector3,
  l1: number,
  l2: number,
  upperArm: THREE.Object3D,
  elbowJoint: THREE.Object3D,
  forearm: THREE.Object3D,
  handMount: THREE.Object3D
) {
  _st.subVectors(handTarget, shoulder);
  const rawDist = _st.length();
  const maxReach = l1 + l2 - 0.02;
  const d = THREE.MathUtils.clamp(rawDist, 0.24, maxReach);
  if (rawDist > 1e-5) {
    _dir.copy(_st).divideScalar(rawDist);
  } else {
    _dir.set(0, -1, 0);
  }

  const cosAlpha = THREE.MathUtils.clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
  const sinAlpha = Math.sqrt(Math.max(0, 1 - cosAlpha * cosAlpha));

  const dot = poleHint.dot(_dir);
  _perp.copy(poleHint).addScaledVector(_dir, -dot);
  if (_perp.lengthSq() < 1e-5) {
    _perp.set(0, -1, 0);
  } else {
    _perp.normalize();
  }

  _elbow
    .copy(shoulder)
    .addScaledVector(_dir, l1 * cosAlpha)
    .addScaledVector(_perp, l1 * sinAlpha);

  _uDir.subVectors(_elbow, shoulder).normalize();
  upperArm.position.copy(shoulder);
  upperArm.quaternion.setFromUnitVectors(_downY, _uDir);

  elbowJoint.position.copy(_elbow);

  _fDir.subVectors(handTarget, _elbow);
  const fLen = _fDir.length();
  if (fLen > 1e-5) {
    _fDir.divideScalar(fLen);
    forearm.position.copy(_elbow);
    forearm.quaternion.setFromUnitVectors(_downY, _fDir);
  }

  handMount.position.copy(handTarget);
}

export function BullMascot({ onSceneChange }: BullMascotProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onSceneChangeRef = useRef(onSceneChange);
  onSceneChangeRef.current = onSceneChange;
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection per Three.js protocol
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
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    // 2. Scene, Responsive Camera & Studio Environment Reflection
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
    const camera = new THREE.PerspectiveCamera(aspect < 0.75 ? 43 : 36, aspect, 0.1, 40);
    const baseCamZ = aspect < 0.75 ? 5.95 : 4.65;
    camera.position.set(0, 0.74, baseCamZ);
    camera.lookAt(0, 0.56, 0);

    // 3. Three-Point Studio Lighting Rig (Warm Key, Cool Hemi Fill, Golden Rim)
    const keyLight = new THREE.DirectionalLight(0xffe1b0, 2.55);
    keyLight.position.set(3.1, 4.7, 4.4);
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

    const hemiFill = new THREE.HemisphereLight(0x9ab4d8, 0x26170b, 0.8);
    scene.add(hemiFill);

    const rimLight = new THREE.SpotLight(0xffd000, 6.5, 16, Math.PI / 3.0, 0.72, 1.35);
    rimLight.position.set(-2.3, 3.7, -3.3);
    rimLight.target.position.set(0, 0.95, 0);
    scene.add(rimLight);
    scene.add(rimLight.target);

    const rimLightRight = new THREE.DirectionalLight(0xffb833, 1.45);
    rimLightRight.position.set(2.8, 2.6, -3.2);
    scene.add(rimLightRight);

    const warmFrontBounce = new THREE.PointLight(0xffb44c, 1.3, 9, 2);
    warmFrontBounce.position.set(0.15, 0.45, 2.6);
    scene.add(warmFrontBounce);

    // 4. Procedural Texture Pack & PBR Materials Library
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createBullTexturePack(maxAniso);

    const groundShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 4.5),
      new THREE.MeshBasicMaterial({
        map: textures.contactShadow,
        transparent: true,
        depthWrite: false,
        opacity: 0.72,
      })
    );
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.15;
    scene.add(groundShadow);

    const stageFloor = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: 0x0a0a09, roughness: 0.9, metalness: 0.05 })
    );
    stageFloor.rotation.x = -Math.PI / 2;
    stageFloor.position.y = -1.17;
    stageFloor.receiveShadow = true;
    scene.add(stageFloor);

    const furMat = new THREE.MeshStandardMaterial({
      map: textures.furColor,
      bumpMap: textures.furBump,
      bumpScale: 0.022,
      roughness: 0.82,
      metalness: 0.04,
    });
    const furDarkMat = new THREE.MeshStandardMaterial({
      color: 0x4b2410,
      bumpMap: textures.furBump,
      bumpScale: 0.02,
      roughness: 0.86,
      metalness: 0.03,
    });
    const snoutMat = new THREE.MeshStandardMaterial({
      color: 0xb57953,
      roughness: 0.56,
      metalness: 0.04,
    });
    const nostrilMat = new THREE.MeshStandardMaterial({
      color: 0x261007,
      roughness: 0.65,
      metalness: 0.02,
    });
    const hornMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4e6c2,
      roughness: 0.28,
      metalness: 0.06,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd000,
      roughness: 0.16,
      metalness: 0.92,
      anisotropy: 0.75,
    });
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x151514,
      roughness: 0.78,
      metalness: 0.06,
    });
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0xffd000,
      roughness: 0.42,
      metalness: 0.1,
    });
    const crestMat = new THREE.MeshStandardMaterial({
      map: textures.apronCrest,
      transparent: true,
      roughness: 0.48,
      metalness: 0.14,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const eyeBallMat = new THREE.MeshPhysicalMaterial({
      map: textures.eyeIris,
      roughness: 0.08,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const mouthInnerMat = new THREE.MeshStandardMaterial({
      color: 0x2b0706,
      roughness: 0.52,
      metalness: 0.0,
    });
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xc94e52,
      roughness: 0.38,
      metalness: 0.02,
    });
    const teethMat = new THREE.MeshStandardMaterial({
      color: 0xfff8ea,
      roughness: 0.22,
      metalness: 0.04,
    });
    const hoofMat = new THREE.MeshStandardMaterial({
      color: 0x2a150b,
      roughness: 0.42,
      metalness: 0.1,
    });

    const burgerMats = {
      bunTop: new THREE.MeshStandardMaterial({
        map: textures.bunTop,
        roughness: 0.36,
        metalness: 0.04,
      }),
      bunBottom: new THREE.MeshStandardMaterial({
        color: 0xcc721c,
        roughness: 0.54,
        metalness: 0.03,
      }),
      patty: new THREE.MeshStandardMaterial({
        color: 0x3b1a0c,
        bumpMap: textures.pattyBump,
        bumpScale: 0.028,
        roughness: 0.88,
        metalness: 0.02,
      }),
      cheese: new THREE.MeshStandardMaterial({
        color: 0xffc800,
        roughness: 0.22,
        metalness: 0.04,
      }),
      lettuce: new THREE.MeshStandardMaterial({
        color: 0x4ca634,
        roughness: 0.55,
        metalness: 0.02,
      }),
      bacon: new THREE.MeshStandardMaterial({
        color: 0x8f2416,
        roughness: 0.4,
        metalness: 0.08,
      }),
      sesame: new THREE.MeshStandardMaterial({
        color: 0xfff3d4,
        roughness: 0.44,
        metalness: 0.02,
      }),
    };

    // 5. Sculpted Composite 3D Anthropomorphic Bull Character
    const bullRoot = new THREE.Group();
    bullRoot.position.set(0, -1.15, 0);
    scene.add(bullRoot);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.08, 0);
    bullRoot.add(torsoGroup);

    // Sculpted muscular torso + pectoral contours
    const torsoMesh = new THREE.Mesh(createSculptedTorsoGeometry(), furMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    torsoGroup.add(torsoMesh);

    // Sculpted Black Tee & Curved Apron + Tube Straps + Brass Rivets + Crest
    const shirtMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.56, 1.18, 32),
      apronMat
    );
    shirtMesh.scale.set(1.16, 1, 0.8);
    shirtMesh.position.y = -0.05;
    shirtMesh.castShadow = true;
    torsoGroup.add(shirtMesh);

    const apronBib = new THREE.Mesh(
      new THREE.CylinderGeometry(0.66, 0.7, 1.24, 32, 1, false, -0.84, 1.68),
      apronMat
    );
    apronBib.position.set(0, -0.22, 0.055);
    apronBib.scale.set(1.1, 1, 0.8);
    apronBib.castShadow = true;
    torsoGroup.add(apronBib);

    const makeShoulderStrap = (side: -1 | 1) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.3, 0.16, 0.51),
        new THREE.Vector3(side * 0.34, 0.5, 0.38),
        new THREE.Vector3(side * 0.33, 0.65, 0.12),
        new THREE.Vector3(side * 0.28, 0.52, -0.24),
      ]);
      const geo = new THREE.TubeGeometry(curve, 24, 0.044, 10, false);
      const mesh = new THREE.Mesh(geo, strapMat);
      mesh.castShadow = true;
      return mesh;
    };
    torsoGroup.add(makeShoulderStrap(-1), makeShoulderStrap(1));

    const rivetGeo = new THREE.SphereGeometry(0.036, 14, 10);
    const rivetL = new THREE.Mesh(rivetGeo, goldMat);
    rivetL.scale.set(1, 1, 0.55);
    rivetL.position.set(-0.3, 0.17, 0.545);
    const rivetR = new THREE.Mesh(rivetGeo, goldMat);
    rivetR.scale.set(1, 1, 0.55);
    rivetR.position.set(0.3, 0.17, 0.545);
    torsoGroup.add(rivetL, rivetR);

    const crestPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), crestMat);
    crestPlane.position.set(0, 0.0, 0.585);
    torsoGroup.add(crestPlane);

    // Muscular neck blending torso to head
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.48, 0.44, 24),
      furMat
    );
    neckMesh.position.set(0, 0.78, -0.02);
    neckMesh.castShadow = true;
    torsoGroup.add(neckMesh);

    // HEAD GROUP
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.11, 0.04);
    torsoGroup.add(headGroup);

    const sculptedHead = new THREE.Mesh(createSculptedBullHeadGeometry(), furMat);
    sculptedHead.castShadow = true;
    sculptedHead.receiveShadow = true;
    headGroup.add(sculptedHead);

    // Smooth sculpted muzzle nose pad + twin recessed nostrils + gold nose ring
    const nosePad = new THREE.Mesh(createSculptedNosePadGeometry(), snoutMat);
    nosePad.position.set(0, -0.135, 0.535);
    nosePad.castShadow = true;
    headGroup.add(nosePad);

    const nostrilGeo = new THREE.SphereGeometry(0.042, 12, 10);
    const nostrilL = new THREE.Mesh(nostrilGeo, nostrilMat);
    nostrilL.scale.set(1.15, 0.85, 0.65);
    nostrilL.position.set(-0.145, -0.14, 0.685);
    const nostrilR = new THREE.Mesh(nostrilGeo, nostrilMat);
    nostrilR.scale.set(1.15, 0.85, 0.65);
    nostrilR.position.set(0.145, -0.14, 0.685);
    headGroup.add(nostrilL, nostrilR);

    const noseRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.115, 0.024, 16, 36),
      goldMat
    );
    noseRing.position.set(0, -0.255, 0.68);
    noseRing.rotation.x = 0.28;
    headGroup.add(noseRing);

    // Mouth cavity & curved upper teeth
    const mouthCavity = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 14), mouthInnerMat);
    mouthCavity.scale.set(1.06, 0.58, 0.88);
    mouthCavity.position.set(0, -0.245, 0.37);
    headGroup.add(mouthCavity);

    const upperTeeth = createTeethArc(teethMat, 7, 0.195, true);
    upperTeeth.position.set(0, -0.215, 0.34);
    headGroup.add(upperTeeth);

    // Articulated Sculpted Lower Jaw + Tongue + Lower Teeth
    const jawGroup = new THREE.Group();
    jawGroup.position.set(0, -0.23, 0.15);
    headGroup.add(jawGroup);

    const lowerJawMesh = new THREE.Mesh(createSculptedJawGeometry(), snoutMat);
    lowerJawMesh.position.set(0, -0.075, 0.21);
    lowerJawMesh.castShadow = true;
    jawGroup.add(lowerJawMesh);

    const tongueMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), tongueMat);
    tongueMesh.scale.set(1.0, 0.34, 1.38);
    tongueMesh.position.set(0, -0.018, 0.24);
    jawGroup.add(tongueMesh);

    const lowerTeeth = createTeethArc(teethMat, 6, 0.165, false);
    lowerTeeth.position.set(0, -0.012, 0.215);
    jawGroup.add(lowerTeeth);

    // Expressive TV-Commercial Eyes (crisp circular iris + upper/lower eyelids)
    const eyeGeo = createSculptedEyeballGeometry(0.09);
    const upperLidGeo = new THREE.SphereGeometry(
      0.099,
      24,
      14,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.52
    );
    const lowerLidGeo = new THREE.SphereGeometry(
      0.098,
      24,
      14,
      0,
      Math.PI * 2,
      Math.PI * 0.58,
      Math.PI * 0.42
    );

    const buildEyeRig = (xPos: number) => {
      const socket = new THREE.Group();
      socket.position.set(xPos, 0.085, 0.375);
      headGroup.add(socket);

      const aimPivot = new THREE.Group();
      const eyeMesh = new THREE.Mesh(eyeGeo, eyeBallMat);
      aimPivot.add(eyeMesh);
      socket.add(aimPivot);

      const upperLid = new THREE.Mesh(upperLidGeo, furDarkMat);
      upperLid.rotation.x = -0.82;
      socket.add(upperLid);

      const lowerLid = new THREE.Mesh(lowerLidGeo, furDarkMat);
      lowerLid.rotation.x = 0.72;
      socket.add(lowerLid);

      return { aimPivot, upperLid, lowerLid };
    };

    const eyeL = buildEyeRig(-0.185);
    const eyeR = buildEyeRig(0.185);

    // Sculpted Curved Tube Eyebrows
    const browL = createCurvedEyebrow('left', furDarkMat);
    browL.position.set(-0.19, 0.215, 0.425);
    browL.rotation.z = -0.14;
    headGroup.add(browL);

    const browR = createCurvedEyebrow('right', furDarkMat);
    browR.position.set(0.19, 0.215, 0.425);
    browR.rotation.z = 0.14;
    headGroup.add(browR);

    // Sculpted Expressive Ears
    const earGeo = createSculptedEarGeometry();
    const earL = new THREE.Mesh(earGeo, furDarkMat);
    earL.position.set(-0.44, 0.15, -0.02);
    earL.rotation.set(0.12, 0.25, 1.24);
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, furDarkMat);
    earR.position.set(0.44, 0.15, -0.02);
    earR.rotation.set(0.12, -0.25, -1.24);
    headGroup.add(earR);

    // Majestic Tapered Curved 3D Horns with Keratin Ridges
    const leftHornCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.31, 0.31, -0.02),
      new THREE.Vector3(-0.67, 0.37, 0.04),
      new THREE.Vector3(-0.92, 0.67, 0.14),
      new THREE.Vector3(-0.82, 1.03, 0.21),
    ]);
    const rightHornCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.31, 0.31, -0.02),
      new THREE.Vector3(0.67, 0.37, 0.04),
      new THREE.Vector3(0.92, 0.67, 0.14),
      new THREE.Vector3(0.82, 1.03, 0.21),
    ]);
    const leftHorn = new THREE.Mesh(createTaperedHornGeometry(leftHornCurve), hornMat);
    leftHorn.castShadow = true;
    const rightHorn = new THREE.Mesh(createTaperedHornGeometry(rightHornCurve), hornMat);
    rightHorn.castShadow = true;
    headGroup.add(leftHorn, rightHorn);

    // TWO-JOINT MUSCULAR ARMS + 4-FINGER HANDS (Analytic 2-Bone IK)
    const upperArmLen = 0.58;
    const forearmLen = 0.56;
    const upperArmGeo = createMuscularLimbGeometry(upperArmLen, 0.18, 0.205, 0.15);
    const forearmGeo = createMuscularLimbGeometry(forearmLen, 0.15, 0.168, 0.125);
    const shoulderCapGeo = new THREE.SphereGeometry(0.195, 18, 14);
    const elbowCapGeo = new THREE.SphereGeometry(0.145, 16, 12);

    const shoulderCapL = new THREE.Mesh(shoulderCapGeo, furMat);
    shoulderCapL.position.copy(_shoulderL);
    const shoulderCapR = new THREE.Mesh(shoulderCapGeo, furMat);
    shoulderCapR.position.copy(_shoulderR);
    torsoGroup.add(shoulderCapL, shoulderCapR);

    const upperArmL = new THREE.Mesh(upperArmGeo, furMat);
    upperArmL.castShadow = true;
    const elbowJointL = new THREE.Mesh(elbowCapGeo, furMat);
    const forearmL = new THREE.Mesh(forearmGeo, furMat);
    forearmL.castShadow = true;
    const leftHand = createStylizedHand(furDarkMat, hoofMat, 'left');
    leftHand.group.rotation.set(0, 0, Math.PI * 0.5);
    torsoGroup.add(upperArmL, elbowJointL, forearmL, leftHand.group);

    const upperArmR = new THREE.Mesh(upperArmGeo, furMat);
    upperArmR.castShadow = true;
    const elbowJointR = new THREE.Mesh(elbowCapGeo, furMat);
    const forearmR = new THREE.Mesh(forearmGeo, furMat);
    forearmR.castShadow = true;
    const rightHand = createStylizedHand(furDarkMat, hoofMat, 'right');
    rightHand.group.rotation.order = 'YXZ';
    rightHand.group.rotation.set(0, 0, -Math.PI * 0.5);
    torsoGroup.add(upperArmR, elbowJointR, forearmR, rightHand.group);

    // 6. SOLID BEVELED 3-STAGE BITEABLE BURGER
    const burger = createBiteableBurger(burgerMats);
    burger.root.position.set(0, -0.04, 0.88);
    torsoGroup.add(burger.root);

    // 7. 3D CRUMB PARTICLES + RISING GRILL EMBERS
    const crumbs: CrumbParticle[] = [];
    const crumbGeo = new THREE.DodecahedronGeometry(0.036, 0);
    for (let i = 0; i < 24; i++) {
      const mat =
        i % 3 === 0 ? burgerMats.cheese : i % 3 === 1 ? burgerMats.bunTop : burgerMats.patty;
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

    const emberCount = 28;
    const emberGeo = new THREE.SphereGeometry(0.022, 6, 6);
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xffc800 });
    const emberMesh = new THREE.InstancedMesh(emberGeo, emberMat, emberCount);
    emberMesh.frustumCulled = false;
    const emberSeeds = Array.from({ length: emberCount }, () => ({
      x: (Math.random() - 0.5) * 4.6,
      y: -1.1 + Math.random() * 2.9,
      z: -1.9 + Math.random() * 2.7,
      speed: 0.45 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.9,
    }));
    scene.add(emberMesh);

    const spawnCrumbBurst = (originY: number, originZ: number, count = 10) => {
      let spawned = 0;
      for (const c of crumbs) {
        if (!c.active && spawned < count) {
          c.active = true;
          c.life = 0;
          c.maxLife = 0.6 + Math.random() * 0.35;
          c.mesh.visible = true;
          c.mesh.position.set((Math.random() - 0.5) * 0.24, originY, originZ);
          c.mesh.scale.setScalar(0.75 + Math.random() * 0.75);
          c.vx = (Math.random() - 0.5) * 1.9;
          c.vy = 0.75 + Math.random() * 1.35;
          c.vz = 0.55 + Math.random() * 1.1;
          c.rx = (Math.random() - 0.5) * 12;
          c.ry = (Math.random() - 0.5) * 12;
          spawned++;
        }
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Cinematic 4s Choreography Loop (2 Real Bites + Thumbs-Up Approval)
    const clock = new THREE.Clock();
    const dummy = new THREE.Object3D();
    let frameId = 0;
    let disposed = false;
    let currentScene: IntroScene = 1;
    let bite1Triggered = false;
    let bite2Triggered = false;
    let bite3Triggered = false;
    let cameraPunch = 0;

    const setScene = (next: IntroScene) => {
      if (currentScene !== next) {
        currentScene = next;
        onSceneChangeRef.current?.(next);
      }
    };

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const asp = w / Math.max(1, h);
      camera.fov = asp < 0.75 ? 43 : 36;
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

      cameraPunch = THREE.MathUtils.damp(cameraPunch, 0, 12, dt);

      // Default choreography targets
      let targetBurgerY = -0.04;
      let targetBurgerZ = 0.88;
      let targetBurgerRotX = 0.1;
      let targetBurgerRotY = -0.22;
      let targetJawRotX = 0.02;
      let targetHeadRotX = 0.14;
      let targetHeadRotY = 0;
      let targetUpperLid = -0.82;
      let targetLowerLid = 0.72;
      let targetBrowLift = 0.215;
      let targetBrowTilt = 0.14;
      let targetEyePitch = 0.12;
      let targetEyeYaw = 0;
      let targetEarWiggle = 0;
      let targetFingersCurl = 0.05;
      let targetThumbAngle = 0;
      let targetRightHandYaw = 0;
      let targetCamZ = baseCamZ;
      let targetCamY = 0.74;
      let targetCamX = 0;
      let handsHoldBurger = true;

      if (t < 0.82) {
        // Scene 1: Presentation & Appetite — bull holds full burger & eyes it eagerly
        setScene(1);
        targetBurgerY = -0.04 + Math.sin(t * 4.5) * 0.022;
        targetBurgerRotY = -0.25 + Math.sin(t * 2.5) * 0.12;
        targetBrowLift = 0.235;
        targetBrowTilt = 0.08;
        targetEyePitch = 0.22;
        targetCamZ = baseCamZ - t * 0.32;
        targetCamX = Math.sin(t * 1.8) * 0.18;
      } else if (t < 1.94) {
        // Scene 2: FIRST BIG REAL BITE!
        setScene(2);
        const phase = t - 0.82;
        targetBurgerY = 0.74;
        targetBurgerZ = 0.67;
        targetBurgerRotX = -0.22;
        targetBurgerRotY = -0.28;
        targetHeadRotX = 0.16;
        targetCamZ = baseCamZ - 0.62;
        targetCamY = 0.92;
        targetCamX = 0.12;

        if (phase < 0.26) {
          // Anticipation: jaw opens wide, brows lift
          targetJawRotX = 0.56;
          targetBrowLift = 0.24;
          targetEyePitch = 0.06;
        } else if (phase < 0.44) {
          // CHOMP!
          targetJawRotX = 0.04;
          targetBrowTilt = 0.24;
          targetEarWiggle = 0.18;
          if (!bite1Triggered) {
            bite1Triggered = true;
            burger.setStage(1);
            spawnCrumbBurst(0.74, 0.55, 11);
            cameraPunch = 0.14;
          }
        } else {
          // Joyful chew + tilt burger slightly toward camera to display clean solid bite mark!
          targetJawRotX = 0.07 + Math.abs(Math.sin((phase - 0.44) * 16)) * 0.23;
          targetUpperLid = -0.45;
          targetLowerLid = 0.12; // happy ^ ^ squint from below
          targetEarWiggle = Math.sin((phase - 0.44) * 14) * 0.1;
          targetBurgerY = 0.38;
          targetBurgerZ = 0.82;
          targetBurgerRotX = 0.26;
          targetBurgerRotY = -0.34;
          targetHeadRotX = 0.04;
          targetEyePitch = 0.08;
        }
      } else if (t < 3.04) {
        // Scene 3: SECOND REAL BITE + FINAL CRESCENT FINISH!
        setScene(3);
        const phase = t - 1.94;
        targetBurgerY = 0.75;
        targetBurgerZ = 0.66;
        targetBurgerRotX = -0.24;
        targetBurgerRotY = -0.18;
        targetHeadRotX = 0.15;
        targetCamZ = baseCamZ - 0.72;
        targetCamY = 0.94;
        targetCamX = -0.1;

        if (phase < 0.22) {
          targetJawRotX = 0.52;
          targetBrowLift = 0.235;
        } else if (phase < 0.4) {
          targetJawRotX = 0.04;
          targetBrowTilt = 0.22;
          targetEarWiggle = -0.16;
          if (!bite2Triggered) {
            bite2Triggered = true;
            burger.setStage(2);
            spawnCrumbBurst(0.77, 0.54, 10);
            cameraPunch = 0.12;
          }
        } else if (phase < 0.74) {
          targetJawRotX = 0.07 + Math.abs(Math.sin((phase - 0.4) * 17)) * 0.22;
          targetUpperLid = -0.42;
          targetLowerLid = 0.08;
          targetBurgerY = 0.44;
          targetBurgerZ = 0.8;
          targetBurgerRotX = 0.24;
          targetBurgerRotY = -0.22;
          targetEarWiggle = Math.sin((phase - 0.4) * 15) * 0.09;
        } else {
          // Final bite finishes the last crescent piece!
          targetBurgerY = 0.76;
          targetBurgerZ = 0.63;
          if (!bite3Triggered) {
            bite3Triggered = true;
            burger.setStage(3);
            spawnCrumbBurst(0.76, 0.52, 8);
            cameraPunch = 0.09;
          }
          targetJawRotX = 0.06 + Math.abs(Math.sin((phase - 0.74) * 18)) * 0.18;
          targetUpperLid = -0.46;
          targetLowerLid = 0.1;
          handsHoldBurger = false;
          _handTargetL.set(-0.74, -0.22, 0.4);
          _handTargetR.set(0.64, 0.28, 0.62);
        }
      } else {
        // Scene 4: Proud TV-Commercial Thumbs-Up Approval Pose!
        setScene(t < 3.55 ? 4 : 5);
        burger.setStage(3);
        handsHoldBurger = false;
        _handTargetL.set(-0.76, -0.28, 0.36);
        _handTargetR.set(0.6, 0.52, 0.64);
        targetFingersCurl = 1.18; // Fist curl
        targetThumbAngle = 0.22; // Proud extended thumb
        targetRightHandYaw = -0.48;
        targetJawRotX = 0.04;
        targetHeadRotX = -0.05 + Math.sin(t * 7.5) * 0.055; // Approving nod
        targetHeadRotY = -0.14;
        targetEyePitch = -0.02;
        targetEyeYaw = 0.12;
        targetBrowLift = 0.23;
        targetBrowTilt = 0.05;
        targetCamZ = baseCamZ - 0.12;
        targetCamY = 0.78;
        targetCamX = 0;
      }

      // Smooth exponential damping on burger, head, jaw, facial rig & camera
      const k = 13;
      burger.root.position.y = THREE.MathUtils.damp(burger.root.position.y, targetBurgerY, k, dt);
      burger.root.position.z = THREE.MathUtils.damp(burger.root.position.z, targetBurgerZ, k, dt);
      burger.root.rotation.x = THREE.MathUtils.damp(burger.root.rotation.x, targetBurgerRotX, k, dt);
      burger.root.rotation.y = THREE.MathUtils.damp(burger.root.rotation.y, targetBurgerRotY, k, dt);

      if (handsHoldBurger) {
        _handTargetL.set(-0.4, burger.root.position.y - 0.02, burger.root.position.z + 0.01);
        _handTargetR.set(0.4, burger.root.position.y - 0.02, burger.root.position.z + 0.01);
      }

      _currentHandL.x = THREE.MathUtils.damp(_currentHandL.x, _handTargetL.x, 14, dt);
      _currentHandL.y = THREE.MathUtils.damp(_currentHandL.y, _handTargetL.y, 14, dt);
      _currentHandL.z = THREE.MathUtils.damp(_currentHandL.z, _handTargetL.z, 14, dt);

      _currentHandR.x = THREE.MathUtils.damp(_currentHandR.x, _handTargetR.x, 14, dt);
      _currentHandR.y = THREE.MathUtils.damp(_currentHandR.y, _handTargetR.y, 14, dt);
      _currentHandR.z = THREE.MathUtils.damp(_currentHandR.z, _handTargetR.z, 14, dt);

      solveTwoBoneArm(
        _shoulderL,
        _currentHandL,
        _poleL,
        upperArmLen,
        forearmLen,
        upperArmL,
        elbowJointL,
        forearmL,
        leftHand.group
      );
      solveTwoBoneArm(
        _shoulderR,
        _currentHandR,
        _poleR,
        upperArmLen,
        forearmLen,
        upperArmR,
        elbowJointR,
        forearmR,
        rightHand.group
      );

      // Expressive hand fingers & thumb approval pose
      rightHand.fingersPivot.rotation.x = THREE.MathUtils.damp(
        rightHand.fingersPivot.rotation.x,
        targetFingersCurl,
        14,
        dt
      );
      rightHand.thumbPivot.rotation.z = THREE.MathUtils.damp(
        rightHand.thumbPivot.rotation.z,
        targetThumbAngle,
        14,
        dt
      );
      rightHand.group.rotation.y = THREE.MathUtils.damp(
        rightHand.group.rotation.y,
        targetRightHandYaw,
        12,
        dt
      );

      // Facial expressions & head motion
      jawGroup.rotation.x = THREE.MathUtils.damp(jawGroup.rotation.x, targetJawRotX, 18, dt);
      headGroup.rotation.x = THREE.MathUtils.damp(headGroup.rotation.x, targetHeadRotX, 11, dt);
      headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, targetHeadRotY, 11, dt);

      eyeL.upperLid.rotation.x = THREE.MathUtils.damp(eyeL.upperLid.rotation.x, targetUpperLid, 15, dt);
      eyeR.upperLid.rotation.x = THREE.MathUtils.damp(eyeR.upperLid.rotation.x, targetUpperLid, 15, dt);
      eyeL.lowerLid.rotation.x = THREE.MathUtils.damp(eyeL.lowerLid.rotation.x, targetLowerLid, 15, dt);
      eyeR.lowerLid.rotation.x = THREE.MathUtils.damp(eyeR.lowerLid.rotation.x, targetLowerLid, 15, dt);

      eyeL.aimPivot.rotation.x = THREE.MathUtils.damp(eyeL.aimPivot.rotation.x, targetEyePitch, 14, dt);
      eyeR.aimPivot.rotation.x = THREE.MathUtils.damp(eyeR.aimPivot.rotation.x, targetEyePitch, 14, dt);
      eyeL.aimPivot.rotation.y = THREE.MathUtils.damp(eyeL.aimPivot.rotation.y, targetEyeYaw, 14, dt);
      eyeR.aimPivot.rotation.y = THREE.MathUtils.damp(eyeR.aimPivot.rotation.y, targetEyeYaw, 14, dt);

      browL.position.y = THREE.MathUtils.damp(browL.position.y, targetBrowLift, 14, dt);
      browR.position.y = THREE.MathUtils.damp(browR.position.y, targetBrowLift, 14, dt);
      browL.rotation.z = THREE.MathUtils.damp(browL.rotation.z, -targetBrowTilt, 14, dt);
      browR.rotation.z = THREE.MathUtils.damp(browR.rotation.z, targetBrowTilt, 14, dt);

      earL.rotation.z = THREE.MathUtils.damp(earL.rotation.z, 1.24 + targetEarWiggle, 16, dt);
      earR.rotation.z = THREE.MathUtils.damp(earR.rotation.z, -1.24 - targetEarWiggle, 16, dt);

      // Subtle living breath & camera tracking
      torsoGroup.position.y = 1.08 + Math.sin(t * 3.4) * 0.022;
      bullRoot.rotation.y = Math.sin(t * 1.45) * 0.055;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 6, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 6, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ - cameraPunch, 8, dt);
      _tmpVec.set(0, 0.56, 0);
      camera.lookAt(_tmpVec);

      // Active flying 3D crumbs
      for (const c of crumbs) {
        if (!c.active) continue;
        c.life += dt;
        if (c.life >= c.maxLife) {
          c.active = false;
          c.mesh.visible = false;
          continue;
        }
        c.vy -= 5.9 * dt;
        c.mesh.position.x += c.vx * dt;
        c.mesh.position.y += c.vy * dt;
        c.mesh.position.z += c.vz * dt;
        c.mesh.rotation.x += c.rx * dt;
        c.mesh.rotation.y += c.ry * dt;
        const fade = Math.max(0, 1 - c.life / c.maxLife);
        c.mesh.scale.setScalar(fade * 1.08);
      }

      // Rising golden grill embers
      for (let i = 0; i < emberCount; i++) {
        const s = emberSeeds[i];
        const yOffset = ((t * s.speed + s.phase) % 2.9) - 1.1;
        dummy.position.set(s.x + Math.sin(t * 1.5 + s.phase) * 0.16, yOffset, s.z);
        const fadeScale = Math.sin(((yOffset + 1.1) / 2.9) * Math.PI) * s.scale;
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

      textures.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

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
