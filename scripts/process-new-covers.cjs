// Convert the 6 replacement project covers to WebP and crop Project 5's baked-in text.
// Source: 替换文件/封面/Project {4,5,6,7,8,9}.{png,jpg}
// Output: public/works/cover-*.webp
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = 'C:/Users/l/Desktop/figam/替换文件/封面';
const OUT_DIR = 'C:/Users/l/Desktop/figam/website/public/works';

// [srcName, outName, cropRatio (0 = no crop, 0..1 = left fraction to drop)]
const FILES = [
  { src: 'Project 4.png', out: 'cover-yze.webp',       drop: 0 },          // full bleed
  { src: 'Project 5.jpg', out: 'cover-weaving.webp',   drop: 0.50 },       // crop left text portion
  { src: 'Project 6.png', out: 'cover-yingge.webp',    drop: 0 },
  { src: 'Project 7.png', out: 'cover-display.webp',   drop: 0 },
  { src: 'Project 8.jpg', out: 'cover-dinosaur.webp',  drop: 0 },
  { src: 'Project 9.png', out: 'cover-pickleball.webp',drop: 0 },
];

(async () => {
  for (const f of FILES) {
    const src = path.join(SRC_DIR, f.src);
    const out = path.join(OUT_DIR, f.out);
    if (!fs.existsSync(src)) { console.error('MISSING', src); continue; }
    let pipe = sharp(src).rotate(); // honour EXIF orientation
    if (f.drop > 0) {
      const meta = await sharp(src).metadata();
      const w = Math.round(meta.width * (1 - f.drop));
      pipe = pipe.extract({ left: Math.round(meta.width * f.drop), top: 0, width: w, height: meta.height });
    }
    await pipe
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(out);
    const stat = fs.statSync(out);
    console.log(`✓ ${f.out}  ${(stat.size/1024).toFixed(1)} KB`);
  }
})();