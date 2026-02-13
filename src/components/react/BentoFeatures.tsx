import { motion } from 'framer-motion';
import { ClipboardList, MessagesSquare, Wallet, Banknote, MapPin, Check, Pin, type LucideIcon } from 'lucide-react';

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

const avatarColors = ['#E87B4E', '#4A9B7C', '#D4A534', '#635750'];

function ItineraryPreview() {
  const items = [
    { day: 'Day 1', label: 'Arrive in Lisbon', votes: 4, status: 'confirmed' as const },
    { day: 'Day 2', label: 'Time Out Market \u2192 Alfama', votes: 3, status: 'confirmed' as const },
    { day: 'Day 3', label: 'Sintra Day Trip', votes: 0, status: 'voting' as const },
  ];

  return (
    <div
      className="rounded-xl p-3 sm:p-4 mt-auto"
      style={{ backgroundColor: '#EBE8E1' }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-medium tracking-wide uppercase" style={{ color: '#9B8F85' }}>
          Shared Itinerary
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {avatarColors.map((color) => (
              <div
                key={color}
                className="w-4.5 h-4.5 rounded-full border-[1.5px]"
                style={{ borderColor: '#EBE8E1', backgroundColor: color, width: 18, height: 18 }}
              />
            ))}
          </div>
          <span className="text-[10px]" style={{ color: '#9B8F85' }}>4</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.day}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{ backgroundColor: 'rgba(253,252,250,0.7)' }}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#E87B4E' }} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-medium" style={{ color: '#9B8F85' }}>{item.day}</span>
              <span className="text-xs truncate" style={{ color: '#2D2520' }}>{item.label}</span>
            </div>
            {item.status === 'confirmed' ? (
              <div
                className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 shrink-0"
                style={{ backgroundColor: 'rgba(74,155,124,0.12)' }}
              >
                <Check className="w-2.5 h-2.5" style={{ color: '#4A9B7C' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#4A9B7C' }}>{item.votes}</span>
              </div>
            ) : (
              <div
                className="rounded-full px-2 py-0.5 shrink-0"
                style={{ backgroundColor: 'rgba(212,165,52,0.12)' }}
              >
                <span className="text-[10px] font-semibold" style={{ color: '#D4A534' }}>Vote</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PollPreview() {
  return (
    <div
      className="rounded-lg p-2.5 mt-auto"
      style={{ backgroundColor: '#EBE8E1' }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Pin className="w-3 h-3" style={{ color: '#E87B4E' }} />
        <span className="text-[10px] font-medium" style={{ color: '#9B8F85' }}>Pinned Poll</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] w-20 truncate" style={{ color: '#2D2520' }}>Beach day</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(253,252,250,0.6)' }}>
            <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: '#4A9B7C' }} />
          </div>
          <span className="text-[10px] font-semibold w-4 text-right" style={{ color: '#4A9B7C' }}>5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] w-20 truncate" style={{ color: '#2D2520' }}>Museum</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(253,252,250,0.6)' }}>
            <div className="h-full rounded-full" style={{ width: '28%', backgroundColor: '#D4A534' }} />
          </div>
          <span className="text-[10px] font-semibold w-4 text-right" style={{ color: '#D4A534' }}>2</span>
        </div>
      </div>
    </div>
  );
}

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
            const hasPreview = feature.size === 'large' || feature.size === 'wide';

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
                  ${hasPreview ? 'justify-between' : 'justify-start'}
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

                {feature.size === 'large' && <ItineraryPreview />}
                {feature.size === 'wide' && <PollPreview />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
