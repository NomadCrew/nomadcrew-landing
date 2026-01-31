import { motion } from 'framer-motion';
import { Users, CheckCircle } from 'lucide-react';

/**
 * SocialProof Component
 *
 * Displays static social proof messaging with trust indicators.
 * Uses hardcoded count (no API dependency) for simplicity and verifiability.
 *
 * Design: Warm minimalist aesthetic using design tokens.
 */
export default function SocialProof() {
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Main social proof message */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] bg-opacity-20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[var(--color-accent-primary)]" />
            </div>
            <span className="text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
              Join 500+ travelers on the waitlist
            </span>
          </div>

          {/* Supporting message */}
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-base)] max-w-lg mx-auto mb-6 leading-relaxed">
            Join the community of adventurers planning their next group trip with NomadCrew
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--font-size-sm)]">
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
              Early access
            </span>
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
              No credit card required
            </span>
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
              Free forever plan
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
