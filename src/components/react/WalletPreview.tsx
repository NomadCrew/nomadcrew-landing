import { motion } from 'framer-motion';
import {
  Wallet,
  Plane,
  Hotel,
  Ticket,
  QrCode,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  Forward,
  ScanLine,
  UsersRound,
  SmartphoneNfc,
  type LucideIcon
} from 'lucide-react';

const walletFeatureIcons: Record<string, LucideIcon> = {
  'mail-forward': Forward,
  'scan': ScanLine,
  'users-share': UsersRound,
  'smartphone-nfc': SmartphoneNfc,
};

interface Pass {
  id: string;
  type: 'flight' | 'hotel' | 'event';
  title: string;
  subtitle: string;
  date: string;
  time?: string;
  details: string;
  shared?: boolean;
}

const mockPasses: Pass[] = [
  {
    id: '1',
    type: 'flight',
    title: 'GA 875',
    subtitle: 'JFK → DPS',
    date: 'Mar 15',
    time: '6:45 AM',
    details: 'Gate B12 · Seat 24A',
    shared: true,
  },
  {
    id: '2',
    type: 'hotel',
    title: 'Alila Seminyak',
    subtitle: 'Bali, Indonesia',
    date: 'Mar 15-18',
    details: 'Conf #889472',
    shared: true,
  },
  {
    id: '3',
    type: 'event',
    title: 'Mt. Batur Trek',
    subtitle: 'Sunrise Experience',
    date: 'Mar 17',
    time: '2:00 AM',
    details: '2 tickets',
    shared: false,
  },
];

const PassIcon = ({ type }: { type: Pass['type'] }) => {
  const icons = {
    flight: Plane,
    hotel: Hotel,
    event: Ticket,
  };
  const Icon = icons[type];
  return <Icon className="w-5 h-5" />;
};

const PassCard = ({ pass, index }: { pass: Pass; index: number }) => {
  const typeColors = {
    flight: { bg: 'rgba(232, 123, 78, 0.12)', text: '#E87B4E' },
    hotel: { bg: 'rgba(74, 155, 124, 0.12)', text: '#4A9B7C' },
    event: { bg: 'rgba(212, 165, 52, 0.12)', text: '#D4A534' },
  };
  const colors = typeColors[pass.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[#EBE8E1]/50 cursor-pointer group"
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: colors.bg }}
      >
        <span style={{ color: colors.text }}>
          <PassIcon type={pass.type} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: '#2D2520' }}>
            {pass.title}
          </span>
          <span className="text-xs" style={{ color: '#9B8F85' }}>
            {pass.subtitle}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs" style={{ color: '#635750' }}>
            {pass.date}
            {pass.time && ` · ${pass.time}`}
          </span>
          <span className="text-xs" style={{ color: '#9B8F85' }}>
            {pass.details}
          </span>
        </div>
      </div>

      {/* Shared indicator & QR */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {pass.shared && (
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EBE8E1', color: '#635750' }}>
            <Users className="w-3 h-3" />
            <span>Shared</span>
          </div>
        )}
        <QrCode className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9B8F85' }} />
      </div>
    </motion.div>
  );
};

