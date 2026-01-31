import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

/**
 * ExpandedFooter Component
 *
 * Multi-column footer with brand, product links, company links, and social media.
 * Responsive layout: 4 cols desktop, 2 cols tablet, 1 col mobile.
 *
 * Design: Warm minimalist aesthetic using design tokens.
 */

// Link section data
const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Join Waitlist', href: '#waitlist' },
];

const companyLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
];

const socialLinks = [
  {
    label: 'Twitter',
    ariaLabel: 'Follow us on X (Twitter)',
    href: 'https://twitter.com/nomadcrew',
    icon: Twitter,
  },
  {
    label: 'Instagram',
    ariaLabel: 'Follow us on Instagram',
    href: 'https://instagram.com/nomadcrew',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    ariaLabel: 'Follow us on Facebook',
    href: 'https://facebook.com/nomadcrew',
    icon: Facebook,
  },
  {
    label: 'LinkedIn',
    ariaLabel: 'Connect with us on LinkedIn',
    href: 'https://linkedin.com/company/nomadcrew',
    icon: Linkedin,
  },
];

export default function ExpandedFooter() {
  const currentYear = 2026;

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-bg-tertiary)] py-16">
      <div className="container mx-auto px-4">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-[var(--font-size-xl)] font-bold text-[var(--color-accent-primary)] mb-2">
              NomadCrew
            </h3>
            <p className="text-[var(--color-text-secondary)] text-[var(--font-size-base)] mb-6">
              Group travel, simplified.
            </p>

            {/* Social Icons */}
            <nav aria-label="Social media links">
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.ariaLabel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        w-10 h-10
                        flex items-center justify-center
                        rounded-lg
                        bg-[var(--color-bg-tertiary)]
                        text-[var(--color-text-secondary)]
                        hover:bg-[var(--color-accent-light)]
                        hover:text-[var(--color-accent-primary)]
                        transition-colors
                        duration-200
                      "
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)] mb-4">
              Product
            </h4>
            <nav aria-label="Product links">
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="
                        text-[var(--color-text-secondary)]
                        hover:text-[var(--color-accent-primary)]
                        transition-colors
                        duration-200
                        text-[var(--font-size-base)]
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)] mb-4">
              Company
            </h4>
            <nav aria-label="Company links">
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="
                        text-[var(--color-text-secondary)]
                        hover:text-[var(--color-accent-primary)]
                        transition-colors
                        duration-200
                        text-[var(--font-size-base)]
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Resources (placeholder for future) */}
          <div>
            <h4 className="text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)] mb-4">
              Resources
            </h4>
            <nav aria-label="Resource links">
              <ul className="space-y-3">
                <li>
                  <span className="text-[var(--color-text-muted)] text-[var(--font-size-sm)]">
                    Blog coming soon
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-[var(--color-bg-tertiary)]">
          <p className="text-center text-[var(--color-text-muted)] text-[var(--font-size-sm)]">
            &copy; {currentYear} NomadCrew. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
