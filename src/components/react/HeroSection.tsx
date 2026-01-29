import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function HeroSection() {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h1
          {...fadeIn}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Your All-in-One <span className="text-orange-500">Group Travel App</span>
        </motion.h1>
        <motion.p
          {...fadeIn}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Coordinate plans, share locations, manage expenses, and chat in real-time –
          all within a single, mobile-first app designed for modern group travel.
        </motion.p>
        <motion.a
          href="#waitlist"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Get Early Access <ArrowRight />
        </motion.a>
      </div>
    </div>
  );
}