export default function WalletPreview() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#F5F3EF' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'rgba(232, 123, 78, 0.15)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#E87B4E' }} />
            <span className="text-sm font-medium" style={{ color: '#E87B4E' }}>Coming Soon</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D2520' }}>
            Your Travel Wallet
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#635750' }}>
            Every pass, ticket, and confirmation your crew needs — organized
            by trip, shared with everyone, ready at the gate.
          </p>
        </motion.div>

        {/* Wallet Preview Card */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto"
          >
            {/* Phone Frame */}
            <div
              className="w-[280px] sm:w-[320px] rounded-[2.5rem] p-3 shadow-xl"
              style={{ backgroundColor: '#2D2520' }}
            >
              {/* Screen */}
              <div
                className="rounded-[2rem] overflow-hidden"
                style={{ backgroundColor: '#FDFCFA' }}
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between px-6 py-2" style={{ backgroundColor: '#F5F3EF' }}>
                  <span className="text-xs font-medium" style={{ color: '#635750' }}>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: '#4A9B7C' }} />
                  </div>
                </div>

                {/* Wallet Header */}
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(232, 123, 78, 0.15)' }}
                      >
                        <Wallet className="w-4 h-4" style={{ color: '#E87B4E' }} />
                      </div>
                      <span className="font-semibold" style={{ color: '#2D2520' }}>Wallet</span>
                    </div>
                    <button
                      className="text-sm font-medium"
                      style={{ color: '#E87B4E' }}
                    >
                      + Add
                    </button>
                  </div>

                  {/* Coming Up Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: '#9B8F85' }} />
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8F85' }}>
                        Coming Up
                      </span>
                    </div>
                  </div>

                  {/* Pass List */}
                  <div className="space-y-1">
                    {mockPasses.map((pass, index) => (
                      <PassCard key={pass.id} pass={pass} index={index} />
                    ))}
                  </div>

                  {/* Trip Collections */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: '#EBE8E1' }}>
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8F85' }}>
                      Trip Collections
                    </span>
                    <div className="flex gap-2 mt-2">
                      <div
                        className="flex-1 p-3 rounded-xl text-center"
                        style={{ backgroundColor: '#F5F3EF' }}
                      >
                        <span className="text-lg">🏝️</span>
                        <p className="text-xs font-medium mt-1" style={{ color: '#2D2520' }}>Bali Trip</p>
                        <p className="text-[10px]" style={{ color: '#9B8F85' }}>8 items</p>
                      </div>
                      <div
                        className="flex-1 p-3 rounded-xl text-center"
                        style={{ backgroundColor: '#F5F3EF' }}
                      >
                        <span className="text-lg">🇵🇹</span>
                        <p className="text-xs font-medium mt-1" style={{ color: '#2D2520' }}>Portugal</p>
                        <p className="text-[10px]" style={{ color: '#9B8F85' }}>5 items</p>
                      </div>
                      <div
                        className="flex-1 p-3 rounded-xl text-center border-2 border-dashed flex flex-col items-center justify-center"
                        style={{ borderColor: '#EBE8E1' }}
                      >
                        <span className="text-sm" style={{ color: '#9B8F85' }}>+</span>
                        <p className="text-[10px]" style={{ color: '#9B8F85' }}>New</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Nav Indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-24 h-1 rounded-full" style={{ backgroundColor: '#2D2520' }} />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="absolute -right-4 top-16 px-3 py-2 rounded-lg shadow-lg"
              style={{ backgroundColor: '#FDFCFA' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 155, 124, 0.15)' }}>
                  <span style={{ color: '#4A9B7C' }}>✓</span>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#2D2520' }}>Syncs with</p>
                  <p className="text-[10px]" style={{ color: '#635750' }}>Apple & Google Wallet</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: 'mail-forward',
                title: 'Forward It. Done.',
                description: 'Forward a booking confirmation. NomadCrew pulls the pass automatically. Flights, hotels, events — handled.',
              },
              {
                icon: 'scan',
                title: 'Camera to Crew',
                description: 'Scan any boarding pass, QR code, or ticket. It lands in your wallet under the right trip, visible to your group.',
              },
              {
                icon: 'users-share',
                title: 'Shared by Default. Private When You Want.',
                description: 'Trip passes go to the group automatically. Personal passes stay yours. You decide what\'s visible.',
              },
              {
                icon: 'smartphone-nfc',
                title: 'One Tap to Apple or Google Wallet',
                description: 'Add any pass to your phone\'s native wallet. No app-switching at the gate.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-[#FDFCFA]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(232, 123, 78, 0.12)' }}
                >
                  {(() => {
                    const IconComponent = walletFeatureIcons[feature.icon];
                    return IconComponent ? <IconComponent className="w-5 h-5" style={{ color: '#E87B4E' }} /> : null;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2D2520' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#635750' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="pt-4"
            >
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 hover:gap-3"
                style={{
                  backgroundColor: '#E87B4E',
                  color: '#FDFCFA',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4653E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E87B4E';
                }}
              >
                Get Early Access
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
