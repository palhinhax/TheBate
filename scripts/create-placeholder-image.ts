import { writeFileSync } from "fs";
import { join } from "path";

// Create a simple SVG placeholder image (1200x630 - optimal for OG images)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#000000"/>
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
    TheBate
  </text>
</svg>`;

const outputPath = join(process.cwd(), "public", "images", "placeholder-topic.svg");

try {
  writeFileSync(outputPath, svg, "utf-8");
  console.log(`✅ Placeholder image created: ${outputPath}`);
} catch (error) {
  console.error(`❌ Error creating placeholder image:`, error);
  process.exit(1);
}
