<div align="center">
  <img src="./public/hero-banner.png" alt="KnitAura Hero Banner" width="100%" style="border-radius: 16px; margin-bottom: 20px;">

  # KnitAura 🧶
  ### Handcrafted Luxury Crochet & Sustainable Knitwear Studio

  [![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://knitaura.vercel.app)
  [![Framework: Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![Styling: Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![Backend: Firebase](https://img.shields.io/badge/Backend-Firebase_v10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**KnitAura** is an ultra-polished, Apple-inspired e-commerce platform dedicated to handcrafted luxury crochet, artisanal knitwear, and sustainable home goods. 

Built with Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, and Firebase v10+, KnitAura seamlessly blends rich aesthetics, fluid spring micro-animations, real-time inventory management, cart state persistence, and WhatsApp order routing.

---

## 🌟 Key Features

- 🍎 **Apple-Inspired Glassmorphic Aesthetic**: Translucent frosted panels, warm HSL color tokens, Framer Motion entrance physics, and soft rounded shadow elevations (`rounded-3xl`).
- 🛒 **Persistent Shopping Cart**: Interactive slide-over cart drawer powered by Zustand state management with real-time total calculation and WhatsApp checkout.
- 📱 **WhatsApp Instant Order Dispatch**: Serverless Next.js API route (`/api/send-order`) sending formatted order confirmations directly to business WhatsApp endpoints.
- 🔒 **Role-Based Firebase Auth & Content Management**: Dynamic role hooks (`useRole`) enabling live product editing, stock updates, and inline content management for store managers.
- ⚡ **Zero-Latency Search & Category Filters**: Real-time filtering by category, price ranges, bestseller tags, and stock availability.
- 🛡️ **Build-Time Prerender Safety**: Resilient Firebase fallback initialization ensuring error-free static generation (SSG) across all routes.

---

## 📐 Architecture & Folder Structure

```text
KnitAura/
├── app/
│   ├── about/             # About Us page & FAQ accordion
│   ├── api/
│   │   ├── send-order/    # WhatsApp Order Integration API
│   │   └── sync-sheet/    # Google Sheets Feedback Sync API
│   ├── auth/              # Firebase Auth Login & Signup page
│   ├── cart/              # Cart & Order Confirmation Checkout
│   ├── shop/              # Product Catalog & Dynamic Filtering
│   ├── globals.css        # Tailwind directives & Apple glassmorphism tokens
│   ├── layout.tsx         # Root Layout with Font Providers & Toast
│   └── page.tsx           # Home Landing Page
├── components/
│   ├── about/             # AboutContent, AboutImage, FaqAccordion
│   ├── cart/              # CartItem, OrderConfirmModal
│   ├── home/              # HeroSection, FeaturedProducts, ReviewsSection
│   ├── layout/            # Navbar, Footer
│   ├── manager/           # ManagerBadge, ManagerSaveBar
│   ├── shop/              # ProductCard, ProductForm, ShopFilters
│   └── ui/                # Radix UI Primitives (Accordion, Dialog, Button)
├── contexts/              # AuthContext, CartContext, SettingsContext
├── hooks/                 # useRole, useSettings, useSettingsStore, use-toast
├── lib/
│   ├── firebase.ts        # Firebase app & SDK initialization
│   ├── firestore.ts       # Firestore document helper queries
│   ├── storage.ts         # Secure image upload helper
│   └── types.ts           # TypeScript domain interfaces
├── public/                # Favicons, hero banners, product image assets
├── AUDIT_REPORT.md        # Technical code audit report
├── AGENT_LOG.md           # Continuous execution log
├── package.json           # Next.js dependencies & scripts
├── vercel.json            # Vercel Next.js deployment configuration
└── README.md              # Project documentation
```

---

## 🚀 Quick Start & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/AvishkarRanjane/KnitAura.git
cd KnitAura
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (.env.local)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Launch Development Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### 5. Build Production Bundle
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, API Routes)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend & Database**: Firebase v10 (Authentication, Firestore, Storage)
- **Hosting**: Vercel Production Edge Network

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by **Avishkar Ranjane**.
