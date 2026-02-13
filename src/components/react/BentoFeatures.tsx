import { motion } from 'framer-motion';
import { ClipboardList, MessagesSquare, Wallet, Banknote, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  size: 'large' | 'wide' | 'tall' | 'small';
}

const features: Feature[] = [
  {
    icon: ClipboardList,
    title: "Everyone Sees the Plan",
    description: "No more chasing 8 people across 3 group chats. Build your itinerary together. Vote on where to go. One shared view, zero guesswork.",
    size: "large",
  },
  {
    icon: MessagesSquare,
    title: "Decisions, Not Just Messages",
    description: "A group chat built for trips. Plans get pinned. Polls get answered. That restaurant link from Tuesday doesn't get buried under 47 messages about sunscreen.",
    size: "wide",
  },
  {
    icon: Wallet,
    title: "Every Pass. One Tap.",
    description: "Boarding passes, hotel confirmations, tickets — all in one place. No digging through email at the gate.",
    size: "small",
  },
  {
    icon: Banknote,
    title: "Split It Without the Awkward",
    description: "Track costs as you go. Everyone sees what they owe. No spreadsheets, no \u201CI'll pay you back later\u201D that never comes.",
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
          Your group chat was never built for this.
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ gridAutoRows: 'minmax(200px, auto)', gridAutoFlow: 'dense' }}
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

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
