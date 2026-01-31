import { motion } from 'framer-motion';
import { ClipboardList, MessagesSquare, LocateFixed, Banknote, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  size: 'large' | 'wide' | 'tall' | 'small';
}

const features: Feature[] = [
  {
    icon: ClipboardList,
    title: "Trip Planning & Management",
    description: "Plan, manage, and collaborate on group trips with destination search and shared tools.",
    size: "large",
  },
  {
    icon: MessagesSquare,
    title: "Real-time Communication",
    description: "Stay connected with group chat, real-time messaging, media sharing, and read receipts.",
    size: "wide",
  },
  {
    icon: LocateFixed,
    title: "Location Services",
    description: "Share live locations, explore interactive maps, and discover nearby places together.",
    size: "small",
  },
  {
    icon: Banknote,
    title: "Financial Management",
    description: "Track expenses effortlessly and split costs fairly among your travel group.",
    size: "small",
  },
];

const sizeClasses: Record<Feature['size'], string> = {
  large: "col-span-1 md:col-span-2 row-span-2",
  wide: "col-span-1 md:col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  small: "col-span-1 row-span-1",
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function BentoFeatures() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#F5F3EF' }}>
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#2D2520' }}>
          Everything you need for group travel
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ gridAutoRows: '200px', gridAutoFlow: 'dense' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === 'large';

            return (
              <motion.div
                key={feature.title}
                className={`
                  ${sizeClasses[feature.size]}
                  rounded-2xl
                  p-6
                  shadow-md
                  hover:shadow-xl
                  transition-shadow
                  duration-300
                  flex
                  flex-col
                  ${isLarge ? 'justify-between' : 'justify-start'}
                `}
                style={{ backgroundColor: '#FDFCFA' }}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div>
                  <div
                    className={`
                      ${isLarge ? 'w-14 h-14 mb-6' : 'w-10 h-10 mb-4'}
                      rounded-xl
                      flex
                      items-center
                      justify-center
                    `}
                    style={{ backgroundColor: 'rgba(232, 123, 78, 0.15)' }}
                  >
                    <Icon
                      className={isLarge ? 'w-8 h-8' : 'w-6 h-6'}
                      style={{ color: '#E87B4E' }}
                    />
                  </div>
                  <h3
                    className={`
                      ${isLarge ? 'text-2xl' : 'text-lg'}
                      font-semibold
                      mb-2
                    `}
                    style={{ color: '#2D2520' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`
                      ${isLarge ? 'text-base' : 'text-sm'}
                      leading-relaxed
                    `}
                    style={{ color: '#635750' }}
                  >
                    {feature.description}
                  </p>
                </div>

                {isLarge && (
                  <div className="mt-4 flex items-center font-medium" style={{ color: '#E87B4E' }}>
                    <span className="text-sm">Explore features</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
