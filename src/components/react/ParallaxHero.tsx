import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Import hero layer images
import layer1 from '../../assets/images/hero/layer-1-foreground.jpg';
import layer2 from '../../assets/images/hero/layer-2-midground.jpg';
import layer3 from '../../assets/images/hero/layer-3-background.jpg';

/**
 * ParallaxHero - Multi-layer parallax hero section with bottom reveal
 *
 * Features:
 * - 3 parallax layers moving at different speeds
 * - Text/CTA reveal at bottom on scroll
 * - Respects prefers-reduced-motion accessibility setting
 * - Reduced parallax intensity on mobile for performance
 */
export default function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Client-side mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll progress within hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Determine parallax intensity based on motion preference and device
  const shouldDisableParallax = prefersReducedMotion;
  const parallaxMultiplier = shouldDisableParallax ? 0 : isMobile ? 0.5 : 1;

  // Layer transforms: background slowest, foreground fastest
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vh', `${30 * parallaxMultiplier}vh`]
  );
  const midgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vh', `${60 * parallaxMultiplier}vh`]
  );
  const foregroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vh', `${100 * parallaxMultiplier}vh`]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[100vh] overflow-hidden"
      role="banner"
      aria-label="Hero section with parallax imagery"
    >
      {/* Sticky container for viewport-locked effect */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Layer 3: Background (slowest) */}
        <motion.div
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <img
            src={layer3.src}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="w-full h-full object-cover will-change-transform"
          />
        </motion.div>

        {/* Layer 2: Midground (medium) */}
        <motion.div
          className="absolute inset-0"
          style={{ y: midgroundY }}
        >
          <img
            src={layer2.src}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="w-full h-full object-cover will-change-transform"
          />
        </motion.div>

        {/* Layer 1: Foreground (fastest) */}
        <motion.div
          className="absolute inset-0"
          style={{ y: foregroundY }}
        >
          <img
            src={layer1.src}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="w-full h-full object-cover will-change-transform"
          />
        </motion.div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Bottom reveal content */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-4 pb-16 md:pb-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="container mx-auto max-w-4xl text-center">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Travel Together. Not Just at the Same Time.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              One shared hub for plans, chat, expenses, and real-time
              coordination — not 6 apps and a group chat full of "so what's the plan?"
            </p>

            {/* CTA Button */}
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'var(--color-accent-primary, #E87B4E)',
                color: 'var(--color-text-inverse, #FDFCFA)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-hover, #D4653E)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-primary, #E87B4E)';
              }}
            >
              Get Early Access
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
