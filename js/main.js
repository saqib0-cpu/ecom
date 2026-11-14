/**
 * Maison Fleuriste Dubai - Main Core Scripts
 * Navigation, Sticky Header, Mobile Drawer, PDP logic, FAQs,
 * Testimonials, Newsletter, Order Tracking, and Toast integrations.
 */

(function () {
  // 0. Auto-highlight active nav link based on current page URL
  function initActiveNavLink() {
    const currentPath = window.location.pathname.replace(/\\/g, "/");
    const currentFile = currentPath.split("/").pop() || "index.html";
    const currentHash = window.location.hash;
    const isCollectionPage = currentPath.includes("/collections/");

    document.querySelectorAll(".nav-desktop-menu > li > a, .mobile-nav-links > li > a").forEach((link) => {
      link.classList.remove("active");
      const href = (link.getAttribute("href") || "").replace(/\\/g, "/");
      const hrefFile = href.split("/").pop().split("?")[0].split("#")[0] || "index.html";
      const hrefHash = href.includes("#") ? "#" + href.split("#")[1] : "";

      if (isCollectionPage && (href.includes("collections") || link.closest(".has-dropdown"))) {
        link.classList.add("active");
        return;
      }

      // Match by filename
      if (hrefFile === currentFile && hrefFile !== "") {
        // For hash links (#bestsellers, #occasions) only mark active when on that hash
        if (hrefHash) {
          if (currentHash === hrefHash) {
            link.classList.add("active");
          }
          return;
        }
        if (!currentHash) {
          link.classList.add("active");
        }
      }
    });
  }
  // 1. Sticky Header & Scroll Effects
  function initStickyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  // 2. Mobile Menu Navigation
  function initMobileMenu() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav-drawer");
    const overlay = document.getElementById("mobile-nav-overlay");
    const closeBtn = document.getElementById("close-mobile-nav");

    if (!toggleBtn || !mobileNav) return;

    function openMobile() {
      mobileNav.classList.add("active");
      if (overlay) overlay.classList.add("active");
      document.body.classList.add("mobile-menu-open");
    }

    function closeMobile() {
      mobileNav.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      document.body.classList.remove("mobile-menu-open");
    }

    toggleBtn.addEventListener("click", openMobile);
    if (closeBtn) closeBtn.addEventListener("click", closeMobile);
    if (overlay) overlay.addEventListener("click", closeMobile);

    // Close on any link click inside
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobile);
    });
  }

  // 3. Homepage Best Sellers Grid
  function initHomepageBestSellers() {
    const grid = document.getElementById("homepage-bestsellers-grid");
    if (!grid || !window.PRODUCTS) return;

    function render() {
      const bestSellers = window.PRODUCTS.filter((p) => p.isBestSeller).slice(0, 6);
      grid.innerHTML = bestSellers.map(window.MaisonFilter.createProductCardHtml).join("");
      if (window.MaisonWishlist) window.MaisonWishlist.updateHeartIcons();
    }

    render();
    window.addEventListener("languageChanged", render);
  }

  // 4. Product Details Page (PDP) Controller
  function initProductDetailsPage() {
    const pdpContainer = document.getElementById("product-details-container");
    if (!pdpContainer || !window.PRODUCTS) return;

    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get("id") || urlParams.get("slug") || "prod-001";
    const prod = window.PRODUCTS.find((p) => p.id === prodId || p.slug === prodId) || window.PRODUCTS[0];

    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;

    // Set page title
    document.title = `${isAr ? prod.nameAr : prod.nameEn} | Maison Fleuriste Dubai`;

    // State for PDP
    let currentSize = "Classic";
    let extraSizePrice = 0;
    let selectedAddons = [];
    let currentQty = 1;

    function renderPDP() {
      const name = isAr ? prod.nameAr : prod.nameEn;
      const desc = isAr ? prod.descriptionAr : prod.descriptionEn;
      const careTips = isAr ? prod.careTipsAr : prod.careTipsEn;
      const badge = isAr ? prod.badgeAr : prod.badgeEn;
      const totalUnitPrice = prod.price + extraSizePrice + selectedAddons.reduce((s, a) => s + a.price, 0);

      // Gallery HTML
      const mainImg = document.getElementById("pdp-main-image");
      if (mainImg) mainImg.src = prod.images[0];

      const thumbsContainer = document.getElementById("pdp-thumbnails");
      if (thumbsContainer) {
        thumbsContainer.innerHTML = prod.images.map((img, idx) => `
          <button type="button" class="pdp-thumb-item ${idx === 0 ? "active" : ""}" onclick="document.getElementById('pdp-main-image').src='${img}'; document.querySelectorAll('.pdp-thumb-item').forEach(b => b.classList.remove('active')); this.classList.add('active');">
            <img src="${img}" alt="${name} view ${idx + 1}" />
          </button>
        `).join("");
      }

      // Breadcrumb & Category
      const catEl = document.getElementById("pdp-category");
      if (catEl) catEl.textContent = prod.category;
      const titleEl = document.getElementById("pdp-title");
      if (titleEl) titleEl.textContent = name;

      // Price
      const priceEl = document.getElementById("pdp-price");
      if (priceEl) priceEl.textContent = formatPrice(totalUnitPrice);
      const oldPriceEl = document.getElementById("pdp-old-price");
      if (oldPriceEl) {
        if (prod.oldPrice) {
          oldPriceEl.textContent = formatPrice(prod.oldPrice);
          oldPriceEl.style.display = "inline";
        } else {
          oldPriceEl.style.display = "none";
        }
      }

      // Ratings
      const ratingScore = document.getElementById("pdp-rating-score");
      if (ratingScore) ratingScore.textContent = prod.rating;
      const reviewCountEl = document.getElementById("pdp-reviews-count");
      if (reviewCountEl) reviewCountEl.textContent = `(${prod.reviewCount} ${t("lbl_reviews", "reviews")})`;

      // Specs
      const stemCountEl = document.getElementById("pdp-stem-count");
      if (stemCountEl) stemCountEl.textContent = prod.stemCount;
      const dimEl = document.getElementById("pdp-dimensions");
      if (dimEl) dimEl.textContent = prod.dimensions;

      // Description & Care Tabs
      const descTab = document.getElementById("tab-content-desc");
      if (descTab) descTab.innerHTML = `<p>${desc}</p>`;
      const careTab = document.getElementById("tab-content-care");
      if (careTab) careTab.innerHTML = `<p>${careTips}</p>`;

      // Related Products Grid
      const relatedGrid = document.getElementById("pdp-related-grid");
      if (relatedGrid) {
        const related = window.PRODUCTS.filter((p) => p.id !== prod.id && (p.category === prod.category || p.flowerType === prod.flowerType)).slice(0, 4);
        relatedGrid.innerHTML = related.map(window.MaisonFilter.createProductCardHtml).join("");
        if (window.MaisonWishlist) window.MaisonWishlist.updateHeartIcons();
      }

      // Wishlist toggle
      const wishBtn = document.getElementById("pdp-wishlist-toggle");
      if (wishBtn) {
        wishBtn.setAttribute("data-wishlist-id", prod.id);
        if (window.MaisonWishlist && window.MaisonWishlist.has(prod.id)) {
          wishBtn.classList.add("in-wishlist");
        } else {
          wishBtn.classList.remove("in-wishlist");
        }
      }
    }

    renderPDP();

    // Size Selection Handler
    document.querySelectorAll(".pdp-size-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".pdp-size-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentSize = btn.getAttribute("data-size");
        extraSizePrice = Number(btn.getAttribute("data-extra")) || 0;
        updatePdpPrice();
      });
    });

    // Addons Checkboxes Handler
    document.querySelectorAll(".pdp-addon-checkbox").forEach((chk) => {
      chk.addEventListener("change", () => {
        const addonId = chk.getAttribute("data-addon-id");
        const addonNameEn = chk.getAttribute("data-name-en");
        const addonNameAr = chk.getAttribute("data-name-ar");
        const addonPrice = Number(chk.getAttribute("data-price")) || 0;

        if (chk.checked) {
          selectedAddons.push({ id: addonId, nameEn: addonNameEn, nameAr: addonNameAr, price: addonPrice });
        } else {
          selectedAddons = selectedAddons.filter((a) => a.id !== addonId);
        }
        updatePdpPrice();
      });
    });

    // Quantity Stepper
    const qtyInput = document.getElementById("pdp-qty-input");
    const minusBtn = document.getElementById("pdp-qty-minus");
    const plusBtn = document.getElementById("pdp-qty-plus");

    if (minusBtn && qtyInput) {
      minusBtn.addEventListener("click", () => {
        let val = Number(qtyInput.value) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          currentQty = val - 1;
        }
      });
    }

    if (plusBtn && qtyInput) {
      plusBtn.addEventListener("click", () => {
        let val = Number(qtyInput.value) || 1;
        qtyInput.value = val + 1;
        currentQty = val + 1;
      });
    }

    function updatePdpPrice() {
      const priceEl = document.getElementById("pdp-price");
      if (priceEl) {
        const totalUnit = prod.price + extraSizePrice + selectedAddons.reduce((s, a) => s + a.price, 0);
        priceEl.textContent = formatPrice(totalUnit);
      }
    }

    // Add to Cart from PDP
    const addCartBtn = document.getElementById("pdp-add-to-cart");
    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        const cardMsg = document.getElementById("pdp-card-message") ? document.getElementById("pdp-card-message").value.trim() : "";
        const deliveryDate = document.getElementById("pdp-delivery-date") ? document.getElementById("pdp-delivery-date").value : "";
        const deliverySlot = document.getElementById("pdp-delivery-slot") ? document.getElementById("pdp-delivery-slot").value : "";

        window.MaisonCart.addItem(prod, {
          size: currentSize,
          addons: selectedAddons,
          cardMessage: cardMsg,
          deliveryDate: deliveryDate,
          deliverySlot: deliverySlot,
          quantity: currentQty
        });
      });
    }

    // Buy Now (Add to cart & go direct to checkout)
    const buyNowBtn = document.getElementById("pdp-buy-now");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const cardMsg = document.getElementById("pdp-card-message") ? document.getElementById("pdp-card-message").value.trim() : "";
        const deliveryDate = document.getElementById("pdp-delivery-date") ? document.getElementById("pdp-delivery-date").value : "";
        const deliverySlot = document.getElementById("pdp-delivery-slot") ? document.getElementById("pdp-delivery-slot").value : "";

        window.MaisonCart.addItem(prod, {
          size: currentSize,
          addons: selectedAddons,
          cardMessage: cardMsg,
          deliveryDate: deliveryDate,
          deliverySlot: deliverySlot,
          quantity: currentQty
        });

        window.location.href = window.location.pathname.includes("/product/") ? "../checkout.html" : "checkout.html";
      });
    }

    // Tabs Switcher
    document.querySelectorAll(".pdp-tab-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".pdp-tab-nav-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".pdp-tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const targetPane = document.getElementById(btn.getAttribute("data-target"));
        if (targetPane) targetPane.classList.add("active");
      });
    });

    window.addEventListener("languageChanged", renderPDP);
  }

  // 5. Dedicated Cart Page (cart.html)
  function initCartPage() {
    const cartPageEl = document.getElementById("cart-page-container");
    if (!cartPageEl) return;

    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;

    function renderCartPage() {
      const itemsContainer = document.getElementById("cart-page-items");
      const emptyEl = document.getElementById("cart-page-empty");
      const contentEl = document.getElementById("cart-page-content");
      const items = window.MaisonCart.getItems();

      if (items.length === 0) {
        if (emptyEl) emptyEl.style.display = "block";
        if (contentEl) contentEl.style.display = "none";
        return;
      }

      if (emptyEl) emptyEl.style.display = "none";
      if (contentEl) contentEl.style.display = "grid";

      itemsContainer.innerHTML = items.map((item) => {
        const name = isAr ? item.nameAr : item.nameEn;
        const sizeLabel = t(`size_${item.size.toLowerCase()}`, item.size);
        return `
          <div class="cart-page-row" data-id="${item.id}">
            <div class="cart-col-product">
              <img src="${item.image}" alt="${name}" class="cart-product-img" />
              <div class="cart-product-details">
                <h3 class="cart-product-title">${name}</h3>
                <span class="cart-product-size">${sizeLabel}</span>
                ${item.addons && item.addons.length ? `<div class="cart-addons">${item.addons.map(a => `<span class="badge-addon">+ ${isAr ? a.nameAr : a.nameEn}</span>`).join(" ")}</div>` : ""}
                ${item.cardMessage ? `<div class="cart-card-msg">💌 "${item.cardMessage}"</div>` : ""}
              </div>
            </div>

            <div class="cart-col-price">
              <span class="col-label">${t("price_currency", "Price")}:</span>
              <span class="item-unit-price">${formatPrice(item.unitPrice)}</span>
            </div>

            <div class="cart-col-qty">
              <div class="qty-stepper">
                <button type="button" onclick="MaisonCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="MaisonCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
            </div>

            <div class="cart-col-total">
              <span class="col-label">${t("cart_subtotal", "Subtotal")}:</span>
              <span class="item-line-total">${formatPrice(item.unitPrice * item.quantity)}</span>
            </div>

            <div class="cart-col-remove">
              <button type="button" class="btn-remove-line" onclick="MaisonCart.removeItem('${item.id}')" title="Remove">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // Update Order Totals
      const sub = window.MaisonCart.getSubtotal();
      const discount = window.MaisonCart.getDiscount();
      const delivery = window.MaisonCart.getDeliveryFee();
      const vat = window.MaisonCart.getVat();
      const total = window.MaisonCart.getTotal();
      const promo = window.MaisonCart.getAppliedPromo();

      document.getElementById("cp-subtotal").textContent = formatPrice(sub);
      document.getElementById("cp-delivery").textContent = delivery === 0 ? t("cart_delivery_free", "Complimentary") : formatPrice(delivery);
      document.getElementById("cp-vat").textContent = formatPrice(vat);
      document.getElementById("cp-total").textContent = formatPrice(total);

      const discountRow = document.getElementById("cp-discount-row");
      if (discountRow) {
        if (discount > 0 && promo) {
          discountRow.style.display = "flex";
          document.getElementById("cp-discount").textContent = `- ${formatPrice(discount)} (${promo.code})`;
        } else {
          discountRow.style.display = "none";
        }
      }
    }

    renderCartPage();

    // Promo Code Application
    const promoBtn = document.getElementById("cp-apply-promo-btn");
    const promoInput = document.getElementById("cp-promo-input");
    const promoMsg = document.getElementById("cp-promo-msg");

    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim();
        const res = window.MaisonCart.applyPromo(code);
        if (promoMsg) {
          promoMsg.textContent = res.message;
          promoMsg.className = res.success ? "promo-msg-success" : "promo-msg-error";
        }
      });
    }

    window.addEventListener("cartUpdated", renderCartPage);
    window.addEventListener("languageChanged", renderCartPage);
  }

  // 6. Dedicated Wishlist Page (wishlist.html)
  function initWishlistPage() {
    const container = document.getElementById("wishlist-grid");
    if (!container || !window.PRODUCTS) return;

    function render() {
      const ids = window.MaisonWishlist ? window.MaisonWishlist.getItems() : [];
      const prods = window.PRODUCTS.filter((p) => ids.includes(p.id));
      const emptyEl = document.getElementById("wishlist-empty-state");

      if (prods.length === 0) {
        container.innerHTML = "";
        if (emptyEl) emptyEl.style.display = "block";
        return;
      }

      if (emptyEl) emptyEl.style.display = "none";
      container.innerHTML = prods.map(window.MaisonFilter.createProductCardHtml).join("");
      if (window.MaisonWishlist) window.MaisonWishlist.updateHeartIcons();
    }

    render();
    window.addEventListener("wishlistUpdated", render);
    window.addEventListener("languageChanged", render);
  }

  // 7. Order Confirmation & Tracking Page
  function initOrderConfirmationPage() {
    const confirmationContainer = document.getElementById("order-confirmation-container");
    if (!confirmationContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    let order = null;

    try {
      const orders = JSON.parse(localStorage.getItem("maison_orders") || "[]");
      order = orders.find((o) => o.orderId === orderId) || JSON.parse(localStorage.getItem("maison_latest_order"));
    } catch (e) {
      console.error(e);
    }

    if (!order) return;

    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;

    const orderRefEl = document.getElementById("conf-order-id");
    if (orderRefEl) orderRefEl.textContent = order.orderId;

    const customerNameEl = document.getElementById("conf-customer-name");
    if (customerNameEl) customerNameEl.textContent = order.customer.fullName;

    const addressEl = document.getElementById("conf-address");
    if (addressEl) {
      addressEl.textContent = `${order.delivery.building}, ${order.delivery.street}, ${order.delivery.areaName}, Dubai`;
    }

    const scheduleEl = document.getElementById("conf-schedule");
    if (scheduleEl) {
      scheduleEl.textContent = `${order.delivery.deliveryDate} (${order.delivery.deliverySlot || "VIP Afternoon"})`;
    }

    const totalEl = document.getElementById("conf-total");
    if (totalEl) totalEl.textContent = formatPrice(order.payment.total);

    // Items list
    const itemsEl = document.getElementById("conf-items-list");
    if (itemsEl) {
      itemsEl.innerHTML = order.items.map((i) => `
        <div class="conf-item-row">
          <img src="${i.image}" alt="${i.nameEn}" />
          <div class="conf-item-info">
            <h4>${isAr ? i.nameAr : i.nameEn}</h4>
            <span>Qty: ${i.quantity} × ${formatPrice(i.unitPrice)}</span>
          </div>
          <div class="conf-item-price">${formatPrice(i.quantity * i.unitPrice)}</div>
        </div>
      `).join("");
    }
  }

  // 8. Order Tracking Lookup Form
  function initOrderTrackingPage() {
    const trackingForm = document.getElementById("order-tracking-lookup-form");
    if (!trackingForm) return;

    trackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputVal = document.getElementById("tracking-order-input").value.trim().toUpperCase();
      const resultCard = document.getElementById("tracking-result-card");
      const notFoundCard = document.getElementById("tracking-not-found");

      const orders = JSON.parse(localStorage.getItem("maison_orders") || "[]");
      const found = orders.find((o) => o.orderId.toUpperCase() === inputVal || (o.customer && o.customer.phone.includes(inputVal)));

      if (found) {
        if (notFoundCard) notFoundCard.style.display = "none";
        if (resultCard) {
          resultCard.style.display = "block";
          document.getElementById("track-order-number").textContent = found.orderId;
          document.getElementById("track-recipient-name").textContent = found.customer.fullName;
          document.getElementById("track-destination").textContent = `${found.delivery.areaName}, Dubai`;
          document.getElementById("track-eta").textContent = `${found.delivery.deliveryDate} (Between 2:00 PM – 4:00 PM)`;
        }
      } else {
        if (resultCard) resultCard.style.display = "none";
        if (notFoundCard) notFoundCard.style.display = "block";
      }
    });
  }

  // 9. Interactive FAQs Accordions
  function initFaqAccordions() {
    document.querySelectorAll(".faq-accordion-item").forEach((item) => {
      const header = item.querySelector(".faq-header");
      if (header) {
        header.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          document.querySelectorAll(".faq-accordion-item").forEach((i) => i.classList.remove("open"));
          if (!isOpen) {
            item.classList.add("open");
          }
        });
      }
    });
  }

  // 10. Newsletter Form Handling
  function initNewsletter() {
    document.querySelectorAll(".newsletter-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          const email = emailInput.value.trim();
          let subscribers = JSON.parse(localStorage.getItem("maison_subscribers") || "[]");
          subscribers.push({ email, date: new Date().toISOString() });
          localStorage.setItem("maison_subscribers", JSON.stringify(subscribers));

          emailInput.value = "";
          const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;
          if (window.MaisonCart) {
            window.MaisonCart.showToast(t("newsletter_success", "Thank you for subscribing! Your 10% welcome code is DUBAI10"));
          }
        }
      });
    });
  }

  // 11. WhatsApp Floating Concierge
  function initWhatsAppWidget() {
    const waBtn = document.querySelector(".floating-whatsapp-btn");
    if (!waBtn) return;

    waBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isAr = window.MaisonLang && window.MaisonLang.isRTL;
      const msg = isAr 
        ? "مرحباً، أود الاستفسار عن باقات الزهور الفاخرة وخدمة التوصيل في دبي." 
        : "Hello! I would like to inquire about luxury flower arrangements and Dubai delivery.";
      window.open(`https://wa.me/971508883538?text=${encodeURIComponent(msg)}`, "_blank");
    });
  }

  // 12. Hero 4-Flower Live Animation Engine (inspired by Khan Home Floral Line)
  function initHeroFlowerPicker() {
    const slides = document.querySelectorAll(".hero-slide-item");
    const swatches = document.querySelectorAll(".hero-flower-swatch");
    const prevBtn = document.getElementById("hero-slide-prev");
    const nextBtn = document.getElementById("hero-slide-next");
    const showcaseWrapper = document.getElementById("hero-floral-showcase");
    const stepEl = document.getElementById("hero-live-step");
    const titleEl = document.getElementById("hero-live-title");
    const subEl = document.getElementById("hero-live-sub");
    const linkEl = document.getElementById("hero-live-link");
    const timerFill = document.getElementById("hero-timer-fill");

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 4500; // 4.5 seconds per flower
    let autoPlayTimer = null;
    let progressTimer = null;
    let isPaused = false;
    let startTime = Date.now();

    function updateCardContent(index) {
      const activeSlide = slides[index];
      if (!activeSlide) return;

      const isAr = document.documentElement.getAttribute("dir") === "rtl" ||
                   (localStorage.getItem("maison_lang") === "ar");

      const title = isAr ? (activeSlide.getAttribute("data-title-ar") || activeSlide.getAttribute("data-title")) : activeSlide.getAttribute("data-title");
      const sub = isAr ? (activeSlide.getAttribute("data-sub-ar") || activeSlide.getAttribute("data-sub")) : activeSlide.getAttribute("data-sub");
      const link = activeSlide.getAttribute("data-link") || "shop.html";

      if (stepEl) stepEl.textContent = `0${index + 1} / 0${totalSlides}`;
      if (titleEl) {
        titleEl.style.opacity = "0";
        setTimeout(() => {
          titleEl.textContent = title;
          titleEl.style.opacity = "1";
        }, 150);
      }
      if (subEl) {
        subEl.style.opacity = "0";
        setTimeout(() => {
          subEl.textContent = sub;
          subEl.style.opacity = "1";
        }, 150);
      }
      if (linkEl) linkEl.setAttribute("href", link);
    }

    function goToSlide(index) {
      if (index === currentIndex && slides[index].classList.contains("active")) return;

      currentIndex = (index + totalSlides) % totalSlides;

      // Update Slides
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentIndex);
      });

      // Update Swatches
      swatches.forEach((swatch, i) => {
        swatch.classList.toggle("active", i === currentIndex);
      });

      // Update Overlaid Info Card
      updateCardContent(currentIndex);

      // Reset and restart the progress bar
      resetProgress();
    }

    function resetProgress() {
      if (progressTimer) cancelAnimationFrame(progressTimer);
      startTime = Date.now();

      function animateProgress() {
        if (!isPaused) {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(100, (elapsed / slideDuration) * 100);
          if (timerFill) timerFill.style.width = pct + "%";

          if (elapsed >= slideDuration) {
            goToSlide(currentIndex + 1);
            return;
          }
        } else {
          // While paused, keep startTime moving so it doesn't jump
          startTime = Date.now() - (parseFloat(timerFill.style.width || "0") / 100) * slideDuration;
        }
        progressTimer = requestAnimationFrame(animateProgress);
      }
      progressTimer = requestAnimationFrame(animateProgress);
    }

    // Attach click handlers to 4 swatches
    swatches.forEach((swatch, i) => {
      swatch.addEventListener("click", () => {
        goToSlide(i);
      });
    });

    // Prev / Next Arrows
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Pause on Hover
    if (showcaseWrapper) {
      showcaseWrapper.addEventListener("mouseenter", () => {
        isPaused = true;
      });
      showcaseWrapper.addEventListener("mouseleave", () => {
        isPaused = false;
      });
    }

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderFrame = document.getElementById("hero-slider-frame");
    if (sliderFrame) {
      sliderFrame.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isPaused = true;
      }, { passive: true });

      sliderFrame.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        isPaused = false;
        if (touchStartX - touchEndX > 50) {
          goToSlide(currentIndex + 1); // Swipe left -> next
        } else if (touchEndX - touchStartX > 50) {
          goToSlide(currentIndex - 1); // Swipe right -> prev
        }
      }, { passive: true });
    }

    // Listen for language change to translate flower card on the fly
    window.addEventListener("languageChanged", () => {
      updateCardContent(currentIndex);
    });

    // Initialize slide 0
    updateCardContent(0);
    resetProgress();
  }

  // Auto initialize on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    initActiveNavLink();
    window.addEventListener("hashchange", initActiveNavLink);
    initStickyHeader();
    initMobileMenu();
    initHeroFlowerPicker();
    initHomepageBestSellers();
    initProductDetailsPage();
    initCartPage();
    initWishlistPage();
    initOrderConfirmationPage();
    initOrderTrackingPage();
    initFaqAccordions();
    initNewsletter();
    initWhatsAppWidget();
  });
})();

