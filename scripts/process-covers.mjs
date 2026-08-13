// Convert the user's designed covers (Project 4-8) to WebP in public/works/.
// These are full designed cards (visual + baked-in title + Explore), so we keep
// them full-size (no crop) and resize to max 1600px width.
import sharp from 'sharp';

const sources = [
  { src: 'C:/Users/l/Desktop/figam/替换文件/封面/Project 4.png', out: 'C:/Users/l/Desktop/figam/website/public/works/cover-yze.webp',       name: 'YZE / Yangtze' },
  { src: 'C:/Users/l/Desktop/figam/替换文件/封面/Project 5.jpg', out: 'C:/Users/l/Desktop/figam/website/public/works/cover-yingge.webp',    name: 'Yingge / HERO TEA' },
  { src: 'C:/Users/l/Desktop/figam/替换文件/封面/Project 6.png', out: 'C:/Users/l/Desktop/figam/website/public/works/cover-display.webp',   name: 'Display & Spatial' },
  { src: 'C:/Users/l/Desktop/figam/替换文件/封面/Project 7.png', out: 'C:/Users/l/Desktop/figam/website/public/works/cover-dinosaur.webp',  name: 'Changzhou Dinosaur' },
  { src: 'C:/Users/l/Desktop/figam/替换文件/封面/Project 8.jpg', out: 'C:/Users/l/Desktop/figam/website/public/works/cover-pickleball.webp', name: 'M+ Pickleball' },
];

for (const { src, out, name } of sources) {
  await sharp(src)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`✓ ${name} → ${out}`);
}
console.log('Done.');