// js/knight.js
// A compact knight marionette drawn as white line-art.
// Hangs from a fingertip anchor point with pendulum physics.

export class KnightPuppet {
  constructor() {
    this.anchorX = 0;
    this.anchorY = 0;
    this.velX = 0;
    this.angle = 0;
    this.angleVel = 0;
    this.t = 0;
    this.height = 140;
    this.stringLen = 50;
  }

  update(ax, ay, dt) {
    const prevX = this.anchorX;
    this.anchorX = ax;
    this.anchorY = ay;
    this.velX = (ax - prevX) / Math.max(dt, 0.001);

    const accel = this.velX * 0.0006;
    const gravity = -this.angle * 4.5;
    const damping = -this.angleVel * 2.8;
    this.angleVel += (accel + gravity + damping) * dt;
    this.angle += this.angleVel * dt;
    this.angle = clamp(this.angle, -0.45, 0.45);
    this.t += dt;
  }

  draw(ctx, scale) {
    const s = scale;
    const topX = this.anchorX;
    const topY = this.anchorY + this.stringLen * s;

    ctx.save();
    ctx.translate(topX, topY);
    ctx.rotate(this.angle);
    ctx.scale(s, s);

    const stroke = "rgba(240, 236, 228, 0.9)";
    const fill = "rgba(240, 236, 228, 0.04)";
    const fillSolid = "rgba(240, 236, 228, 0.85)";

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;

    // --- HELM ---
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-20, 18, -15, 32);
    ctx.lineTo(15, 32);
    ctx.quadraticCurveTo(20, 18, 18, 0);
    ctx.quadraticCurveTo(0, -10, -18, 0);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    // visor slit
    ctx.beginPath();
    ctx.moveTo(-12, 14);
    ctx.lineTo(12, 14);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1.5;

    // plume
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(6, -18, 2, -22);
    ctx.quadraticCurveTo(-4, -18, 0, -8);
    ctx.fillStyle = fillSolid;
    ctx.fill();
    ctx.stroke();

    // --- TORSO ---
    ctx.beginPath();
    ctx.moveTo(-20, 36);
    ctx.lineTo(20, 36);
    ctx.lineTo(14, 76);
    ctx.lineTo(0, 82);
    ctx.lineTo(-14, 76);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    // center ridge
    ctx.beginPath();
    ctx.moveTo(0, 38);
    ctx.lineTo(0, 80);
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.lineWidth = 1.5;

    // --- LEFT ARM (shield) ---
    const idleShield = Math.sin(this.t * 1.2) * 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, 38);
    ctx.lineTo(-32, 54 + idleShield);
    ctx.lineTo(-28, 72 + idleShield);
    ctx.stroke();

    // shield
    ctx.save();
    ctx.translate(-30, 72 + idleShield);
    ctx.rotate(-0.12);
    ctx.beginPath();
    ctx.moveTo(-14, -10);
    ctx.lineTo(14, -10);
    ctx.lineTo(12, 12);
    ctx.quadraticCurveTo(0, 20, -12, 12);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
    // cross
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 14);
    ctx.moveTo(-9, 3);
    ctx.lineTo(9, 3);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = fillSolid;
    ctx.stroke();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.restore();

    // --- RIGHT ARM (sword) ---
    const idleSword = Math.sin(this.t * 0.9 + 1) * 1.5;
    ctx.beginPath();
    ctx.moveTo(20, 38);
    ctx.lineTo(34, 50 + idleSword);
    ctx.lineTo(36, 66 + idleSword);
    ctx.stroke();

    // sword
    ctx.save();
    ctx.translate(36, 66 + idleSword);
    ctx.rotate(0.3 + Math.sin(this.t * 0.7) * 0.05);
    ctx.beginPath();
    ctx.rect(-2, -4, 4, 8);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(6, 4);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, 6);
    ctx.lineTo(-1, 56);
    ctx.lineTo(0, 60);
    ctx.lineTo(1, 56);
    ctx.lineTo(2, 6);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(0, 50);
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.restore();

    // --- PAULDRONS ---
    ctx.beginPath();
    ctx.ellipse(-22, 38, 8, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(22, 38, 8, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    // --- LEGS ---
    ctx.beginPath();
    ctx.moveTo(-8, 76);
    ctx.lineTo(-12, 114);
    ctx.lineTo(-6, 122);
    ctx.lineTo(-16, 124);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 76);
    ctx.lineTo(12, 114);
    ctx.lineTo(6, 122);
    ctx.lineTo(16, 124);
    ctx.stroke();

    ctx.restore();
  }
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
