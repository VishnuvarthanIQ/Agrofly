# AGROFLY – Agri Drone Spraying Service Complete Multipage Website Template

**AgroFly** is a modern, professional, fully responsive multipage website template and Farmer Dashboard built for agricultural drone spraying, precision crop protection, fertilizer spraying, pesticide application, and smart farmland management.

---

## 🌾 Project Highlights

- **Pure Frontend Tech Stack**: HTML5, CSS3, Tailwind CSS, Bootstrap 5, Vanilla JavaScript. Strictly framework-free (no React, Angular, Vue, Next.js, TypeScript, PHP, or Python dependencies).
- **Two Distinct Landing Pages**:
  - **Home Page 1 – Smart Agriculture Technology**: Full-background cinematic agricultural drone video hero (`home-hero.mp4`), dark overlay, animated counters, floating RTK GPS and 16L spray tank cards, before-and-after comparison gallery, tech features, and stats.
  - **Home Page 2 – Precision Crop Protection**: Asymmetric split-screen hero with large rounded video showcase (`precision-hero.mp4`), live telemetry badge, floating today's acreage card (186 acres), drone fleet showcase (Scout 10L, Pro 16L, Heavy 30L), and crop-specific protection solutions.
- **Unique Hero Photography on Every Page**: Strictly no repeated hero images across any page. Every page features its own high-resolution agricultural hero with dark text-readability overlay and smooth fade-in.
- **Farmer Dashboard Suite**:
  - **Overview**: 5 key metrics (Total Bookings, Completed Jobs, Pending Jobs, Acres Sprayed, Amount Spent), booking status distribution chart, recent bookings, upcoming schedule, and recent invoices.
  - **Book Spraying Service**: Interactive dynamic cost calculator based on crop, acreage, area units (acres, hectares, guntha), selected spraying service (₹350/acre, ₹300/acre, etc.), and 5% GST; dynamic slot availability checker (disables booked slots); past dates disabled; saves to localStorage.
  - **My Bookings**: Real-time search and status filtering (Pending, Confirmed, In Progress, Completed, Cancelled); full details modal with cancellation option.
  - **Job Tracking**: Visual 5-step progress stepper (`Booking Submitted` ➔ `Booking Confirmed` ➔ `Drone Assigned` ➔ `Spraying In Progress` ➔ `Service Completed`).
  - **Invoice Management**: List of invoices, view modal, and print/download PDF with dedicated clean browser print styles (`@media print`).
  - **Profile & Settings**: Farmer contact details, farm location, notification preferences, and reset demo data.
- **Strict Form Validation**:
  - **Name**: Alphabetic characters only, single spaces between words, no numbers or special symbols.
  - **Mobile Number**: Valid 10-digit Indian format (`^[6-9]\d{9}$`).
  - **Email**: RFC-compliant format.
  - **Password**: Minimum 8 characters with at least one uppercase, lowercase, digit, and special symbol.
  - **Acreage**: Positive numeric values.
  - **Date**: Future or current dates only.
  - Inline error feedback with automatic clearing on correction.
