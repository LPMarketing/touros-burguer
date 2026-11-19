import * as THREE from 'three';

export interface BullTexturePack {
  furColor: THREE.CanvasTexture;
  furBump: THREE.CanvasTexture;
  eyeIris: THREE.CanvasTexture;
  apronCrest: THREE.CanvasTexture;
  bunTop: THREE.CanvasTexture;
  pattyBump: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

export function createBullTexturePack(maxAnisotropy: number): BullTexturePack {
  // 1. Rich Warm Fur Color & Directional Hair Bump
  const furColorCanvas = document.createElement('canvas');
  furColorCanvas.width = 256;
  furColorCanvas.height = 256;
  const fcCtx = furColorCanvas.getContext('2d');
  if (fcCtx) {
    fcCtx.fillStyle = '#753E1E';
    fcCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const len = 6 + Math.random() * 12;
      const shade = Math.random();
      fcCtx.strokeStyle =
        shade > 0.65 ? '#8E4E27' : shade > 0.25 ? '#653317' : '#4C240E';
      fcCtx.lineWidth = 1.4;
      fcCtx.beginPath();
      fcCtx.moveTo(x, y);
      fcCtx.lineTo(x + (Math.random() - 0.5) * 3.5, y + len);
      fcCtx.stroke();
    }
  }
  const furColor = new THREE.CanvasTexture(furColorCanvas);
  furColor.colorSpace = THREE.SRGBColorSpace;
  furColor.wrapS = THREE.RepeatWrapping;
  furColor.wrapT = THREE.RepeatWrapping;
  furColor.repeat.set(2, 2);
  furColor.anisotropy = maxAnisotropy;

