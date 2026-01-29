# Phase 4: React Islands Extraction - Research

**Researched:** 2026-01-29
**Domain:** Astro Islands Architecture with React and Framer Motion
**Confidence:** HIGH

## Summary

Phase 4 involves extracting interactive React components from the existing single-page React application (src/LandingPage.tsx) into standalone React islands that Astro can selectively hydrate. The research confirms that Astro's islands architecture is production-ready, well-documented, and delivers significant performance improvements (40% faster load times, 90% less JavaScript compared to traditional SPAs).

The existing landing page uses React with Framer Motion for animations and state management for the waitlist form. All components must be extracted into individual React islands with appropriate hydration directives. Framer Motion is fully compatible with Astro islands when used within React components with proper client directives. The key challenge is determining which components need interactivity versus remaining static HTML.

**Primary recommendation:** Extract five distinct components (Navbar, WaitlistForm, FeatureCard, HeroSection, Footer) as React islands with targeted hydration directives. Use client:load for Navbar (immediate interactivity), client:visible for FeatureCard (viewport-based), client:idle for HeroSection and Footer (deferred animations). Keep Framer Motion within React islands; do not attempt SSR for animated components.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/react | ^4.4.2 | React integration for Astro | Official Astro integration for React islands |
| react | ^18.3.1 | UI framework for interactive components | Industry standard, already in project |
| framer-motion | ^11.11.17 | Animation library | Already used in existing landing page, works in Astro islands |
| nanostores | latest | Cross-island state management | Official Astro recommendation for shared state |
| @nanostores/react | latest | React bindings for Nano Stores | React-specific hooks for store subscriptions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nanostores/persistent | latest | Persist state across page transitions | If shared state needs to survive navigation |
| zustand | latest | Alternative state management | If team prefers Zustand over Nano Stores |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Nano Stores | Zustand | Zustand more popular but adds 1.2KB; Nano Stores <1KB and officially recommended |
| client:load | client:only | client:only skips SSR entirely; only use for browser-dependent code |
| Framer Motion SSR | Remove animations | Animations enhance UX; keeping them in islands works well |

**Installation:**
```bash
pnpm install nanostores @nanostores/react
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── react/              # React islands (hydrated)
│   │   ├── Navbar.tsx      # client:load
│   │   ├── WaitlistForm.tsx # client:visible
│   │   ├── FeatureCard.tsx  # client:visible
│   │   └── HeroSection.tsx  # client:idle
│   └── Footer.astro        # Static Astro component (no hydration)
├── stores/                 # Shared state (if needed)
│   └── waitlist.ts         # Nano Store for waitlist state
├── layouts/
│   └── BaseLayout.astro    # Existing layout
└── pages/
    └── index.astro         # Landing page composition
```

### Pattern 1: Component Extraction (Interactive Component)

**What:** Extract component that requires state, events, or animations into standalone React file
**When to use:** Component uses useState, event handlers, or Framer Motion
**Example:**
```tsx
// src/components/react/WaitlistForm.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to join waitlist');
      setStatus('success');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={status === 'loading' || status === 'success'}
        className="flex-1 px-4 py-3 rounded-lg border"
      />
      <motion.button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        whileHover={status === 'idle' ? { scale: 1.05 } : {}}
        whileTap={status === 'idle' ? { scale: 0.95 } : {}}
        className={`px-8 py-3 rounded-lg font-semibold ${
          status === 'success' ? 'bg-green-500' : 'bg-orange-500'
        }`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Joining...
          </>
        ) : status === 'success' ? (
          'Joined Successfully!'
        ) : (
          'Join Now'
        )}
      </motion.button>
    </motion.form>
  );
}
```

**Use in Astro:**
```astro
---
// src/pages/index.astro
import WaitlistForm from '../components/react/WaitlistForm.tsx';
---

<section id="waitlist">
  <h2>Join the Waitlist</h2>
  <p>Be among the first to experience a better way to travel together.</p>
  <WaitlistForm client:visible />
</section>
```

### Pattern 2: Static Component Conversion

**What:** Components with no interactivity become static Astro components
**When to use:** Component only renders HTML, no state or events
**Example:**
```astro
---
// src/components/Footer.astro
---

<footer class="bg-gray-50 py-8">
  <div class="container mx-auto px-4 text-center text-gray-600">
    <p>© 2024 NomadCrew. All rights reserved.</p>
  </div>
</footer>
```

