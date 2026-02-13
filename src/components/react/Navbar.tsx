import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Design tokens (matching the NomadCrew warm-minimalist system)      */
/* ------------------------------------------------------------------ */
const tokens = {
  accent:       '#E87B4E',
  accentHover:  '#D4653E',
  accentGlow:   'rgba(232, 123, 78, 0.30)',
  textPrimary:  '#2D2520',
  textSecondary:'#635750',
  textInverse:  '#FDFCFA',
  bgPrimary:    '#FDFCFA',
  bgTertiary:   '#EBE8E1',
  // Navbar-specific
  navBg:        'rgba(253, 252, 250, 0.72)',
  navBgScrolled:'rgba(253, 252, 250, 0.92)',
  navBorder:    'rgba(235, 232, 225, 0.5)',
  navShadow:    '0 1px 3px rgba(45, 37, 32, 0.06)',
} as const;

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Wallet',   href: '#wallet' },
] as const;

/* ------------------------------------------------------------------ */
/*  NavLink — animated underline on hover via Framer Motion            */
/* ------------------------------------------------------------------ */
function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 0',
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: hovered ? tokens.textPrimary : tokens.textSecondary,
        textDecoration: 'none',
        transition: 'color 200ms ease',
      }}
    >
      {label}
      {/* Animated underline */}
      <motion.span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          borderRadius: 1,
          backgroundColor: tokens.accent,
          originX: 0.5,
        }}
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Hamburger — two lines that morph into an X                         */
/* ------------------------------------------------------------------ */
function HamburgerButton({ open, toggle }: { open: boolean; toggle: () => void }) {
  const line = {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: tokens.textPrimary,
  } as const;

  return (
    <button
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={toggle}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        padding: 8,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <motion.span
        style={line}
        animate={open
          ? { rotate: 45, y: 4 }
          : { rotate: 0, y: 0 }
        }
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span
        style={line}
        animate={open
          ? { rotate: -45, y: -4 }
          : { rotate: 0, y: 0 }
        }
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile overlay panel                                               */
/* ------------------------------------------------------------------ */
function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        backgroundColor: 'rgba(253, 252, 250, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {NAV_LINKS.map(({ label, href }, i) => (
          <motion.a
            key={href}
            href={href}
            onClick={onClose}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: tokens.textPrimary,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </motion.a>
        ))}
      </nav>

      {/* CTA */}
      <motion.a
        href="#waitlist"
        onClick={onClose}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          marginTop: 48,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 32px',
          borderRadius: 10,
          fontSize: '1rem',
          fontWeight: 500,
          color: tokens.textInverse,
          backgroundColor: tokens.accent,
          textDecoration: 'none',
          boxShadow: `0 4px 16px ${tokens.accentGlow}`,
        }}
      >
        Get Early Access <ArrowRight size={18} />
      </motion.a>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTAButton — hover lift + warm glow + arrow shift                   */
/* ------------------------------------------------------------------ */
function CTAButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="#waitlist"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -1 : 0,
        boxShadow: hovered
          ? `0 4px 14px ${tokens.accentGlow}`
          : '0 0 0 rgba(232,123,78,0)',
      }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 20px',
        borderRadius: 8,
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: tokens.textInverse,
        backgroundColor: hovered ? tokens.accentHover : tokens.accent,
        textDecoration: 'none',
        transition: 'background-color 250ms ease',
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
      }}
    >
      Get Early Access
      <motion.span
        style={{ display: 'inline-flex' }}
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <ArrowRight size={14} strokeWidth={2.2} />
      </motion.span>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar (default export)                                            */
/* ------------------------------------------------------------------ */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Scroll listener — toggle `scrolled` at 50px threshold */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll(); // initialise
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          willChange: 'transform',
          backgroundColor: scrolled ? tokens.navBgScrolled : tokens.navBg,
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(12px)',
          borderBottom: `1px solid ${tokens.navBorder}`,
          boxShadow: scrolled ? tokens.navShadow : 'none',
          transition: 'background-color 400ms ease, backdrop-filter 400ms ease, box-shadow 400ms ease',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ---- Brand / Logo ---- */}
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            <img
              src="/logo-icon.png"
              alt="NomadCrew logo"
              width={32}
              height={32}
              style={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: tokens.textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              NomadCrew
            </span>
          </a>

          {/* ---- Desktop nav links (hidden below 768px) ---- */}
          <div
            className="navbar-desktop-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink key={href} label={label} href={href} />
            ))}
          </div>

          {/* ---- Desktop CTA (hidden below 768px) ---- */}
          <div className="navbar-desktop-cta">
            <CTAButton />
          </div>

          {/* ---- Mobile hamburger (visible below 768px) ---- */}
          <div className="navbar-mobile-toggle" style={{ zIndex: 51 }}>
            <HamburgerButton open={mobileOpen} toggle={toggleMobile} />
          </div>
        </div>
      </motion.nav>

      {/* ---- Mobile overlay ---- */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={closeMobile} />}
      </AnimatePresence>

      {/* ---- Responsive breakpoint styles ---- */}
      <style>{`
        .navbar-desktop-links,
        .navbar-desktop-cta {
          display: flex;
        }
        .navbar-mobile-toggle {
          display: none;
        }
        @media (max-width: 767px) {
          .navbar-desktop-links,
          .navbar-desktop-cta {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
