// js/jester.js
// A jester marionette — counterpart to the knight.
// Three-pointed cap with bells, diamond-patterned tunic, curled shoes, scepter.

export class JesterPuppet {
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

    const accel = this.velX * 0.0007;
    const gravity = -this.angle * 5.0;
    const damping = -this.angleVel * 2.4;
    this.angleVel += (accel + gravity + damping) * dt;
    this.angle += this.angleVel * dt;
    this.angle = clamp(this.angle, -0.5, 0.5);
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

    // --- HEAD ---
    ctx.beginPath();
    ctx.arc(0, 16, 16, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    // eyes
    ctx.beginPath();
    ctx.arc(-5, 15, 1.5, 0, Math.PI * 2);
    ctx.arc(5, 15, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = fillSolid;
    ctx.fill();

    // smile
    ctx.beginPath();
    ctx.arc(0, 20, 4, 0.1, Math.PI - 0.1);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.lineWidth = 1.5;

    // --- THREE-POINTED CAP ---
    const bob = Math.sin(this.t * 2.2) * 2;

    // left point
    ctx.beginPath();
    ctx.moveTo(-14, 6);
    ctx.quadraticCurveTo(-26, -12 + bob, -22, -24 + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-22, -24 + bob, 3, 0, Math.PI * 2);
    ctx.fillStyle = fillSolid;
    ctx.fill();
    ctx.stroke();

    // center point
    ctx.beginPath();
    ctx.moveTo(-4, 2);
    ctx.quadraticCurveTo(0, -20, 2, -30 + bob * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(2, -30 + bob * 0.8, 3, 0, Math.PI * 2);
    ctx.fillStyle = fillSolid;
    ctx.fill();
    ctx.stroke();

    // right point
    ctx.beginPath();
    ctx.moveTo(14, 6);
    ctx.quadraticCurveTo(26, -12 + bob * 1.2, 24, -22 + bob * 1.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(24, -22 + bob * 1.2, 3, 0, Math.PI * 2);
    ctx.fillStyle = fillSolid;
    ctx.fill();
    ctx.stroke();

    // --- COLLAR RUFFLE ---
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = 20 + Math.sin(a * 3 + this.t) * 3;
      const px = Math.cos(a) * r;
      const py = 34 + Math.sin(a) * 8;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    // --- TORSO ---
    ctx.beginPath();
    ctx.moveTo(-18, 38);
    ctx.lineTo(18, 38);
    ctx.lineTo(14, 82);
    ctx.lineTo(-14, 82);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    // diamond pattern
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 42);
    ctx.lineTo(8, 54);
    ctx.lineTo(0, 66);
    ctx.lineTo(-8, 54);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 58);
    ctx.lineTo(6, 68);
    ctx.lineTo(0, 78);
    ctx.lineTo(-6, 68);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 1.5;

    // --- LEFT ARM (waving hand) ---
    const idle1 = Math.sin(this.t * 1.6) * 2;
    ctx.beginPath();
    ctx.moveTo(-18, 40);
    ctx.lineTo(-30, 56 + idle1);
    ctx.lineTo(-26, 72 + idle1);
    ctx.stroke();

    ctx.save();
    ctx.translate(-26, 72 + idle1);
    ctx.rotate(Math.sin(this.t * 2.5) * 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 3, 4);
      ctx.lineTo(i * 4, 10);
      ctx.stroke();
    }
    ctx.restore();

    // --- RIGHT ARM (scepter) ---
    const idle2 = Math.sin(this.t * 1.1 + 2) * 2;
    ctx.beginPath();
    ctx.moveTo(18, 40);
    ctx.lineTo(32, 52 + idle2);
    ctx.lineTo(34, 68 + idle2);
    ctx.stroke();

    ctx.save();
    ctx.translate(34, 68 + idle2);
    ctx.rotate(0.25 + Math.sin(this.t * 0.9) * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 46);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 48, 5, 0, Math.PI * 2);
    ctx.fillStyle = fillSolid;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-3, 54, 2, 0, Math.PI);
    ctx.arc(3, 54, 2, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    // --- LEGS (curled shoes) ---
    const legBob = Math.sin(this.t * 1.3 + 0.5) * 1;
    ctx.beginPath();
    ctx.moveTo(-8, 82);
    ctx.lineTo(-12, 116 + legBob);
    ctx.lineTo(-6, 122 + legBob);
    ctx.quadraticCurveTo(-18, 126 + legBob, -24, 120 + legBob);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 82);
    ctx.lineTo(12, 116 - legBob);
    ctx.lineTo(6, 122 - legBob);
    ctx.quadraticCurveTo(18, 126 - legBob, 24, 120 - legBob);
    ctx.stroke();

    ctx.restore();
  }
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