### Pattern 3: Hybrid Component (Static Wrapper + Interactive Islands)

**What:** Astro component with embedded React islands for selective hydration
**When to use:** Section has mostly static content with small interactive areas
**Example:**
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/react/Navbar.tsx';
import HeroSection from '../components/react/HeroSection.tsx';
import FeatureCard from '../components/react/FeatureCard.tsx';
import WaitlistForm from '../components/react/WaitlistForm.tsx';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="NomadCrew - Your All-in-One Group Travel App">
  <Navbar client:load />

  <HeroSection client:idle />

  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          client:visible
          icon="ClipboardList"
          title="Trip Planning & Management"
          description="Plan, manage, and collaborate on group trips."
        />
        <!-- Repeat for other features -->
      </div>
    </div>
  </section>

  <section id="waitlist" class="py-16 px-4">
    <div class="container mx-auto max-w-xl text-center">
      <h2 class="text-3xl font-bold mb-6">Join the Waitlist</h2>
      <p class="text-gray-600 mb-8">Be among the first to experience better travel.</p>
      <WaitlistForm client:visible />
    </div>
  </section>

  <Footer />
</BaseLayout>
```

### Pattern 4: Framer Motion in Islands

**What:** Keep Framer Motion animations within React components, use viewport options
**When to use:** Component needs scroll-triggered or interaction animations
**Example:**
```tsx
// src/components/react/FeatureCard.tsx
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
    >
      <Icon className="w-12 h-12 text-orange-500 mb-4" />
      <h3 class="text-lg font-semibold mb-2">{title}</h3>
      <p class="text-gray-600">{description}</p>
    </motion.div>
  );
}
```

### Anti-Patterns to Avoid

- **Over-hydrating everything:** Don't add client:load to all components. Static HTML is faster.
- **Using client:load as default:** Only use for critical interactive elements (navigation, forms above fold).
- **Attempting SSR with animations:** Framer Motion animations should stay client-side with client:* directives.
- **Passing functions as props:** Functions cannot be serialized. Use Nano Stores or callbacks within the same island.
- **Using React Context across islands:** Context doesn't work across island boundaries. Use Nano Stores instead.
- **Mapping over large arrays to create islands:** Creates many small bundles. Render list in one island instead.
- **Wrapping entire layouts in framework components:** Defeats the purpose. Use Astro for static structure.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Shared state between islands | Custom event system, localStorage wrapper | Nano Stores (@nanostores/react) | Framework-agnostic, <1KB, handles subscriptions correctly |
| Detecting component in viewport | Custom IntersectionObserver | client:visible directive | Built-in, optimized, handles cleanup automatically |
| Idle callback timing | Custom requestIdleCallback wrapper | client:idle directive | Built-in, has fallback for unsupported browsers |
| Hydration mismatch debugging | Manual console.log comparison | useEffect for client-only code, client:only for browser APIs | Official patterns prevent mismatches |
| Props serialization | Custom JSON.stringify wrapper | Pass only serializable types (primitives, arrays, objects) | Astro handles serialization; functions won't work |

**Key insight:** Astro's client directives and Nano Stores solve 90% of island architecture challenges. Custom solutions usually miss edge cases like browser compatibility, cleanup, or serialization limits.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from Server/Client Differences

**What goes wrong:** Component renders differently on server vs. client, causing "The server HTML was replaced with client content" error.

**Why it happens:** Using browser-only APIs (window, document, Date.now()) during SSR, or conditional rendering based on client state.

**How to avoid:**
- Wrap browser API calls in useEffect (doesn't run during SSR)
- Use client:only directive if component cannot be server-rendered
- Avoid using current timestamps or random values during render

**Warning signs:**
- Console error: "An error occurred during hydration"
- Content flashes or changes after page load
- Different content in view source vs. browser inspector

**Example fix:**
```tsx
// BAD: Uses window during render
function BadComponent() {
  const path = window.location.pathname; // Error during SSR
  return <div>{path}</div>;
}

// GOOD: Uses useEffect for client-only code
function GoodComponent() {
  const [path, setPath] = useState('');

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return <div>{path || 'Loading...'}</div>;
}

