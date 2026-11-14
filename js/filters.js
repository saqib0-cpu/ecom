/**
 * Maison Fleuriste Dubai - Product Card Rendering, Quick View Modal,
 * Dynamic Filtering, Search, and Sorting Engine
 */

(function () {
  // Generate HTML for a luxury product card
  function createProductCardHtml(prod) {
    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;
    const inWishlist = window.MaisonWishlist ? window.MaisonWishlist.has(prod.id) : false;

    const name = isAr ? prod.nameAr : prod.nameEn;
    const shortDesc = isAr ? prod.shortDescAr : prod.shortDescEn;
    const badge = isAr ? prod.badgeAr : prod.badgeEn;
    const currency = t("price_currency", "AED");
    const reviewsLbl = t("lbl_reviews", "reviews");
    const addToCartLbl = t("btn_add_to_cart", "Add to Cart");
    const quickViewLbl = t("btn_quick_view", "Quick View");

    // Product link determination (relative path safe for root or subfolder)
    const isInSubdir = window.location.pathname.includes("/collections/") || window.location.pathname.includes("/product/");
    const productUrl = isInSubdir 
      ? `../product/product-details.html?id=${prod.id}` 
      : `product/product-details.html?id=${prod.id}`;

    const discountTag = prod.oldPrice && prod.oldPrice > prod.price 
      ? `<span class="product-badge-discount">-${Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100)}%</span>` 
      : "";

    const statusBadge = badge 
      ? `<span class="product-badge-luxury">${badge}</span>` 
      : (prod.isSameDayDelivery ? `<span class="product-badge-sameday">${t("lbl_same_day", "Same-Day")}</span>` : "");

    const oldPriceHtml = prod.oldPrice 
      ? `<span class="product-old-price">${formatPrice(prod.oldPrice)}</span>` 
      : "";

    return `
      <article class="luxury-product-card" data-product-id="${prod.id}">
        <div class="card-image-wrap">
          <a href="${productUrl}" class="card-image-link" aria-label="${name}">
            <img src="${prod.images[0]}" alt="${name}" class="card-img primary-img" loading="lazy" />
            ${prod.images[1] ? `<img src="${prod.images[1]}" alt="${name}" class="card-img hover-img" loading="lazy" />` : ""}
          </a>

          <div class="card-badges">
            ${statusBadge}
            ${discountTag}
          </div>

          <button type="button" class="btn-card-wishlist ${inWishlist ? "in-wishlist" : ""}" data-wishlist-id="${prod.id}" title="${t('nav_wishlist', 'Wishlist')}" aria-label="${t('nav_wishlist', 'Wishlist')}">
            <svg class="heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>

          <button type="button" class="btn-card-quickview" onclick="MaisonFilter.openQuickView('${prod.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${quickViewLbl}</span>
          </button>
        </div>

        <div class="card-content">
          <div class="card-category">${isAr ? prod.category : prod.category}</div>
          <h3 class="card-title">
            <a href="${productUrl}">${name}</a>
          </h3>
          <p class="card-desc">${shortDesc}</p>

          <div class="card-rating">
            <div class="stars">★★★★★</div>
            <span class="rating-score">${prod.rating}</span>
            <span class="reviews-count">(${prod.reviewCount} ${reviewsLbl})</span>
          </div>

          <div class="card-pricing">
            <div class="price-group">
              <span class="product-price">${formatPrice(prod.price)}</span>
              ${oldPriceHtml}
            </div>
            <button type="button" class="btn-card-add-cart" onclick="MaisonCart.addItem(PRODUCTS.find(p => p.id === '${prod.id}'))" aria-label="${addToCartLbl}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              <span>${addToCartLbl}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // Quick View Modal System
  let quickViewModalEl = null;

  function initQuickViewModal() {
    if (document.getElementById("maison-quickview-modal")) return;

    quickViewModalEl = document.createElement("div");
    quickViewModalEl.id = "maison-quickview-modal";
    quickViewModalEl.className = "maison-modal quickview-modal";
    quickViewModalEl.innerHTML = `
      <div class="modal-backdrop" onclick="MaisonFilter.closeQuickView()"></div>
      <div class="modal-dialog">
        <button type="button" class="modal-close-btn" onclick="MaisonFilter.closeQuickView()" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="modal-content" id="quickview-modal-content">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;
    document.body.appendChild(quickViewModalEl);
  }

  function openQuickView(productId) {
    initQuickViewModal();
    const prod = (window.PRODUCTS || []).find((p) => p.id === productId);
    if (!prod) return;

    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;

    const name = isAr ? prod.nameAr : prod.nameEn;
    const desc = isAr ? prod.descriptionAr : prod.descriptionEn;
    const badge = isAr ? prod.badgeAr : prod.badgeEn;
    const productUrl = window.location.pathname.includes("/collections/") || window.location.pathname.includes("/product/")
      ? `../product/product-details.html?id=${prod.id}`
      : `product/product-details.html?id=${prod.id}`;

    const contentEl = document.getElementById("quickview-modal-content");
    contentEl.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-gallery">
          <div class="quickview-main-img-wrap">
            <img id="qv-main-image" src="${prod.images[0]}" alt="${name}" />
            ${badge ? `<span class="product-badge-luxury">${badge}</span>` : ""}
          </div>
          <div class="quickview-thumbs">
            ${prod.images.map((img, idx) => `
              <button type="button" class="qv-thumb-btn ${idx === 0 ? "active" : ""}" onclick="document.getElementById('qv-main-image').src='${img}'; document.querySelectorAll('.qv-thumb-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">
                <img src="${img}" alt="Thumbnail ${idx + 1}" />
              </button>
            `).join("")}
          </div>
        </div>

        <div class="quickview-details">
          <div class="quickview-category">${prod.category}</div>
          <h2 class="quickview-title">${name}</h2>
          
          <div class="quickview-rating">
            <div class="stars">★★★★★</div>
            <span class="rating-val">${prod.rating}</span>
            <span class="reviews-count">(${prod.reviewCount} ${t('lbl_reviews', 'reviews')})</span>
          </div>

          <div class="quickview-price-row">
            <span class="qv-price" id="qv-current-price">${formatPrice(prod.price)}</span>
            ${prod.oldPrice ? `<span class="qv-old-price">${formatPrice(prod.oldPrice)}</span>` : ""}
          </div>

          <p class="quickview-desc">${desc}</p>

          <div class="quickview-meta-list">
            <div class="qv-meta-item">
              <strong>${t('lbl_stem_count', 'Stem Count')}:</strong>
              <span>${prod.stemCount}</span>
            </div>
            <div class="qv-meta-item">
              <strong>${t('lbl_dimensions', 'Dimensions')}:</strong>
              <span>${prod.dimensions}</span>
            </div>
            <div class="qv-meta-item">
              <strong>${t('lbl_same_day', 'Dubai Delivery')}:</strong>
              <span>✨ ${t('lbl_same_day', 'Same-Day Delivery Available across Dubai')}</span>
            </div>
          </div>

          <!-- Size selector -->
          <div class="quickview-option-group">
            <label class="option-title">${t('lbl_size_selection', 'Select Bouquet Size')}</label>
            <div class="size-pill-selector" id="qv-size-selector">
              <button type="button" class="size-pill active" data-size="Classic" data-extra="0">${t('size_classic', 'Classic')}</button>
              <button type="button" class="size-pill" data-size="Grand" data-extra="80">${t('size_grand', 'Grand (+AED 80)')}</button>
              <button type="button" class="size-pill" data-size="Deluxe" data-extra="160">${t('size_deluxe', 'Deluxe (+AED 160)')}</button>
              <button type="button" class="size-pill" data-size="Royal" data-extra="280">${t('size_royal', 'Royal (+AED 280)')}</button>
            </div>
          </div>

          <!-- Add to Cart & View Full Details -->
          <div class="quickview-actions">
            <div class="qty-stepper">
              <button type="button" id="qv-qty-minus">-</button>
              <input type="number" id="qv-qty-input" value="1" min="1" max="20" readonly />
              <button type="button" id="qv-qty-plus">+</button>
            </div>
            <button type="button" class="btn-primary qv-add-to-cart-btn" id="qv-submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              <span>${t('btn_add_to_cart', 'Add to Cart')}</span>
            </button>
          </div>

          <div class="quickview-footer-link">
            <a href="${productUrl}" class="link-full-details">
              <span>${t('btn_view_details', 'View Complete Details & Custom Options')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    `;

    // Hook up size selector interaction
    let selectedSize = "Classic";
    let extraCost = 0;
    const priceDisplay = document.getElementById("qv-current-price");

    contentEl.querySelectorAll("#qv-size-selector .size-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        contentEl.querySelectorAll("#qv-size-selector .size-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        selectedSize = pill.getAttribute("data-size");
        extraCost = Number(pill.getAttribute("data-extra")) || 0;
        priceDisplay.textContent = formatPrice(prod.price + extraCost);
      });
    });

    // Hook up quantity stepper
    const qtyInput = document.getElementById("qv-qty-input");
    document.getElementById("qv-qty-minus").addEventListener("click", () => {
      let val = Number(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    document.getElementById("qv-qty-plus").addEventListener("click", () => {
      let val = Number(qtyInput.value) || 1;
      qtyInput.value = val + 1;
    });

    // Hook up add to cart
    document.getElementById("qv-submit-btn").addEventListener("click", () => {
      const qty = Number(qtyInput.value) || 1;
      window.MaisonCart.addItem(prod, {
        size: selectedSize,
        quantity: qty
      });
      closeQuickView();
    });

    quickViewModalEl.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeQuickView() {
    if (quickViewModalEl) {
      quickViewModalEl.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  // Shop Page Filter & Search Controller
  class CatalogManager {
    constructor(options = {}) {
      this.container = options.container || document.getElementById("catalog-grid");
      this.countEl = options.countEl || document.getElementById("catalog-count");
      this.categoryFilter = options.categoryFilter || null;
      this.products = [...(window.PRODUCTS || [])];
      this.state = {
        category: options.initialCategory || "all",
        flowerType: "all",
        color: "all",
        occasion: "all",
        minPrice: 0,
        maxPrice: 2000,
        sameDayOnly: false,
        inStockOnly: false,
        rating4Plus: false,
        sortBy: "featured",
        searchQuery: ""
      };

      this.init();
    }

    init() {
      // Parse URL params
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("category")) this.state.category = urlParams.get("category");
      if (urlParams.get("type")) this.state.flowerType = urlParams.get("type");
      if (urlParams.get("occasion")) this.state.occasion = urlParams.get("occasion");
      if (urlParams.get("q")) this.state.searchQuery = urlParams.get("q");

      this.bindControls();
      this.render();

      window.addEventListener("languageChanged", () => {
        this.render();
      });
    }

    bindControls() {
      // Sort dropdown
      const sortSelect = document.getElementById("sort-select");
      if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
          this.state.sortBy = e.target.value;
          this.render();
        });
      }

      // Flower Type Radios / Buttons
      document.querySelectorAll("[data-filter-type]").forEach((el) => {
        el.addEventListener("click", (e) => {
          document.querySelectorAll("[data-filter-type]").forEach((b) => b.classList.remove("active"));
          el.classList.add("active");
          this.state.flowerType = el.getAttribute("data-filter-type");
          this.render();
        });
      });

      // Color Swatches
      document.querySelectorAll("[data-filter-color]").forEach((el) => {
        el.addEventListener("click", () => {
          const col = el.getAttribute("data-filter-color");
          if (this.state.color === col) {
            el.classList.remove("active");
            this.state.color = "all";
          } else {
            document.querySelectorAll("[data-filter-color]").forEach((b) => b.classList.remove("active"));
            el.classList.add("active");
            this.state.color = col;
          }
          this.render();
        });
      });

      // Price Slider / Inputs
      const priceRange = document.getElementById("price-range-slider");
      const priceValDisplay = document.getElementById("price-range-val");
      if (priceRange) {
        priceRange.addEventListener("input", (e) => {
          this.state.maxPrice = Number(e.target.value);
          if (priceValDisplay) {
            const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
            priceValDisplay.textContent = formatPrice(this.state.maxPrice);
          }
          this.render();
        });
      }

      // Occasion Select or checkboxes
      const occasionSelect = document.getElementById("occasion-filter-select");
      if (occasionSelect) {
        occasionSelect.addEventListener("change", (e) => {
          this.state.occasion = e.target.value;
          this.render();
        });
      }

      // Checkboxes
      const sameDayCheck = document.getElementById("filter-same-day");
      if (sameDayCheck) {
        sameDayCheck.addEventListener("change", (e) => {
          this.state.sameDayOnly = e.target.checked;
          this.render();
        });
      }

      const ratingCheck = document.getElementById("filter-rating-4plus");
      if (ratingCheck) {
        ratingCheck.addEventListener("change", (e) => {
          this.state.rating4Plus = e.target.checked;
          this.render();
        });
      }

      // Clear all
      const clearBtn = document.getElementById("btn-clear-filters");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          this.resetFilters();
        });
      }

      // Search input on catalog
      const searchInput = document.getElementById("catalog-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.state.searchQuery = e.target.value.trim().toLowerCase();
          this.render();
        });
      }
    }

    resetFilters() {
      this.state = {
        category: "all",
        flowerType: "all",
        color: "all",
        occasion: "all",
        minPrice: 0,
        maxPrice: 2000,
        sameDayOnly: false,
        inStockOnly: false,
        rating4Plus: false,
        sortBy: "featured",
        searchQuery: ""
      };

      document.querySelectorAll(".filter-btn, .size-pill, .color-swatch").forEach((b) => b.classList.remove("active"));
      const allTypeBtn = document.querySelector('[data-filter-type="all"]');
      if (allTypeBtn) allTypeBtn.classList.add("active");

      const sameDayCheck = document.getElementById("filter-same-day");
      if (sameDayCheck) sameDayCheck.checked = false;

      const ratingCheck = document.getElementById("filter-rating-4plus");
      if (ratingCheck) ratingCheck.checked = false;

      const priceRange = document.getElementById("price-range-slider");
      if (priceRange) {
        priceRange.value = 2000;
        const priceValDisplay = document.getElementById("price-range-val");
        if (priceValDisplay) priceValDisplay.textContent = "AED 2,000";
      }

      const searchInput = document.getElementById("catalog-search-input");
      if (searchInput) searchInput.value = "";

      this.render();
    }

    getFilteredList() {
      let list = [...this.products];

      // Category filter (slug or name)
      if (this.state.category && this.state.category !== "all") {
        list = list.filter((p) => p.categorySlug === this.state.category || p.category === this.state.category);
      }

      // Flower Type
      if (this.state.flowerType && this.state.flowerType !== "all") {
        list = list.filter((p) => p.flowerType.toLowerCase() === this.state.flowerType.toLowerCase());
      }

      // Color
      if (this.state.color && this.state.color !== "all") {
        list = list.filter((p) => p.color.toLowerCase() === this.state.color.toLowerCase());
      }

      // Occasion
      if (this.state.occasion && this.state.occasion !== "all") {
        list = list.filter((p) => {
          if (!p.occasions) return false;
          return p.occasions.some((occ) => occ.toLowerCase().includes(this.state.occasion.toLowerCase()));
        });
      }

      // Price
      list = list.filter((p) => p.price <= this.state.maxPrice);

      // Same-day only
      if (this.state.sameDayOnly) {
        list = list.filter((p) => p.isSameDayDelivery);
      }

      // 4.8+ Stars
      if (this.state.rating4Plus) {
        list = list.filter((p) => p.rating >= 4.8);
      }

      // Search Query
      if (this.state.searchQuery) {
        const q = this.state.searchQuery;
        list = list.filter((p) => {
          return (
            p.nameEn.toLowerCase().includes(q) ||
            p.nameAr.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.shortDescEn && p.shortDescEn.toLowerCase().includes(q)) ||
            (p.shortDescAr && p.shortDescAr.toLowerCase().includes(q))
          );
        });
      }

      // Sorting
      switch (this.state.sortBy) {
        case "price-low":
          list.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          list.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
          break;
        case "best-selling":
          list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
        case "newest":
          list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case "featured":
        default:
          list.sort((a, b) => (b.isBestSeller ? 2 : 0) - (a.isBestSeller ? 2 : 0));
          break;
      }

      return list;
    }

    render() {
      if (!this.container) return;

      const filtered = this.getFilteredList();
      const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;

      if (this.countEl) {
        this.countEl.textContent = `${t("showing_products", "Showing")} ${filtered.length} ${t("of_products", "of")} ${this.products.length} ${t("products_count", "creations")}`;
      }

      if (filtered.length === 0) {
        this.container.innerHTML = `
          <div class="no-products-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
            <h3>${t("no_products_found", "No floral creations match your selected filters.")}</h3>
            <p>${t("no_products_sub", "Try adjusting your price range, flower type, or clearing active filters.")}</p>
            <button type="button" class="btn-primary" onclick="window.catalogManager.resetFilters()">${t("btn_reset_filters", "Reset Filters")}</button>
          </div>
        `;
        return;
      }

      this.container.innerHTML = filtered.map(createProductCardHtml).join("");

      if (window.MaisonWishlist) {
        window.MaisonWishlist.updateHeartIcons();
      }
    }
  }

  // Global search modal handler
  function initGlobalSearch() {
    const searchModal = document.getElementById("maison-search-modal");
    if (!searchModal) return;

    const searchInput = document.getElementById("global-search-input");
    const searchResults = document.getElementById("search-live-results");

    function performSearch(query) {
      const q = (query || "").trim().toLowerCase();
      if (!q) {
        searchResults.innerHTML = "";
        return;
      }

      const isAr = window.MaisonLang && window.MaisonLang.isRTL;
      const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;

      const matches = (window.PRODUCTS || []).filter((p) => {
        return (
          p.nameEn.toLowerCase().includes(q) ||
          p.nameAr.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shortDescEn && p.shortDescEn.toLowerCase().includes(q))
        );
      }).slice(0, 6);

      if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-empty">No flowers found matching "${query}"</div>`;
        return;
      }

      const isInSubdir = window.location.pathname.includes("/collections/") || window.location.pathname.includes("/product/");
      const productPrefix = isInSubdir ? "../product/product-details.html?id=" : "product/product-details.html?id=";

      searchResults.innerHTML = matches.map((p) => {
        const name = isAr ? p.nameAr : p.nameEn;
        return `
          <a href="${productPrefix}${p.id}" class="search-result-item">
            <img src="${p.images[0]}" alt="${name}" />
            <div class="result-info">
              <span class="result-title">${name}</span>
              <span class="result-cat">${p.category}</span>
              <span class="result-price">${formatPrice(p.price)}</span>
            </div>
          </a>
        `;
      }).join("");
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        performSearch(e.target.value);
      });
    }

    // Open/Close
    document.querySelectorAll(".open-search-modal-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        searchModal.classList.add("active");
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      });
    });

    document.querySelectorAll(".close-search-modal-btn, #search-modal-backdrop").forEach((btn) => {
      btn.addEventListener("click", () => {
        searchModal.classList.remove("active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initGlobalSearch();
  });

  window.MaisonFilter = {
    createProductCardHtml,
    openQuickView,
    closeQuickView,
    CatalogManager
  };
})();

