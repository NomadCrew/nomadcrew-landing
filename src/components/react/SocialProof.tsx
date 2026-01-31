import { motion } from 'framer-motion';
import { Users, CheckCircle } from 'lucide-react';

/**
 * SocialProof Component
 *
 * Displays static social proof messaging with trust indicators.
 * Uses hardcoded count (no API dependency) for simplicity and verifiability.
 */
export default function SocialProof() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#F5F3EF' }}>
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Main social proof message */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(232, 123, 78, 0.15)' }}
            >
              <Users className="w-6 h-6" style={{ color: '#E87B4E' }} />
            </div>
            <span className="text-xl font-semibold" style={{ color: '#2D2520' }}>
              Join 500+ travelers on the waitlist
            </span>
          </div>

          {/* Supporting message */}
          <p className="text-base max-w-lg mx-auto mb-6 leading-relaxed" style={{ color: '#635750' }}>
            Join the community of adventurers planning their next group trip with NomadCrew
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2" style={{ color: '#635750' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#4A9B7C' }} />
              Early access
            </span>
            <span className="flex items-center gap-2" style={{ color: '#635750' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#4A9B7C' }} />
              No credit card required
            </span>
            <span className="flex items-center gap-2" style={{ color: '#635750' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#4A9B7C' }} />
              Free forever plan
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
