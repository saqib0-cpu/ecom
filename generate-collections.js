const fs = require('fs');
const path = require('path');

const collections = [
  {
    slug: "red-roses",
    nameEn: "Red Roses",
    nameAr: "الورود الحمراء",
    descEn: "Long-stemmed Ecuadorian red roses hand-arranged in luxury hatboxes and bespoke wraps for Dubai's most memorable moments.",
    descAr: "ورود إكوادورية حمراء طويلة الساق منسقة يدوياً في صناديق مخملية وباقات حصرية لأروع اللحظات في دبي.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "red-roses"
  },
  {
    slug: "pink-roses",
    nameEn: "Pink Roses",
    nameAr: "الورود الوردية",
    descEn: "Soft pastel blush, sweet mondial, and English garden pink roses expressing heartfelt warmth and refined affection.",
    descAr: "درجات الوردي الباستيل وورود الحدائق الإنجليزية التي تعبر عن الدفء والتقدير والمشاعر الصادقة.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "pink-roses"
  },
  {
    slug: "white-roses",
    nameEn: "White Roses",
    nameAr: "الورود البيضاء",
    descEn: "Crisp Dutch Avalanche roses in pristine white tones, crafted for regal ceremonies, anniversaries, and modern interiors.",
    descAr: "ورود أفالانش الهولندية الناصعة البياض، منسقة للمناسبات الملكية والاحتفالات وأرقى التصاميم المعمارية.",
    image: "https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "white-roses"
  },
  {
    slug: "yellow-roses",
    nameEn: "Yellow Roses",
    nameAr: "الورود الصفراء",
    descEn: "Vibrant yellow roses radiating warmth, optimism, and celebration throughout Dubai homes and offices.",
    descAr: "ورود صفراء مشرقة تنبض بالدفء والتفاؤل والاحتفال، تضيء منازل ومكاتب دبي بأبهى حلة.",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "yellow-roses"
  },
  {
    slug: "tulips",
    nameEn: "Tulips",
    nameAr: "زهور التوليب",
    descEn: "Directly imported from Holland's Royal Flower Auction. Sculptural, vibrant tulips in captivating color palettes.",
    descAr: "مستوردة مباشرة من مزادات الزهور الملكية في هولندا، تتميز بألوانها الجذابة وتناسقها الفني المذهل.",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "tulips"
  },
  {
    slug: "orchids",
    nameEn: "Orchids",
    nameAr: "زهور الأوركيد",
    descEn: "Architectural Phalaenopsis and Vanda orchids planted in bespoke stone and champagne vessels.",
    descAr: "أزهار الأوركيد الملكية المتدلية والمزروعة في أوانٍ حجرية وذهبية فاخرة تمنح المكان رونقاً استثنائياً.",
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "orchids"
  },
  {
    slug: "peonies",
    nameEn: "Peonies",
    nameAr: "زهور البيوني",
    descEn: "Plush, cloud-like ruffled petals with intoxicating fragrance. Seasonal, rare, and exceedingly prestigious.",
    descAr: "بتلات مخملية متموجة كالسحاب مع عطر ساحر، نادرة وموسمية ومفضلة لدى عشاق الفخامة الرفيعة.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "peonies"
  },
  {
    slug: "lilies",
    nameEn: "Lilies",
    nameAr: "زهور الزنابق",
    descEn: "Majestic Casablanca and Oriental lilies that perfume Dubai grand salons and entrance halls.",
    descAr: "زنابق كازابلانكا والزنابق الشرقية العملاقة التي تملأ صالونات وقصور دبي بعبيرها الفواح الذي لا يُنسى.",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "lilies"
  },
  {
    slug: "sunflowers",
    nameEn: "Sunflowers",
    nameAr: "دوار الشمس",
    descEn: "Bold, sun-drenched floral faces bringing immediate warmth, cheer, and positive energy.",
    descAr: "أزهار ذهبية مرحة تبعث الطاقة الإيجابية والدفء والابتسامة في قلوب الأحباب.",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "sunflowers"
  },
  {
    slug: "hydrangeas",
    nameEn: "Hydrangeas",
    nameAr: "زهور الهيدرانجيا",
    descEn: "Plump pastel blue, mauve, and antique blush hydrangea spheres designed for modern Dubai aesthetics.",
    descAr: "كرات زهرية ضخمة بألوان الأزرق السماوي والوردي المتبدل صُممت لتناسب أرقى الديكورات الحديثة.",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "hydrangeas"
  },
  {
    slug: "carnations",
    nameEn: "Carnations",
    nameAr: "زهور القرنفل",
    descEn: "Artisan peach, champagne, and blush carnations lasting over 14 days in water with subtle spicy undertones.",
    descAr: "زهور قرنفل بألوان الخوخ والشامبانيا تدوم أكثر من 14 يوماً بنضارة متجددة وعبير هادئ.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "carnations"
  },
  {
    slug: "mixed-bouquets",
    nameEn: "Mixed Bouquets",
    nameAr: "باقات منوعة فاخرة",
    descEn: "Curated combinations of premium roses, orchids, delphiniums, and exotic eucalyptus foliage.",
    descAr: "مزيج متناغم يجمع أرقى أنواع الورود والأوركيد والدلفينيوم مع الأوراق العطرية الفاخرة.",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "mixed-bouquets"
  },
  {
    slug: "luxury-bouquets",
    nameEn: "Luxury Bouquets",
    nameAr: "باقات كبار الشخصيات VIP",
    descEn: "Grand monumental arrangements with 75 to 150+ stems crafted for UAE royal families and luxury estates.",
    descAr: "تنسيقات عملاقة تضم من 75 إلى أكثر من 150 زهرة نادرة مخصصة للمناسبات الملكية والقصور الفاخرة.",
    image: "https://images.unsplash.com/photo-1548094878-84ced0f68c08?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "luxury-bouquets"
  },
  {
    slug: "wedding-flowers",
    nameEn: "Wedding Flowers",
    nameAr: "زهور الأعراس والمناسبات",
    descEn: "Handcrafted bridal bouquets, floral arches, and centerpieces for destination weddings across Dubai.",
    descAr: "مسكات عروس ملكية، أقواس زهور، وترتيبات طاولات استثنائية لأفخم حفلات الزفاف في الإمارات.",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "wedding-flowers"
  },
  {
    slug: "preserved-flowers",
    nameEn: "Preserved Flowers",
    nameAr: "الزهور الدائمة المحفوظة",
    descEn: "100% genuine Ecuadorian roses preserved at their prime bloom, housed in crystal domes and jewelry boxes.",
    descAr: "ورود إكوادورية طبيعية محفوظة عند ذروة تفتحها داخل قباب كريستالية وصناديق مجوهرات راقية.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    categoryKey: "preserved-flowers"
  }
];

