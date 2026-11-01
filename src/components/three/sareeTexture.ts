import * as THREE from "three";
import type { Colorway, Motif } from "@/data/types";

/**
 * Paints a saree onto canvases for the 3D cloth:
 * - `map`: the colour texture (body, zari motifs, side borders, pallu)
 * - `mask`: green = roughness, blue = metalness, so zari shines like metal
 *   while the silk body stays soft.
 */

const W = 1024;
const H = 1536;
const BORDER = 96;
const PALLU_START = H * 0.66;

type Paint = {
  base: string;
  border: string;
  zari: string | CanvasGradient;
  accent: string;
};

// ── Motif shapes, drawn centred on (0,0), roughly 40px across ──
function drawMotif(ctx: CanvasRenderingContext2D, motif: Motif, fill: Paint["zari"], s = 1) {
  ctx.save();
  ctx.scale(s, s);
  ctx.fillStyle = fill;
  ctx.strokeStyle = fill;
  ctx.lineWidth = 2.4;
  switch (motif) {
    case "buta": {
      // Flame-shaped buta with two leaves
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.bezierCurveTo(9, -8, 9, 6, 0, 12);
      ctx.bezierCurveTo(-9, 6, -9, -8, 0, -18);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.quadraticCurveTo(-14, 10, -16, 0);
      ctx.quadraticCurveTo(-6, 2, 0, 12);
      ctx.moveTo(0, 12);
      ctx.quadraticCurveTo(14, 10, 16, 0);
      ctx.quadraticCurveTo(6, 2, 0, 12);
      ctx.fill();
      break;
    }
    case "temple": {
      ctx.beginPath();
      ctx.moveTo(-14, 12);
      ctx.lineTo(0, -16);
      ctx.lineTo(14, 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(-16, 13, 32, 3);
      break;
    }
    case "checks": {
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "jaal": {
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(20, 0);
      ctx.lineTo(0, 20);
      ctx.lineTo(-20, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "paisley": {
      ctx.beginPath();
      ctx.moveTo(4, -18);
      ctx.bezierCurveTo(22, -10, 18, 14, 2, 16);
      ctx.bezierCurveTo(-14, 18, -16, 2, -6, -2);
      ctx.bezierCurveTo(2, -6, 6, 4, 0, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4, 4, 3.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "stripes": {
      ctx.fillRect(-1.5, -22, 3, 44);
      break;
    }
  }
  ctx.restore();
}

function paintSaree(ctx: CanvasRenderingContext2D, motif: Motif, p: Paint) {
  // Body
  ctx.fillStyle = p.base;
  ctx.fillRect(0, 0, W, H);

  // Body motifs, staggered grid (checks/stripes get their own treatment)
  const bodyLeft = BORDER + 20;
  const bodyRight = W - BORDER - 20;
  if (motif === "checks") {
    ctx.strokeStyle = p.zari;
    ctx.lineWidth = 2;
    for (let x = bodyLeft; x < bodyRight; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, PALLU_START);
      ctx.stroke();
    }
    for (let y = 32; y < PALLU_START; y += 64) {
      ctx.beginPath();
      ctx.moveTo(BORDER, y);
      ctx.lineTo(W - BORDER, y);
      ctx.stroke();
    }
  } else if (motif === "stripes") {
    for (let x = bodyLeft; x < bodyRight; x += 56) {
      ctx.fillStyle = p.zari;
      ctx.fillRect(x, 0, 3, PALLU_START);
      ctx.fillRect(x + 8, 0, 1.5, PALLU_START);
    }
  } else {
    let row = 0;
    for (let y = 50; y < PALLU_START - 40; y += 86) {
      const offset = row % 2 ? 48 : 0;
      for (let x = bodyLeft + 30 + offset; x < bodyRight - 20; x += 96) {
        ctx.save();
        ctx.translate(x, y);
        drawMotif(ctx, motif, p.zari, 0.9);
        ctx.restore();
      }
      row++;
    }
  }

  // Side borders: run the length of the saree
  for (const x0 of [0, W - BORDER]) {
    ctx.fillStyle = p.border;
    ctx.fillRect(x0, 0, BORDER, H);
    ctx.fillStyle = p.zari;
    ctx.fillRect(x0 + 10, 0, 3, H);
    ctx.fillRect(x0 + BORDER - 13, 0, 3, H);
    // Row of temple triangles pointing into the body
    const inward = x0 === 0 ? 1 : -1;
    const baseX = x0 === 0 ? BORDER - 18 : W - BORDER + 18;
    ctx.beginPath();
    for (let y = 0; y < H; y += 28) {
      ctx.moveTo(baseX, y);
      ctx.lineTo(baseX + inward * 24, y + 14);
      ctx.lineTo(baseX, y + 28);
    }
    ctx.fill();
    // Small butis inside the border
    for (let y = 30; y < H; y += 70) {
      ctx.save();
      ctx.translate(x0 + BORDER / 2 - (x0 === 0 ? 8 : -8), y);
      drawMotif(ctx, "checks", p.accent, 1);
      ctx.restore();
    }
  }

  // Pallu: the richly woven end piece
  ctx.fillStyle = p.border;
  ctx.fillRect(0, PALLU_START, W, H - PALLU_START);
  const bands = [PALLU_START + 8, PALLU_START + 40, H - 60, H - 24];
  ctx.fillStyle = p.zari;
  for (const y of bands) ctx.fillRect(0, y, W, 6);
  // Temple row across the top of the pallu
  ctx.beginPath();
  for (let x = 0; x < W; x += 36) {
    ctx.moveTo(x, PALLU_START + 40);
    ctx.lineTo(x + 18, PALLU_START + 14);
    ctx.lineTo(x + 36, PALLU_START + 40);
  }
  ctx.fill();
  // Dense motif field
  let row = 0;
  for (let y = PALLU_START + 90; y < H - 80; y += 62) {
    const offset = row % 2 ? 34 : 0;
    for (let x = 30 + offset; x < W; x += 68) {
      ctx.save();
      ctx.translate(x, y);
      drawMotif(ctx, motif === "checks" || motif === "stripes" ? "buta" : motif, p.zari, 1.15);
      ctx.restore();
    }
    row++;
  }
}

function makeZariGradient(ctx: CanvasRenderingContext2D, colorway: Colorway) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, colorway.accent);
  g.addColorStop(0.35, "#c09a4c");
  g.addColorStop(0.55, colorway.accent);
  g.addColorStop(1, "#9c7a36");
  return g;
}

export function createSareeTextures(colorway: Colorway, motif: Motif) {
  // Colour map
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = W;
  colorCanvas.height = H;
  const cctx = colorCanvas.getContext("2d")!;
  paintSaree(cctx, motif, {
    base: colorway.base,
    border: colorway.border,
    zari: makeZariGradient(cctx, colorway),
    accent: colorway.accent,
  });
  // Fine weave texture: thin warp lines and a little noise
  cctx.globalAlpha = 0.06;
  cctx.fillStyle = "#000";
  for (let x = 0; x < W; x += 3) cctx.fillRect(x, 0, 1, H);
  cctx.globalAlpha = 1;

  // Roughness (G) / metalness (B) mask: silk = soft, zari = shiny metal
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = W;
  maskCanvas.height = H;
  const mctx = maskCanvas.getContext("2d")!;
  const silk = "rgb(0,160,0)";
  paintSaree(mctx, motif, { base: silk, border: silk, zari: "rgb(0,55,255)", accent: silk });

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const mask = new THREE.CanvasTexture(maskCanvas);
  mask.anisotropy = 8;
  return { map, mask };
}
