import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * Navbar Component - Warm Minimalist Design
 *
 * Features:
 * - Fixed positioning with z-50 to stay above parallax layers
 * - Warm off-white background with backdrop blur
 * - Accent color CTA button using design tokens
 * - Smooth spring animation on mount
 */
export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'rgba(253, 252, 250, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-bg-tertiary, #EBE8E1)',
      }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <a
          href="/"
          className="text-xl font-bold"
          style={{ color: 'var(--color-accent-primary, #E87B4E)' }}
        >
          NomadCrew
        </a>

        {/* Navigation Links (hidden on mobile, visible on md+) */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="font-medium transition-colors duration-200"
            style={{ color: 'var(--color-text-primary, #2D2520)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-accent-primary, #E87B4E)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary, #2D2520)';
            }}
          >
            Features
          </a>
        </div>

        {/* CTA Button */}
        <motion.a
          href="#waitlist"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors duration-200"
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
          Join Waitlist <ArrowRight size={16} />
        </motion.a>
      </div>
    </motion.nav>
  );
}
