# Maison Fleuriste Dubai — Luxury Flower Atelier & E-Commerce

A world-class, premium luxury flower e-commerce platform targeting affluent clients across Dubai & the United Arab Emirates. Built with handcrafted vanilla technologies for maximum speed, zero build-step overhead, and instant live deployment on **Vercel**.

---

## ✨ Features

- **Luxury Botanical Aesthetic**: Soft ivory/cream (`#FDFBF7`), deep royal emerald (`#12281D`), champagne gold (`#C5A059`), serif typography (`Playfair Display`, `Cormorant Garamond`), and modern sans-serif (`Plus Jakarta Sans`).
- **Signature 4-Flower Floating Botanical Animation**: Multi-layered floating physics with subtle rotations and breathing motion borrowed and inspired by Khan Home Floral Line (`ftl.webp`, `ftr.webp`, `fbl.webp`, `fbr.webp`).
- **Full Bilingual Support (English & Arabic RTL)**:
  - Instant toggle between English (LTR) and Arabic (RTL) without reloading the page.
  - Centralized translation dictionary with `localStorage` persistence.
  - Customized typography featuring Google Cairo for Arabic script.
- **Dubai & UAE Commerce Engine**:
  - Currency fixed to UAE Dirhams (AED) with live formatting.
  - White-Glove VIP Chilled Delivery selection for Dubai Emirates (Downtown, Palm Jumeirah, Dubai Marina, Emirates Hills, DIFC, etc.).
  - Date & time slot picker with same-day delivery cutoff calculator.
  - Personalized gold-embossed greeting card message writer.
  - Full shopping cart drawer, wishlist, quick view modal, and checkout simulator with WhatsApp order routing.
- **Responsive Architecture**: Pixel-perfect on mobile, tablet, laptop, and ultra-wide screens.
- **Zero Layout Shifts**: Fixed 84px header geometry with `scrollbar-gutter: stable`.

---

## 🚀 How to Upload to GitHub

Follow these simple steps in your terminal inside this project folder:

### 1. Initialize Git & Add Files (Already prepared)
```bash
git init
git add .
git commit -m "feat: complete luxury flower atelier with Khan botanical animations and bilingual RTL"
git branch -M main
```

### 2. Connect Your GitHub Repository
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g., `maison-fleuriste-dubai`).
2. Copy the repository URL.
3. Link and push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/maison-fleuriste-dubai.git
git push -u origin main
```

---

## ⚡ How to Deploy Live on Vercel

### Method 1: Instant 1-Click Import via Vercel Dashboard (Recommended)

1. Sign in to [vercel.com](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Under **"Import Git Repository"**, select your newly pushed repository `maison-fleuriste-dubai`.
4. Leave all settings at default (**Framework Preset**: `Other`, **Root Directory**: `./`).
5. Click **"Deploy"**.
6. Within 15 seconds, your website will be live worldwide with free SSL (e.g. `https://maison-fleuriste-dubai.vercel.app`)!

### Method 2: Via Vercel CLI

If you have Node.js installed:
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📂 Project Structure

```
flower ecom/
├── 404.html                  # Luxury 404 error page
├── about.html                # Atelier history & florist team
├── admin.html                # Product & order catalog manager
├── cart.html                 # Full shopping bag page
├── checkout.html             # Multi-step luxury checkout
├── contact.html              # Dubai concierge & WhatsApp
├── delivery.html             # Delivery zones & cold chain info
├── index.html                # Luxury homepage with 4-flower animation
├── order-confirmation.html   # VIP order receipt
├── order-tracking.html       # Real-time Dubai driver tracking
├── privacy.html              # Privacy policy
├── product-details.html      # Dynamic single flower arrangement page
├── refunds.html              # Fresh bloom replacement policy
├── shop.html                 # Filterable product grid
├── terms.html                # Atelier terms of service
├── wishlist.html             # Saved favorites collection
├── assets/
│   ├── icons/                # SVG crests and logos
│   └── images/
│       └── khan/             # Floating hero flowers & gallery assets
├── collections/              # Specific floral collections (roses, tulips, orchids, etc.)
├── css/
│   ├── style.css             # Main styling, typography & Khan animations
│   ├── responsive.css        # Mobile & tablet layout rules
│   └── rtl.css               # Right-to-left Arabic mirroring
├── js/
│   ├── main.js               # Global UI, navigation, search, live hero slider
│   ├── i18n.js               # Bilingual English/Arabic engine
│   ├── cart.js               # Persistent cart & checkout state
│   ├── products.js           # Master luxury floral catalog database
│   └── wishlist.js           # Wishlist manager
├── package.json              # Project metadata & local dev scripts
├── vercel.json               # Vercel cleanUrls, cache headers & routing
└── .gitignore                # Production ignore rules
```

---

## 💐 Developed for Dubai Luxury Floral Connoisseurs
*Maison Fleuriste Dubai — Flowers That Speak Without Words.*