function generateCollectionHtml(col) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${col.nameEn} Collection | Maison Fleuriste Dubai</title>
  <meta name="description" content="${col.descEn}" />

  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/responsive.css" />
  <link rel="stylesheet" href="../css/rtl.css" />
</head>
<body>

  <!-- Announcement Bar -->
  <div class="announcement-bar">
    <div class="container">
      <span class="announcement-text" data-i18n="announcement_1">
        ✨ Luxury Flowers Hand-Delivered Across Dubai | Same-Day Delivery Available
      </span>
    </div>
  </div>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="brand-logo-wrap">
        <span class="brand-logo-text">
          <span class="brand-logo-flower">✤</span>
          <span data-i18n="brand_name">Maison Fleuriste</span>
        </span>
        <span class="brand-tagline-sub" data-i18n="brand_subtitle">Dubai Floral Atelier</span>
      </a>

      <nav class="desktop-navigation">
        <ul class="nav-desktop-menu">
          <li><a href="../index.html" data-i18n="nav_home">Home</a></li>
          <li><a href="../shop.html" data-i18n="nav_shop">Shop Flowers</a></li>
          <li><a href="red-roses.html" class="active" data-i18n="nav_collections">Collections</a></li>
          <li><a href="../shop.html?bestsellers=true" data-i18n="nav_best_sellers">Best Sellers</a></li>
          <li><a href="../about.html" data-i18n="nav_about">About Us</a></li>
          <li><a href="../contact.html" data-i18n="nav_contact">Contact</a></li>
          <li><a href="../delivery.html" data-i18n="nav_delivery">Dubai Delivery</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <div class="lang-switcher-pill">
          <button type="button" class="lang-switch-btn active" data-lang="en">EN</button>
          <span style="color: var(--border-light);">|</span>
          <button type="button" class="lang-switch-btn" data-lang="ar">العربية</button>
        </div>

        <button type="button" class="header-icon-btn open-search-modal-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>

        <a href="../wishlist.html" class="header-icon-btn" aria-label="Wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="badge-count wishlist-count-badge">0</span>
        </a>

        <button type="button" class="header-icon-btn open-cart-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
          <span class="badge-count cart-count-badge">0</span>
        </button>

        <button type="button" class="mobile-hamburger" id="mobile-menu-toggle" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Dedicated Collection Hero Banner -->
  <section class="page-hero-banner">
    <img src="${col.image}" alt="${col.nameEn} Dubai Collection" class="page-hero-bg" />
    <div class="container page-hero-content">
      <span class="page-hero-badge">Bespoke Collection • Dubai</span>
      <h1 class="page-hero-title">${col.nameEn}</h1>
      <p class="page-hero-subtitle">${col.descEn}</p>
      <nav class="breadcrumb-nav">
        <a href="../index.html" data-i18n="breadcrumbs_home">Home</a>
        <span class="separator">/</span>
        <a href="../shop.html" data-i18n="breadcrumbs_shop">Shop</a>
        <span class="separator">/</span>
        <span>${col.nameEn}</span>
      </nav>
    </div>
  </section>

  <!-- Collection Product Catalog Section -->
  <main class="shop-layout-section">
    <div class="container shop-grid-container">
      <!-- Collection Sidebar Nav -->
      <aside class="shop-sidebar">
        <div class="sidebar-header">
          <h3 data-i18n="nav_collections">Collections</h3>
        </div>
        <div class="filter-group">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.875rem;">
            ${collections.map(c => `
              <li>
                <a href="${c.slug}.html" style="${c.slug === col.slug ? 'font-weight: 700; color: var(--gold-dark);' : 'color: var(--text-muted);'}">
                  ${c.nameEn}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="filter-group">
          <h4 class="filter-group-title" data-i18n="filter_availability">Availability</h4>
          <label class="custom-checkbox-label">
            <input type="checkbox" id="col-filter-sameday" />
            <span data-i18n="filter_same_day_only">Same-Day Delivery Only</span>
          </label>
        </div>
      </aside>

      <!-- Products Grid & Toolbar Area -->
      <div class="shop-main-content">
        <div class="shop-toolbar">
          <div class="catalog-count-text" id="catalog-count">
            Showing creations in ${col.nameEn}
          </div>
          <div class="toolbar-controls">
            <div class="sort-dropdown-wrap">
              <label for="col-sort-select" data-i18n="sort_by">Sort By:</label>
              <select id="col-sort-select" class="sort-select">
                <option value="featured" data-i18n="sort_featured">Featured</option>
                <option value="price-low" data-i18n="sort_price_low">Price: Low to High</option>
                <option value="price-high" data-i18n="sort_price_high">Price: High to Low</option>
                <option value="rating" data-i18n="sort_rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div class="product-grid" id="collection-grid"></div>
      </div>
    </div>
  </main>

  <!-- Complete Luxury Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top-grid">
        <div class="footer-brand">
          <h3 data-i18n="brand_name">Maison Fleuriste</h3>
          <p data-i18n="footer_tagline">Dubai's premier destination for luxury floral artistry.</p>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer_col_service">Client Care</h4>
          <ul>
            <li><a href="../contact.html" data-i18n="footer_link_contact">Contact Us</a></li>
            <li><a href="../delivery.html" data-i18n="footer_link_delivery">Dubai Delivery Info</a></li>
            <li><a href="../order-tracking.html" data-i18n="footer_link_tracking">Track Your Order</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer_col_shop">Floral Collections</h4>
          <ul>
            <li><a href="red-roses.html" data-i18n="footer_link_roses">Royal Roses</a></li>
            <li><a href="tulips.html" data-i18n="footer_link_tulips">Dutch Tulips</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer_col_company">Maison</h4>
          <ul>
            <li><a href="../about.html" data-i18n="footer_link_about">Our Story</a></li>
            <li><a href="../privacy.html" data-i18n="footer_link_privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <p data-i18n="footer_rights">© 2026 Maison Fleuriste Dubai. All Rights Reserved.</p>
      </div>
    </div>
  </footer>

  <!-- Slide-over Cart Drawer -->
  <div class="cart-overlay" id="cart-overlay"></div>
  <aside class="cart-drawer" id="cart-drawer">
    <div class="cart-drawer-header">
      <h3 data-i18n="cart_title">Your Floral Selection</h3>
      <button type="button" class="close-drawer-btn" id="close-cart-drawer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div class="shipping-progress-wrap" id="cart-free-shipping-progress"></div>
    <div class="cart-drawer-items-list" id="cart-drawer-items"></div>
    <div class="cart-drawer-footer" id="cart-drawer-footer">
      <div class="drawer-summary-row total-row">
        <span data-i18n="cart_total">Estimated Total</span>
        <span id="drawer-total">AED 0</span>
      </div>
      <a href="../checkout.html" class="btn-primary btn-drawer-checkout" data-i18n="btn_checkout">Proceed to Secure Checkout</a>
    </div>
  </aside>

  <!-- Mobile Nav Drawer -->
  <div class="cart-overlay" id="mobile-nav-overlay"></div>
  <aside class="mobile-nav-drawer" id="mobile-nav-drawer">
    <div class="mobile-nav-header">
      <span class="brand-logo-text" data-i18n="brand_name">Maison Fleuriste</span>
      <button type="button" class="close-drawer-btn" id="close-mobile-nav">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <ul class="mobile-nav-links">
      <li><a href="../index.html" data-i18n="nav_home">Home</a></li>
      <li><a href="../shop.html" data-i18n="nav_shop">Shop Flowers</a></li>
      <li><a href="red-roses.html" data-i18n="nav_collections">Collections</a></li>
      <li><a href="../about.html" data-i18n="nav_about">About Us</a></li>
      <li><a href="../contact.html" data-i18n="nav_contact">Contact</a></li>
    </ul>
  </aside>

  <!-- Global Live Search Modal -->
  <div class="maison-modal" id="maison-search-modal">
    <div class="modal-backdrop" id="search-modal-backdrop"></div>
    <div class="modal-dialog">
      <button type="button" class="modal-close-btn close-search-modal-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="search-modal-inner">
        <div class="search-input-wrap">
          <input type="text" id="global-search-input" placeholder="Search flowers..." data-i18n-placeholder="nav_search" />
        </div>
        <div class="search-results-list" id="search-live-results"></div>
      </div>
    </div>
  </div>

  <!-- WhatsApp Floating Button -->
  <a href="https://wa.me/971508883538" class="floating-whatsapp-btn" target="_blank" rel="noopener">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  </a>

  <!-- Scripts -->
  <script src="../js/products.js"></script>
  <script src="../js/translations.js"></script>
  <script src="../js/language.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/wishlist.js"></script>
  <script src="../js/filters.js"></script>
  <script src="../js/main.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const grid = document.getElementById("collection-grid");
      const countEl = document.getElementById("catalog-count");
      const sortSelect = document.getElementById("col-sort-select");
      const sameDayCheck = document.getElementById("col-filter-sameday");

      function getCollectionProducts() {
        let items = (window.PRODUCTS || []).filter(p => {
          return p.categorySlug === "${col.categoryKey}" || 
                 p.category.toLowerCase().includes("${col.nameEn.toLowerCase()}") ||
                 (p.flowerType && p.flowerType.toLowerCase().includes("${col.nameEn.toLowerCase()}"));
        });
        
        // If specific collection has few exact items, fallback to related items so page is NEVER empty!
        if (items.length === 0) {
          items = (window.PRODUCTS || []).slice(0, 4);
        }

        if (sameDayCheck && sameDayCheck.checked) {
          items = items.filter(p => p.isSameDayDelivery);
        }

        const sortVal = sortSelect ? sortSelect.value : "featured";
        if (sortVal === "price-low") items.sort((a,b) => a.price - b.price);
        if (sortVal === "price-high") items.sort((a,b) => b.price - a.price);
        if (sortVal === "rating") items.sort((a,b) => b.rating - a.rating);

        return items;
      }

      function renderCollection() {
        const items = getCollectionProducts();
        if (grid) {
          grid.innerHTML = items.map(window.MaisonFilter.createProductCardHtml).join("");
        }
        if (countEl) {
          countEl.textContent = \`Showing \${items.length} creations in ${col.nameEn}\`;
        }
        if (window.MaisonWishlist) {
          window.MaisonWishlist.updateHeartIcons();
        }
      }

      if (sortSelect) sortSelect.addEventListener("change", renderCollection);
      if (sameDayCheck) sameDayCheck.addEventListener("change", renderCollection);

      renderCollection();
      window.addEventListener("languageChanged", renderCollection);
    });
  </script>
</body>
</html>`;
}

// Generate files
const collectionsDir = path.join(__dirname, 'collections');
if (!fs.existsSync(collectionsDir)) {
  fs.mkdirSync(collectionsDir, { recursive: true });
}

collections.forEach(col => {
  const filePath = path.join(collectionsDir, `${col.slug}.html`);
  fs.writeFileSync(filePath, generateCollectionHtml(col), 'utf8');
  console.log(`Generated: collections/${col.slug}.html`);
});