// ALTERNATIVE: Skip SSR entirely
<BrowserOnlyComponent client:only="react" />
```

### Pitfall 2: Passing Functions as Props to Islands

**What goes wrong:** Trying to pass event handlers or callbacks from Astro to React islands fails silently or throws serialization errors.

**Why it happens:** Astro serializes props to JSON in `<script type="application/json">` tags. Functions cannot be serialized.

**How to avoid:**
- Define all event handlers inside the React island component
- Use Nano Stores for cross-island communication
- Pass only serializable data (strings, numbers, objects, arrays)

**Warning signs:**
- Props are undefined in React component
- Console warning about non-serializable props
- onClick handlers don't fire

**Supported prop types:** Plain objects, numbers, strings, Arrays, Maps, Sets, RegExp, Date, BigInt, URL, Uint8Array/16/32, Infinity.

### Pitfall 3: Framer Motion Animation Conflicts

**What goes wrong:** Animations don't play, or play incorrectly when component hydrates.

**Why it happens:** Initial state rendered on server doesn't match animation starting state, or viewport detection conflicts with client:visible.

**How to avoid:**
- Use viewport: { once: true } to prevent re-animation on scroll
- Match initial animation state with static HTML appearance
- Consider client:only for complex animation-heavy components

**Warning signs:**
- Animations jump or skip frames on first load
- whileInView animations trigger immediately instead of on scroll
- Animation state persists when navigating with View Transitions

**Example pattern:**
```tsx
// Use viewport.once to prevent re-triggering
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }} // Critical for performance
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

### Pitfall 4: Over-Using client:load

**What goes wrong:** Page feels slow, Lighthouse performance score drops, JavaScript bundle size balloons.

**Why it happens:** Every client:load directive hydrates immediately on page load, blocking main thread.

**How to avoid:**
- Audit each component: "Does this need to be interactive immediately?"
- Use client:idle for secondary interactions (hover effects, animations)
- Use client:visible for below-fold content (feature cards, footer)
- Reserve client:load only for critical UI (navigation, hero CTA)

**Warning signs:**
- Total Blocking Time (TBT) >200ms in Lighthouse
- JavaScript bundle >100KB for simple landing page
- Page feels sluggish on mobile/slow connections

**Decision framework:**
- Critical navigation/forms above fold → client:load
- Animations/hover effects → client:idle
- Below-fold interactive elements → client:visible
- Static content → No client directive

### Pitfall 5: Shared State Between Islands

**What goes wrong:** Two islands can't communicate, or state updates in one don't reflect in another.

**Why it happens:** React Context doesn't work across island boundaries. Each island is isolated by default.

**How to avoid:**
- Use Nano Stores for shared state
- Install @nanostores/react for useStore hook
- Create stores in src/stores/ directory
- Import same store in multiple islands

