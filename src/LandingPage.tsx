import React from 'react';
import { ArrowRight, Users, MessageSquareShare, Receipt, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1, duration: 0.3 }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with Slide Down Animation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-orange-500">NomadCrew</div>
          <motion.a 
            href="#waitlist"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
          >
            Join Waitlist <ArrowRight size={16} />
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero Section with Fade Up Animation */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 
            {...fadeIn}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Group Travel, <span className="text-orange-500">Simplified</span>
          </motion.h1>
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Say goodbye to scattered WhatsApp groups and hello to seamless travel coordination. 
            One app for locations, expenses, and plans.
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

      {/* Features Section with Stagger Animation */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Users, title: "Group Coordination", description: "Keep everyone on the same page with real-time updates and shared itineraries" },
              { icon: MessageSquareShare, title: "Live Location Sharing", description: "Never lose track of your group with private, secure location sharing" },
              { icon: Receipt, title: "Expense Tracking", description: "Split costs fairly and keep track of group expenses effortlessly" },
              { icon: MapPin, title: "Trip Planning", description: "Create and share travel plans, destinations, and meeting points" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Waitlist Section with Slide Up Animation */}
      <div id="waitlist" className="py-16 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Join the Waitlist</h2>
            <p className="text-gray-600 mb-8">
              Be among the first to experience a better way to travel together. 
              Get early access and exclusive updates.
            </p>
            <motion.form 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Join Now
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Footer with Fade In Animation */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-8"
      >
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 NomadCrew. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}