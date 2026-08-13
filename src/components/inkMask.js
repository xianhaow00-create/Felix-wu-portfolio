// inkMask.js — irregular ink-wash (水墨) cursor mask as an SVG data URI.
//
// Replaces the old perfect-circle radial-gradient mask. The reveal hole
// (CursorMask) and the petal-exclusion (CursorBloom) now share ONE organic
// blob shape: a radial gradient (deep, opaque centre → light, transparent
// edge — 从中心到外围，深到浅) clipped by an feTurbulence + feDisplacementMap
// filter so the edge reads like ink spreading on paper. Fixed seed → the
// shape is random-looking but STABLE across refreshes (no flicker).
//
//   - For the reveal hole, use inkMaskURL(R) directly (opaque centre shows
//     the bright video; transparent edge shows the dim base).
//   - For the petal layer, pair it with a solid full-cover mask and
//     `mask-composite: subtract` so petals render everywhere EXCEPT the blob
//     (i.e. outside the Lithos reveal hole). Both layers must use the same
//     R + seed so the two shapes line up pixel-for-pixel.

const SEED = 7; // fixed turbulence seed — "random" but deterministic

export function inkTileSize(R) {
  // feDisplacementMap (scale ~60) can push the edge well past the circle,
  // so pad the tile generously on every side.
  return Math.ceil((R + 96) * 2);
}

export function inkMaskURL(R) {
  const size = inkTileSize(R);
  const c = size / 2;
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
    '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<defs>' +
        '<radialGradient id="g" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" stop-color="#000" stop-opacity="1"/>' +
          '<stop offset="50%" stop-color="#000" stop-opacity="1"/>' +
          '<stop offset="74%" stop-color="#000" stop-opacity="0.82"/>' +
          '<stop offset="100%" stop-color="#000" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<filter id="ink" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">' +
          '<feTurbulence type="fractalNoise" baseFrequency="0.013 0.017" numOctaves="3" seed="' + SEED + '" result="n"/>' +
          '<feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
      '</defs>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + R + '" fill="url(#g)" filter="url(#ink)"/>' +
    '</svg>';
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
}