**Warning signs:**
- Context provider not wrapping islands (won't work)
- State changes in one component don't update another
- Need to refresh page to see updates

**Example solution:**
```typescript
// src/stores/waitlist.ts
import { atom } from 'nanostores';

export const waitlistCount = atom(0);
export const isFormVisible = atom(true);

export function incrementWaitlist() {
  waitlistCount.set(waitlistCount.get() + 1);
}
```

```tsx
// src/components/react/WaitlistForm.tsx
import { useStore } from '@nanostores/react';
import { waitlistCount, incrementWaitlist } from '../../stores/waitlist';

export default function WaitlistForm() {
  const count = useStore(waitlistCount);

  const handleSubmit = () => {
    // ... form logic
    incrementWaitlist();
  };

  return <div>Total signups: {count}</div>;
}
```

## Code Examples

Verified patterns from official sources:

### Example 1: Component with Multiple Hydration Strategies

Source: [Astro Docs - Directives Reference](https://docs.astro.build/en/reference/directives-reference/)

```astro
---
// src/pages/index.astro
import Navbar from '../components/react/Navbar.tsx';
import Hero from '../components/react/Hero.tsx';
import Features from '../components/react/Features.tsx';
import Testimonials from '../components/react/Testimonials.tsx';
---

<!-- Critical navigation: hydrate immediately -->
<Navbar client:load />

<!-- Hero animations: hydrate when browser idle -->
<Hero client:idle />

<!-- Below-fold features: hydrate when visible -->
<Features client:visible />

<!-- Far below fold: hydrate when visible with margin -->
<Testimonials client:visible={{ rootMargin: "200px" }} />
```

### Example 2: Nano Stores Cross-Island Communication

Source: [Astro Docs - Share State Between Islands](https://docs.astro.build/en/recipes/sharing-state-islands/)

```typescript
// src/stores/cart.ts
import { atom, map } from 'nanostores';

export const isCartOpen = atom(false);

export const cartItems = map({});

export function addCartItem({ id, name, imageSrc }) {
  const existing = cartItems.get()[id];
  if (existing) {
    cartItems.setKey(id, {
      ...existing,
      quantity: existing.quantity + 1,
    });
  } else {
    cartItems.setKey(id, { id, name, imageSrc, quantity: 1 });
  }
}
```

```tsx
// src/components/react/CartButton.tsx
import { useStore } from '@nanostores/react';
import { isCartOpen } from '../../stores/cart';

export default function CartButton() {
  const $isCartOpen = useStore(isCartOpen);

  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>
      {$isCartOpen ? 'Close' : 'Open'} Cart
    </button>
  );
}
```

```tsx
// src/components/react/CartFlyout.tsx
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems } from '../../stores/cart';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  return $isCartOpen ? (
    <aside>
      {Object.values($cartItems).map(item => (
        <div key={item.id}>{item.name} x {item.quantity}</div>
      ))}
    </aside>
  ) : null;
}
```

### Example 3: Handling Non-Serializable Props

Source: [Astro Docs - Framework Components](https://docs.astro.build/en/guides/framework-components/)

```astro
---
// BAD: Cannot pass functions to hydrated components
import InteractiveComponent from '../components/react/Interactive.tsx';

const handleClick = () => console.log('clicked'); // This won't work
---

<InteractiveComponent onClick={handleClick} client:load />
```

```tsx
// GOOD: Define handlers inside the component
export default function InteractiveComponent() {
  const handleClick = () => {
    console.log('clicked');
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

```astro
---
// ALTERNATIVE: Use named slots for content
import Container from '../components/react/Container.tsx';
import Button from '../components/react/Button.tsx';
---

<Container client:load>
  <Button slot="header" client:load>Header Button</Button>
  <p>Main content goes here</p>
  <Button slot="footer" client:load>Footer Button</Button>
</Container>
```

### Example 4: Preventing Hydration Mismatches

Source: [Astro Troubleshooting](https://docs.astro.build/en/guides/troubleshooting/)

```tsx
// BAD: Date changes between server and client
function BadTimestamp() {
  const now = new Date().toISOString(); // Different on server vs client!
  return <time>{now}</time>;
}

// GOOD: Use useEffect for client-only dynamic values
import { useState, useEffect } from 'react';

function GoodTimestamp() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date().toISOString());
  }, []);

  return <time>{now || 'Loading...'}</time>;
}

// ALTERNATIVE: Use client:only to skip SSR
<DynamicComponent client:only="react" />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Full SPA with React Router | Astro islands with selective hydration | Astro 2.0+ (2023) | 40% faster load times, 90% less JavaScript |
| Redux/MobX for all state | Nano Stores for cross-island state only | Astro 3.0+ (2023) | <1KB state library vs 8-45KB for Redux |
| client:load everywhere | Targeted client:idle/visible | Astro 2.5+ (2023) | Improved TBT and TTI scores |
| Manual IntersectionObserver | client:visible with rootMargin | Astro 4.1.0 (2024) | Smoother scroll animations, less CLS |
| Context providers for islands | Nano Stores atoms/maps | Ongoing | Works cross-framework, no provider nesting |

**Deprecated/outdated:**
- **client:media without CSS:** If component is already hidden via CSS media queries, client:visible is more appropriate (client:media still loads JS even if hidden)
- **SSR animations with Framer Motion:** Current best practice is client-side animations with viewport: { once: true }
- **Passing children arrays to React islands:** Known issue - use individual props or render list inside island

## Open Questions

Things that couldn't be fully resolved:

1. **Lucide React icon tree-shaking in islands**
   - What we know: Project imports individual icons (ClipboardList, MessagesSquare, etc.) which is correct approach
   - What's unclear: Whether Astro's build process tree-shakes unused Lucide icons across multiple islands
   - Recommendation: Test bundle size after extraction; if >20KB, consider loading icons dynamically or using SVGs

2. **Framer Motion bundle impact with multiple islands**
   - What we know: Each island using Framer Motion adds ~30KB (React runtime + Framer Motion)
   - What's unclear: Whether Framer Motion can be shared across islands or if each bundles it separately
   - Recommendation: Extract FeatureCard as single island that maps over features array, rather than 4 separate islands

3. **Waitlist API endpoint migration timing**
   - What we know: Current functions/waitlist.ts uses Cloudflare Workers API; Phase 6 will migrate to Astro endpoint
   - What's unclear: Whether WaitlistForm should use /api/waitlist now or wait for Phase 6 conversion
   - Recommendation: Keep fetch('/api/waitlist') in WaitlistForm; Phase 6 will handle endpoint migration without changing React component