- **Complete Theme & Direction Support**:
  - **Dark Mode & Light Mode**: Smooth transition, persisted via `localStorage`.
  - **RTL & LTR Support**: Toggle loads `bootstrap.rtl.min.css` dynamically, sets `dir="rtl"`, with logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`).
- **Responsive Across All Screens**:
  - Verified from 360px mobile up to 1920px widescreen.

---

## 📁 Directory & File Organization

```
agrofly/
│
├── index.html                  # Home Page 1 – Smart Agriculture Technology (Video Hero)
├── home-2.html                 # Home Page 2 – Precision Crop Protection (Split Video Hero)
├── about.html                  # About Us (Company story, mission, team, timeline)
├── services.html               # All 9 Drone Spraying Services (Filterable by category)
├── service-details.html        # Reusable Service Details layout (?s=ID query param)
├── blog.html                   # Agricultural Insights (Search, category filter, pagination)
├── blog-details.html           # Full Blog Article with sidebar & social sharing (?id=ID)
├── contact.html                # Contact Us (Validation, success modal, OpenStreetMap)
├── pricing.html                # Pricing Packages (One-time vs Seasonal toggle, feature matrix)
├── 404.html                    # Custom 404 Not Found Page
├── sign-in.html                # Minimal Auth Sign In (Autofill demo button)
├── sign-up.html                # Minimal Auth Sign Up (Strict validation)
├── coming-soon.html            # Maintenance / Coming Soon Page (Countdown timer)
│
├── dashboard/
│   ├── index.html              # Farmer Dashboard Overview & KPIs
│   ├── book-spraying.html      # Book Drone Spraying (Live Acreage Calculator)
│   ├── bookings.html           # My Bookings (Search, filter, view details, cancel)
│   ├── tracking.html           # 5-Step Visual Job Tracker
│   ├── invoices.html           # Invoice Management (View & Print / PDF)
│   ├── profile.html            # Farmer Profile & Location Settings
│   └── settings.html           # Notification & Demo Preferences
│
├── assets/
│   ├── css/
│   │   ├── style.css           # Core design system, variables, header, footer, cards
│   │   ├── animations.css      # Keyframes, floating cards, pulse, scroll reveal
│   │   ├── responsive.css      # Breakpoints (360px, 576px, 768px, 992px, 1440px) & RTL
│   │   └── dashboard.css       # Sidebar, dashboard topbar, KPIs, tracking stepper, print
│   │
│   ├── js/
│   │   ├── theme.js            # Dark / Light theme switcher
│   │   ├── rtl.js              # RTL / LTR direction toggle
│   │   ├── validation.js       # Strict form validation engine
│   │   ├── authentication.js   # Demo auth, header state, session handling
│   │   ├── booking.js          # Dynamic acreage price calculation & slot checker
│   │   ├── dashboard.js        # Dashboard overview, tracking, and invoices
│   │   └── main.js             # Shared components, reveal observer, counters, filters
│   │
│   ├── img/
│   │   ├── hero/               # Hero graphics & fallbacks
│   │   ├── services/           # Service imagery
│   │   ├── about/              # Company imagery
│   │   ├── blog/               # Agronomy article photos
│   │   ├── team/               # Pilot & agronomist photos
│   │   └── dashboard/          # Dashboard illustrations
│   │
│   └── video/
│       ├── home-hero.mp4       # Drone flying over farmland (Home 1 hero background)
│       └── precision-hero.mp4  # Drone spraying crop field (Home 2 asymmetric showcase)
│
└── README.md                   # Documentation
```

---

## 🚀 How to Run the Website

No build step or Node.js server is required.

1. **Directly in Browser**: Double-click or open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
2. **With Static HTTP Server** (Recommended for video preload & local links):
   ```bash
   # Python 3
   python -m http.server 8000
   # or with VS Code Live Server extension
   ```
   Then visit `http://localhost:8000`.

---

## 🔑 Demo Farmer Credentials

The template comes pre-seeded with a demo farmer account:
- **Email**: `tamil@example.com`
- **Mobile**: `9876543210`
- **Password**: `AgroFly@2026`
- **Quick Fill**: On `sign-in.html`, click **"Quick Fill Demo Farmer Credentials"** to populate the fields instantly.
- You can also register any new account on `sign-up.html` with full validation.

---

## 🎨 Color Palette

| Token | Hex Value | Usage |
|---|---|---|
| **Primary Green** | `#1B7A45` | Primary buttons, brand logo, active navigation, key accents |
| **Dark Green** | `#104D32` | Headings, dashboard sidebar, dark gradients |
| **Accent Lime** | `#A6D94B` | High-visibility CTA badges, pulse animations, dark mode highlights |
| **Light Background** | `#F6F9F3` | Page background in light mode |
| **Dark Background** | `#101C17` | Page background in dark mode |
| **Secondary Text** | `#68766D` | Subtitles, body descriptions, table headers |
| **White** | `#FFFFFF` | Cards, popups, inputs, dark mode contrast |

---

## 📱 Responsive Verification

The template has been engineered and tested for:
- **360px & 375px**: Strict zero horizontal overflow, full-width touch buttons, stacked forms.
- **768px (Tablet)**: Responsive sidebar drawer, adaptive multi-column grids.
- **1024px (Laptop)**: Sticky header with no overlapping action items.
- **1280px / 1440px / 1920px (Desktop / Ultrawide)**: Centered balanced containers with comfortable readable line heights.
