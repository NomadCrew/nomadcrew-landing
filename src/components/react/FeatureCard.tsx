import { motion } from 'framer-motion';
import { ClipboardList, MessagesSquare, LocateFixed, Banknote, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ClipboardList,
  MessagesSquare,
  LocateFixed,
  Banknote,
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

interface Props {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: Props) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      variants={fadeIn}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
    >
      <Icon className="w-12 h-12 text-orange-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