  const furBumpCanvas = document.createElement('canvas');
  furBumpCanvas.width = 256;
  furBumpCanvas.height = 256;
  const fbCtx = furBumpCanvas.getContext('2d');
  if (fbCtx) {
    fbCtx.fillStyle = '#808080';
    fbCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2200; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const len = 6 + Math.random() * 11;
      const v = Math.floor(90 + Math.random() * 100);
      fbCtx.strokeStyle = `rgb(${v},${v},${v})`;
      fbCtx.lineWidth = 1.3;
      fbCtx.beginPath();
      fbCtx.moveTo(x, y);
      fbCtx.lineTo(x + (Math.random() - 0.5) * 3, y + len);
      fbCtx.stroke();
    }
  }
  const furBump = new THREE.CanvasTexture(furBumpCanvas);
  furBump.wrapS = THREE.RepeatWrapping;
  furBump.wrapT = THREE.RepeatWrapping;
  furBump.repeat.set(2, 2);

  // 2. Expressive TV-Commercial Eye Iris Texture (Warm Amber-Brown + Pupil + Specular)
  const eyeCanvas = document.createElement('canvas');
  eyeCanvas.width = 256;
  eyeCanvas.height = 256;
  const eCtx = eyeCanvas.getContext('2d');
  if (eCtx) {
    eCtx.fillStyle = '#FBF9F4';
    eCtx.fillRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    // Outer iris limbal ring
    const irisGrad = eCtx.createRadialGradient(cx, cy, 18, cx, cy, 68);
    irisGrad.addColorStop(0, '#D48A1D');
    irisGrad.addColorStop(0.55, '#8A490D');
    irisGrad.addColorStop(0.88, '#3B1B06');
    irisGrad.addColorStop(1, '#1A0B03');
    eCtx.fillStyle = irisGrad;
    eCtx.beginPath();
    eCtx.arc(cx, cy, 66, 0, Math.PI * 2);
    eCtx.fill();

    // Subtle radial iris fibers
    eCtx.strokeStyle = 'rgba(255, 210, 90, 0.25)';
    eCtx.lineWidth = 1.5;
    for (let a = 0; a < 36; a++) {
      const ang = (a / 36) * Math.PI * 2;
      eCtx.beginPath();
      eCtx.moveTo(cx + Math.cos(ang) * 28, cy + Math.sin(ang) * 28);
      eCtx.lineTo(cx + Math.cos(ang) * 58, cy + Math.sin(ang) * 58);
      eCtx.stroke();
    }

    // Crisp pupil
    eCtx.fillStyle = '#090604';
    eCtx.beginPath();
    eCtx.arc(cx, cy, 30, 0, Math.PI * 2);
    eCtx.fill();

    // Crisp animated-look studio catchlight
    eCtx.fillStyle = '#FFFFFF';
    eCtx.beginPath();
    eCtx.arc(cx - 18, cy - 20, 11, 0, Math.PI * 2);
    eCtx.fill();
    eCtx.beginPath();
    eCtx.arc(cx + 15, cy + 16, 4.5, 0, Math.PI * 2);
    eCtx.fill();
  }
  const eyeIris = new THREE.CanvasTexture(eyeCanvas);
  eyeIris.colorSpace = THREE.SRGBColorSpace;
  eyeIris.anisotropy = maxAnisotropy;

  // 3. Touros Burguer Apron Crest Texture
  const crestCanvas = document.createElement('canvas');
  crestCanvas.width = 256;
  crestCanvas.height = 256;
  const cCtx = crestCanvas.getContext('2d');
  if (cCtx) {
    cCtx.clearRect(0, 0, 256, 256);
    cCtx.fillStyle = '#121211';
    cCtx.beginPath();
    cCtx.arc(128, 128, 108, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.strokeStyle = '#FFD000';
    cCtx.lineWidth = 8;
    cCtx.beginPath();
    cCtx.arc(128, 128, 98, 0, Math.PI * 2);
    cCtx.stroke();

    cCtx.fillStyle = '#FFD000';
    cCtx.beginPath();
    cCtx.moveTo(64, 72);
    cCtx.quadraticCurveTo(56, 114, 88, 124);
    cCtx.lineTo(82, 174);
    cCtx.quadraticCurveTo(86, 198, 128, 198);
    cCtx.quadraticCurveTo(170, 198, 174, 174);
    cCtx.lineTo(168, 124);
    cCtx.quadraticCurveTo(200, 114, 192, 72);
    cCtx.quadraticCurveTo(174, 100, 148, 102);
    cCtx.lineTo(108, 102);
    cCtx.quadraticCurveTo(82, 100, 64, 72);
    cCtx.closePath();
    cCtx.fill();

    cCtx.fillStyle = '#121211';
    cCtx.beginPath();
    cCtx.arc(106, 142, 8, 0, Math.PI * 2);
    cCtx.arc(150, 142, 8, 0, Math.PI * 2);
    cCtx.fill();
  }
  const apronCrest = new THREE.CanvasTexture(crestCanvas);
  apronCrest.colorSpace = THREE.SRGBColorSpace;
  apronCrest.anisotropy = maxAnisotropy;

  // 4. Toasted Brioche Bun Crown Texture
  const bunCanvas = document.createElement('canvas');
  bunCanvas.width = 256;
  bunCanvas.height = 256;
  const bCtx = bunCanvas.getContext('2d');
  if (bCtx) {
    const grad = bCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#BA5C12');
    grad.addColorStop(0.4, '#E88F2E');
    grad.addColorStop(0.85, '#F5AA47');
    grad.addColorStop(1, '#F8CB7E');
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, 256, 256);
  }
  const bunTop = new THREE.CanvasTexture(bunCanvas);
  bunTop.colorSpace = THREE.SRGBColorSpace;

  // 5. Seared Patty Char Bump
  const pattyCanvas = document.createElement('canvas');
  pattyCanvas.width = 128;
  pattyCanvas.height = 128;
  const pCtx = pattyCanvas.getContext('2d');
  if (pCtx) {
    pCtx.fillStyle = '#707070';
    pCtx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 650; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const r = 1 + Math.random() * 3;
      const v = Math.floor(40 + Math.random() * 140);
      pCtx.fillStyle = `rgb(${v},${v},${v})`;
      pCtx.beginPath();
      pCtx.arc(x, y, r, 0, Math.PI * 2);
      pCtx.fill();
    }
  }
  const pattyBump = new THREE.CanvasTexture(pattyCanvas);
  pattyBump.wrapS = THREE.RepeatWrapping;
  pattyBump.wrapT = THREE.RepeatWrapping;

  // 6. Contact Shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);
  }
  const contactShadow = new THREE.CanvasTexture(shadowCanvas);
  contactShadow.colorSpace = THREE.SRGBColorSpace;

  return {
    furColor,
    furBump,
    eyeIris,
    apronCrest,
    bunTop,
    pattyBump,
    contactShadow,
    dispose: () => {
      furColor.dispose();
      furBump.dispose();
      eyeIris.dispose();
      apronCrest.dispose();
      bunTop.dispose();
      pattyBump.dispose();
      contactShadow.dispose();
    },
  };
}
