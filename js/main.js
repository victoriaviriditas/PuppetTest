// js/main.js
import { HandTracker } from "./hands.js";
import { KnightPuppet } from "./knight.js";
import { JesterPuppet } from "./jester.js";
import { drawString } from "./strings.js";

// --- DOM ---
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const video = document.getElementById("webcam");
const startBtn = document.getElementById("startBtn");
const startOverlay = document.getElementById("startOverlay");
const statusEl = document.getElementById("status");

// --- State ---
const tracker = new HandTracker();
const knight = new KnightPuppet();
const jester = new JesterPuppet();

let running = false;
let lastFrame = performance.now();

// --- Canvas sizing ---
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

// --- Start ---
startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  statusEl.textContent = "loading";
  try {
    await tracker.init(video);
    statusEl.textContent = "camera";
    await tracker.startCamera();
    startOverlay.classList.add("hidden");
    document.body.classList.add("live");
    statusEl.textContent = "live";
    running = true;
    requestAnimationFrame(loop);
  } catch (err) {
    console.error(err);
    statusEl.textContent = "camera blocked";
    startBtn.disabled = false;
  }
});

// --- Fingertip landmark indices ---
// Primary hang point: middle fingertip (landmark 12).
// Secondary string: index fingertip (landmark 8).
const PRIMARY_TIP = 12;
const SECONDARY_TIP = 8;

// --- Render loop ---
function loop(now) {
  if (!running) return;
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  tracker.update(now);

  const W = canvas.width / (window.devicePixelRatio || 1);
  const H = canvas.height / (window.devicePixelRatio || 1);

  ctx.clearRect(0, 0, W, H);

  const leftHand = tracker.getHand("Left");
  const rightHand = tracker.getHand("Right");

  // Puppet scale adapts to viewport height.
  const puppetScale = clamp(H / 900, 0.6, 1.4);

  // --- Knight (left hand) ---
  if (leftHand.present && leftHand.landmarks) {
    const tip = leftHand.landmarks[PRIMARY_TIP];
    const tip2 = leftHand.landmarks[SECONDARY_TIP];
    const ax = tip.x * W;
    const ay = tip.y * H;

    knight.update(ax, ay, dt);

    // String from fingertip to puppet top.
    const puppetTopX = knight.anchorX;
    const puppetTopY = knight.anchorY + knight.stringLen * puppetScale;
    drawString(ctx, ax, ay, puppetTopX, puppetTopY, "rgba(255,255,255,0.55)");

    // Secondary string from index fingertip to puppet's shoulder area.
    const ax2 = tip2.x * W;
    const ay2 = tip2.y * H;
    const shoulderY = puppetTopY + 38 * puppetScale;
    const shoulderX = puppetTopX - 10 * puppetScale;
    drawString(ctx, ax2, ay2, shoulderX, shoulderY, "rgba(255,255,255,0.3)");

    knight.draw(ctx, puppetScale);
    drawGlow(ctx, ax, ay);
  } else {
    // Pendulum damps naturally when hand is gone.
    knight.update(knight.anchorX, knight.anchorY, dt);
  }

  // --- Jester (right hand) ---
  if (rightHand.present && rightHand.landmarks) {
    const tip = rightHand.landmarks[PRIMARY_TIP];
    const tip2 = rightHand.landmarks[SECONDARY_TIP];
    const ax = tip.x * W;
    const ay = tip.y * H;

    jester.update(ax, ay, dt);

    const puppetTopX = jester.anchorX;
    const puppetTopY = jester.anchorY + jester.stringLen * puppetScale;
    drawString(ctx, ax, ay, puppetTopX, puppetTopY, "rgba(255,255,255,0.55)");

    const ax2 = tip2.x * W;
    const ay2 = tip2.y * H;
    const shoulderY = puppetTopY + 38 * puppetScale;
    const shoulderX = puppetTopX + 10 * puppetScale;
    drawString(ctx, ax2, ay2, shoulderX, shoulderY, "rgba(255,255,255,0.3)");

    jester.draw(ctx, puppetScale);
    drawGlow(ctx, ax, ay);
  } else {
    jester.update(jester.anchorX, jester.anchorY, dt);
  }

  // If neither hand is present, show a gentle prompt.
  if (!leftHand.present && !rightHand.present) {
    drawIdlePrompt(ctx, W, H, now);
  }

  requestAnimationFrame(loop);
}

// --- Effects ---

function drawGlow(ctx, x, y) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, 40);
  g.addColorStop(0, "rgba(240, 236, 228, 0.18)");
  g.addColorStop(1, "rgba(240, 236, 228, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 40, 0, Math.PI * 2);
  ctx.fill();
}

function drawIdlePrompt(ctx, W, H, now) {
  const alpha = 0.25 + Math.sin(now * 0.002) * 0.12;
  ctx.save();
  ctx.fillStyle = `rgba(240, 236, 228, ${alpha})`;
  ctx.font = "300 13px 'DM Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("RAISE YOUR HANDS", W / 2, H / 2);
  ctx.restore();
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
