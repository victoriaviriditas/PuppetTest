# Marionette

> Lift your hands. Watch them dance.

A browser-based puppet theater overlaid on your live webcam feed. A knight hangs from your left hand, a jester from your right — each dangling from your fingertips by white threads. No install, no build step, no server. Pure client-side.

## What it does

- Your webcam fills the screen — desaturated and darkened into a cinematic stage.
- Two white line-art puppets appear, each hanging from a fingertip by visible strings.
- **Left hand** → a medieval knight with sword and shield.
- **Right hand** → a jester with cap, bells, scepter, and curled shoes.
- Each puppet swings on a pendulum — move your hand sideways and the puppet sways realistically.
- Move your hand up or down and the puppet follows, bobbing from the string.
- When your hand leaves the frame, the puppet fades naturally.

## Run it

Serve the folder over HTTP (browsers block camera + ES modules on `file://`):

```bash
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` in Chrome. Click **Begin**. Grant camera access. Lift your hands.

## Deploy to GitHub Pages

1. Push to GitHub.
2. Settings → Pages → Deploy from branch → `main` / `root`.
3. Done. Your live URL will be `https://YOUR-USERNAME.github.io/marionette/`.

## Files

```
├── index.html          Page shell
├── css/styles.css      Full-bleed webcam aesthetic
├── js/main.js          Render loop, fingertip → puppet mapping
├── js/hands.js         MediaPipe hand tracker (low-latency tuned)
├── js/knight.js        Knight puppet — helm, sword, shield
├── js/jester.js        Jester puppet — cap, bells, scepter
└── js/strings.js       String renderer (quadratic bézier)
```

## Responsiveness

v2 is tuned for low latency:
- Smoothing dropped to 0.12 (from 0.35 in v1).
- Confidence thresholds tuned for faster detection.
- Canvas draws only what's needed — no full-scene re-render.
- Puppets use simple pendulum physics instead of multi-bone IK — much cheaper per frame.

## Tweakable knobs

- **Smoothing**: `HandTracker.smoothing` in `js/hands.js`. Lower = snappier. 0.12 is the default.
- **String length**: `stringLen` in each puppet class. Controls how far below the fingertip the puppet hangs.
- **Puppet scale**: auto-adapts to viewport, but the `clamp()` range in `main.js` can be adjusted.
- **Pendulum bounciness**: the `accel`, `gravity`, `damping` constants in each puppet's `update()`.
- **Video filter**: the `filter` property on `#webcam` in `styles.css` — try different `saturate` / `brightness` / `contrast` values.

## License

MIT. Do whatever you want.