4. **Animation performance with client:visible**
   - What we know: client:visible + Framer Motion whileInView both use IntersectionObserver
   - What's unclear: Whether this creates double observation or if they conflict
   - Recommendation: Test HeroSection with both client:idle + whileInView vs. client:visible without viewport animations

## Sources

### Primary (HIGH confidence)
- [Astro Docs - Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Core concept explanation and best practices
- [Astro Docs - Template Directives Reference](https://docs.astro.build/en/reference/directives-reference/) - Complete client:* directive specifications
- [Astro Docs - Share State Between Islands](https://docs.astro.build/en/recipes/sharing-state-islands/) - Official Nano Stores integration guide
- [Astro Docs - Framework Components](https://docs.astro.build/en/guides/framework-components/) - Props passing and serialization rules
- [Astro Docs - Testing](https://docs.astro.build/en/guides/testing/) - Playwright integration guidance
- [Astro Docs - Troubleshooting](https://docs.astro.build/en/guides/troubleshooting/) - Hydration mismatch solutions
- [Astro Docs - Project Structure](https://docs.astro.build/en/basics/project-structure/) - Component organization conventions

### Secondary (MEDIUM confidence)
- [Framer Motion - React Component Docs](https://www.framer.com/motion/component/) - Verified motion.div API including whileInView and viewport options
- [Strapi - Astro Islands Architecture Explained](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide) - Anti-patterns and best practices from 2024
- [LogRocket - Understanding Astro Islands Architecture](https://blog.logrocket.com/understanding-astro-islands-architecture/) - Decision framework for static vs interactive
- [firxworx.com - Astro + React Shared State with Zustand](https://firxworx.com/blog/code/2024-06-23-astro-and-react-shared-state-with-zustand-stores/) - Alternative to Nano Stores
- [Akos Komuves - How to Fix React Hydration Error in Astro](https://akoskm.com/how-to-fix-react-hydration-error-in-astro/) - useEffect pattern for hydration mismatches

### Tertiary (LOW confidence - WebSearch only)
- [GitHub Issue #8195 - Framer Motion AnimatePresence error](https://github.com/withastro/astro/issues/8195) - Reported compatibility issue from 2023, may be resolved
- [GitHub Issue #7709 - React Hydration Error](https://github.com/withastro/astro/issues/7709) - Community-reported hydration issues
- [Medium - 8 Astro Islands Patterns](https://medium.com/@kaushalsinh73/8-astro-islands-patterns-for-near-instant-sites-29ee4343c2ae) - Pattern recommendations from October 2025

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified in package.json; Nano Stores officially recommended by Astro docs
- Architecture: HIGH - Patterns directly from official Astro documentation and established community practices
- Pitfalls: MEDIUM - Mix of official docs (hydration, serialization) and community-reported issues (Framer Motion conflicts)

**Research date:** 2026-01-29
**Valid until:** 2026-02-28 (30 days - Astro stable, infrequent breaking changes)

**Component extraction analysis from src/LandingPage.tsx:**

| Component | Interactive? | Requires State? | Animations? | Recommended Directive | Rationale |
|-----------|--------------|----------------|-------------|---------------------|-----------|
| Navbar | Yes | No (navigation only) | Yes (slide down, hover) | client:load | Critical for navigation, needs immediate interactivity |
| HeroSection | Partial | No | Yes (fade in, stagger) | client:idle | Animations enhance UX but aren't critical; defer until idle |
| FeatureCard | Partial | No | Yes (whileInView, hover) | client:visible | Below fold, animations only trigger when visible |
| WaitlistForm | Yes | Yes (email, status, error) | Yes (form animations) | client:visible | Form in middle of page, can hydrate when scrolled into view |
| Footer | No | No | Yes (fade in) | Static Astro | Simple copyright text, animation not critical - remove Framer Motion |

**Performance expectations:**
- Current React SPA: ~200-300KB JavaScript (React + React Router + Framer Motion)
- After islands extraction: ~45-80KB JavaScript (React + Framer Motion only for interactive islands)
- Lighthouse performance: 72-85 (SPA) → 94-100 (Islands)
- LCP: 2-3s (SPA) → <1s (Islands)
- TBT: 200-400ms (SPA) → <50ms (Islands)
