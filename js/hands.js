// js/hands.js
// Thin wrapper around MediaPipe Tasks HandLandmarker.
// Tuned for LOW LATENCY — minimal smoothing, tight loop.

import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export class HandTracker {
  constructor() {
    this.landmarker = null;
    this.video = null;
    this.lastVideoTime = -1;
    this.results = null;

    // Per-hand state: "Left" / "Right" are the USER's physical hands (swapped
    // from MediaPipe's camera-POV labels).
    this.hands = {
      Left: this._empty(),
      Right: this._empty(),
    };

    // MUCH lower smoothing than v1 for responsiveness.
    // 0 = fully raw, 1 = frozen. 0.12 feels snappy but not jittery.
    this.smoothing = 0.12;
    this.lostThresholdMs = 300;
  }

  _empty() {
    return {
      x: 0.5, y: 0.5,
      present: false,
      lastSeen: 0,
      // All 21 landmarks in normalised coords (mirrored to match the displayed
      // mirror-video). Filled on each detection.
      landmarks: null,
    };
  }

  async init(videoEl) {
    this.video = videoEl;
    const resolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    this.landmarker = await HandLandmarker.createFromOptions(resolver, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.55,
      minHandPresenceConfidence: 0.55,
      minTrackingConfidence: 0.45,
    });
  }

  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      audio: false,
    });
    this.video.srcObject = stream;
    await new Promise((r) => {
      this.video.onloadedmetadata = () => { this.video.play(); r(); };
    });
  }

  update(timestampMs) {
    if (!this.landmarker || !this.video || this.video.readyState < 2) return;

    if (this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime;
      this.results = this.landmarker.detectForVideo(this.video, timestampMs);
    }

    if (!this.results) return;

    const seen = { Left: false, Right: false };

    if (this.results.landmarks && this.results.landmarks.length) {
      for (let i = 0; i < this.results.landmarks.length; i++) {
        const lm = this.results.landmarks[i];
        const label = this.results.handednesses?.[i]?.[0]?.categoryName ?? "Right";
        // Swap so names match the user's physical hand (camera is mirrored).
        const key = label === "Left" ? "Right" : "Left";

        const wrist = lm[0];
        const x = 1 - wrist.x; // mirror
        const y = wrist.y;

        const h = this.hands[key];
        const s = this.smoothing;
        h.x = s * h.x + (1 - s) * x;
        h.y = s * h.y + (1 - s) * y;
        h.present = true;
        h.lastSeen = timestampMs;

        // Store mirrored landmarks for fingertip rendering.
        h.landmarks = lm.map((p) => ({ x: 1 - p.x, y: p.y, z: p.z }));

        seen[key] = true;
      }
    }

    for (const key of ["Left", "Right"]) {
      if (!seen[key] && timestampMs - this.hands[key].lastSeen > this.lostThresholdMs) {
        this.hands[key].present = false;
      }
    }
  }

  getHand(side) {
    return this.hands[side];
  }
}
