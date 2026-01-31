/**
 * Generate placeholder hero images for parallax layers
 *
 * These are temporary placeholders that demonstrate the parallax effect.
 * Replace with actual Unsplash photography before production.
 *
 * Run: node scripts/generate-hero-placeholders.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const heroDir = join(__dirname, '..', 'src', 'assets', 'images', 'hero');

// Image dimensions for parallax layers
const WIDTH = 1920;
const HEIGHT = 1080;

// Warm minimalist color palette from design tokens
const colors = {
  background: '#EBE8E1',  // Taupe tint - furthest layer
  midground: '#D4A87A',   // Warm sand - middle layer
  foreground: '#8B7355',  // Warm brown - closest layer
  accent: '#E87B4E',      // Coral accent
};

/**
 * Create a gradient image with layered depth effect
 */
async function createLayerImage(filename, primaryColor, secondaryColor, pattern = 'gradient') {
  // Create SVG with gradient and depth pattern
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#skyGradient)"/>
      ${pattern === 'mountains' ? `
        <path d="M0,${HEIGHT * 0.7} L${WIDTH * 0.15},${HEIGHT * 0.4} L${WIDTH * 0.3},${HEIGHT * 0.55} L${WIDTH * 0.5},${HEIGHT * 0.25} L${WIDTH * 0.7},${HEIGHT * 0.5} L${WIDTH * 0.85},${HEIGHT * 0.35} L${WIDTH},${HEIGHT * 0.6} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z" fill="${secondaryColor}" opacity="0.4"/>
        <path d="M0,${HEIGHT * 0.8} L${WIDTH * 0.2},${HEIGHT * 0.5} L${WIDTH * 0.4},${HEIGHT * 0.65} L${WIDTH * 0.6},${HEIGHT * 0.4} L${WIDTH * 0.8},${HEIGHT * 0.6} L${WIDTH},${HEIGHT * 0.5} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z" fill="${secondaryColor}" opacity="0.6"/>
      ` : ''}
      ${pattern === 'hills' ? `
        <ellipse cx="${WIDTH * 0.3}" cy="${HEIGHT}" rx="${WIDTH * 0.5}" ry="${HEIGHT * 0.4}" fill="${secondaryColor}" opacity="0.5"/>
        <ellipse cx="${WIDTH * 0.7}" cy="${HEIGHT}" rx="${WIDTH * 0.6}" ry="${HEIGHT * 0.35}" fill="${secondaryColor}" opacity="0.6"/>
        <ellipse cx="${WIDTH * 0.5}" cy="${HEIGHT}" rx="${WIDTH * 0.4}" ry="${HEIGHT * 0.3}" fill="${secondaryColor}" opacity="0.7"/>
      ` : ''}
      ${pattern === 'silhouettes' ? `
        <rect x="${WIDTH * 0.35}" y="${HEIGHT * 0.45}" width="${WIDTH * 0.02}" height="${HEIGHT * 0.35}" rx="10" fill="${secondaryColor}" opacity="0.8"/>
        <circle cx="${WIDTH * 0.36}" cy="${HEIGHT * 0.43}" r="${WIDTH * 0.025}" fill="${secondaryColor}" opacity="0.8"/>
        <rect x="${WIDTH * 0.45}" y="${HEIGHT * 0.5}" width="${WIDTH * 0.02}" height="${HEIGHT * 0.32}" rx="10" fill="${secondaryColor}" opacity="0.8"/>
        <circle cx="${WIDTH * 0.46}" cy="${HEIGHT * 0.48}" r="${WIDTH * 0.023}" fill="${secondaryColor}" opacity="0.8"/>
        <rect x="${WIDTH * 0.55}" y="${HEIGHT * 0.47}" width="${WIDTH * 0.02}" height="${HEIGHT * 0.34}" rx="10" fill="${secondaryColor}" opacity="0.8"/>
        <circle cx="${WIDTH * 0.56}" cy="${HEIGHT * 0.45}" r="${WIDTH * 0.024}" fill="${secondaryColor}" opacity="0.8"/>
        <rect x="${WIDTH * 0.65}" y="${HEIGHT * 0.52}" width="${WIDTH * 0.02}" height="${HEIGHT * 0.30}" rx="10" fill="${secondaryColor}" opacity="0.8"/>
        <circle cx="${WIDTH * 0.66}" cy="${HEIGHT * 0.50}" r="${WIDTH * 0.022}" fill="${secondaryColor}" opacity="0.8"/>
      ` : ''}
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 85, progressive: true })
    .toFile(join(heroDir, filename));

  console.log(`Created ${filename}`);
}

async function main() {
  // Ensure directory exists
  await mkdir(heroDir, { recursive: true });

  // Layer 3 - Background: Distant mountains with sky gradient
  // This layer moves slowest in parallax, creating depth
  await createLayerImage(
    'layer-3-background.jpg',
    '#C5D8E8',  // Sky blue-gray
    '#EBE8E1',  // Warm beige
    'mountains'
  );

  // Layer 2 - Midground: Rolling hills
  // This layer moves at medium speed
  await createLayerImage(
    'layer-2-midground.jpg',
    '#D4CABC',  // Warm mist
    '#A89282',  // Warm brown
    'hills'
  );

  // Layer 1 - Foreground: Traveler silhouettes
  // This layer moves fastest, closest to viewer
  await createLayerImage(
    'layer-1-foreground.jpg',
    '#F5F3EF',  // Light beige (semi-transparent feel)
    '#635750',  // Warm gray for silhouettes
    'silhouettes'
  );

  console.log('\nHero placeholder images generated successfully!');
  console.log('Location: src/assets/images/hero/');
  console.log('\nNote: Replace these with actual Unsplash photography for production.');
}

main().catch(console.error);
