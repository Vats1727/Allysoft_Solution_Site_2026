// Backward-compatible re-export layer.
// The real implementation lives in ./engine.js (rewritten to remove the
// pin-based zoomPin effect that was pushing the Hero section off-screen).
export { initGsap, reveal, parallax, depthScrub, useTilt, useScrollProgress, cursor, onCursorClick, isTouch, prefersReducedMotion } from "./engine";
