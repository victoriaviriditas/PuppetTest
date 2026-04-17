// js/strings.js
// Draws a single puppet string from an anchor (fingertip) to the puppet's top.

export function drawString(ctx, fromX, fromY, toX, toY, color) {
  ctx.save();
  ctx.strokeStyle = color || "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";

  const midX = (fromX + toX) / 2 + (toX - fromX) * 0.06;
  const midY = (fromY + toY) / 2;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.quadraticCurveTo(midX, midY, toX, toY);
  ctx.stroke();

  // tiny dot at the fingertip end
  ctx.beginPath();
  ctx.arc(fromX, fromY, 2, 0, Math.PI * 2);
  ctx.fillStyle = color || "rgba(255, 255, 255, 0.6)";
  ctx.fill();

  ctx.restore();
}
