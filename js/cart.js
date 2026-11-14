/**
 * Maison Fleuriste Dubai - Shopping Cart Engine
 * LocalStorage persistence, custom options, size multipliers, add-ons,
 * Dubai delivery calculation, promo codes, and slide-over drawer UI
 */

(function () {
  const STORAGE_KEY = "maison_flower_cart";
  const PROMO_STORAGE_KEY = "maison_promo_code";
  const FREE_DELIVERY_THRESHOLD = 500;
  const STANDARD_DELIVERY_FEE = 35;

  let cart = [];
  let appliedPromo = null;

  // Load from localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
    const savedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
    if (savedPromo) appliedPromo = JSON.parse(savedPromo);
  } catch (e) {
    cart = [];
    appliedPromo = null;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    if (appliedPromo) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
    updateBadges();
    renderDrawer();
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart } }));
  }

  // Calculate pricing
  function getSubtotal() {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  function getDiscount() {
    const sub = getSubtotal();
    if (!appliedPromo || sub <= 0) return 0;
    if (appliedPromo.type === "percent") {
      return Math.round((sub * appliedPromo.value) / 100);
    }
    if (appliedPromo.type === "fixed") {
      return Math.min(appliedPromo.value, sub);
    }
    return 0;
  }

  function getDeliveryFee() {
    const sub = getSubtotal();
    if (sub <= 0) return 0;
    return sub >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }

  function getVat() {
    const taxable = Math.max(0, getSubtotal() - getDiscount());
    return Math.round(taxable * 0.05);
  }

  function getTotal() {
    const sub = getSubtotal();
    if (sub <= 0) return 0;
    return Math.max(0, sub - getDiscount()) + getVat() + getDeliveryFee();
  }

  function getCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Add Item to cart
  function addItem(product, options = {}) {
    const size = options.size || "Classic";
    let extraPrice = 0;
    if (size === "Grand") extraPrice = 80;
    if (size === "Deluxe") extraPrice = 160;
    if (size === "Royal") extraPrice = 280;

    let addonsCost = 0;
    const addons = options.addons || [];
    addons.forEach((ad) => {
      addonsCost += (ad.price || 0);
    });

    const unitPrice = (product.price || 0) + extraPrice + addonsCost;
    const cartItemId = `${product.id}_${size}_${addons.map(a => a.id).sort().join("-")}`;

    const existingIndex = cart.findIndex((i) => i.id === cartItemId);
    const qtyToAdd = Math.max(1, Number(options.quantity) || 1);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qtyToAdd;
      if (options.cardMessage) cart[existingIndex].cardMessage = options.cardMessage;
      if (options.deliveryDate) cart[existingIndex].deliveryDate = options.deliveryDate;
      if (options.deliverySlot) cart[existingIndex].deliverySlot = options.deliverySlot;
    } else {
      cart.push({
        id: cartItemId,
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        image: product.images && product.images[0] ? product.images[0] : "",
        unitPrice: unitPrice,
        basePrice: product.price,
        size: size,
        addons: addons,
        cardMessage: options.cardMessage || "",
        deliveryDate: options.deliveryDate || "",
        deliverySlot: options.deliverySlot || "",
        quantity: qtyToAdd
      });
    }

    save();
    showToast(window.MaisonLang ? window.MaisonLang.t("toast_added_to_cart") : "Added to Cart!");
    openDrawer();
  }

  function updateQuantity(cartItemId, qty) {
    const idx = cart.findIndex((i) => i.id === cartItemId);
    if (idx > -1) {
      if (qty <= 0) {
        cart.splice(idx, 1);
      } else {
        cart[idx].quantity = qty;
      }
      save();
    }
  }

  function removeItem(cartItemId) {
    cart = cart.filter((i) => i.id !== cartItemId);
    save();
  }

  function clearCart() {
    cart = [];
    appliedPromo = null;
    save();
  }

  // Promo code validation
  function applyPromo(code) {
    const clean = (code || "").trim().toUpperCase();
    if (clean === "DUBAI10") {
      appliedPromo = { code: "DUBAI10", type: "percent", value: 10, label: "10% VIP Privilege" };
      save();
      return { success: true, message: "10% discount applied!" };
    }
    if (clean === "WELCOME50") {
      appliedPromo = { code: "WELCOME50", type: "fixed", value: 50, label: "AED 50 Welcome Gift" };
      save();
      return { success: true, message: "AED 50 discount applied!" };
    }
    if (clean === "ROYAL15") {
      appliedPromo = { code: "ROYAL15", type: "percent", value: 15, label: "15% Royal Privilege" };
      save();
      return { success: true, message: "15% discount applied!" };
    }
    return { success: false, message: "Invalid promo code" };
  }

  function removePromo() {
    appliedPromo = null;
    save();
  }

  // Toast Notification
  function showToast(message) {
    let container = document.getElementById("maison-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "maison-toast-container";
      container.className = "maison-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "maison-toast";
    toast.innerHTML = `
      <div class="toast-content">
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        <span>${message}</span>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Update Badges on Header
  function updateBadges() {
    const count = getCount();
    document.querySelectorAll(".cart-count-badge").forEach((el) => {
      el.textContent = count;
      if (count > 0) {
        el.classList.add("visible");
      } else {
        el.classList.remove("visible");
      }
    });
  }

  // Drawer Controls
  function openDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer && overlay) {
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.classList.add("drawer-open");
      renderDrawer();
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("drawer-open");
    }
  }

  function toggleDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer && drawer.classList.contains("active")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  // Render Slide-over Drawer
  function renderDrawer() {
    const container = document.getElementById("cart-drawer-items");
    const footerContainer = document.getElementById("cart-drawer-footer");
    const emptyState = document.getElementById("cart-drawer-empty");
    const progressContainer = document.getElementById("cart-free-shipping-progress");

    if (!container) return;

    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;

    const subtotal = getSubtotal();
    const count = getCount();

    // Free delivery progress bar
    if (progressContainer) {
      if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        progressContainer.innerHTML = `
          <div class="shipping-unlocked">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>
            <span>${t("cart_free_delivery_unlocked", "✨ You have unlocked Complimentary Dubai Delivery!")}</span>
          </div>
          <div class="progress-track"><div class="progress-bar filled" style="width: 100%;"></div></div>
        `;
      } else {
        const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
        const percent = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
        const text = isAr 
          ? `أضف زهوراً بقيمة ${remaining} د.إ أخرى للحصول على توصيل مجاني مبرد في دبي!` 
          : `Add ${formatPrice(remaining)} more for Complimentary White-Glove Dubai Delivery!`;
        progressContainer.innerHTML = `
          <div class="shipping-needed">
            <span>${text}</span>
          </div>
          <div class="progress-track"><div class="progress-bar" style="width: ${percent}%;"></div></div>
        `;
      }
    }

    if (cart.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      if (footerContainer) footerContainer.style.display = "none";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (footerContainer) footerContainer.style.display = "block";

    container.innerHTML = cart.map((item) => {
      const name = isAr ? item.nameAr : item.nameEn;
      const sizeLabel = t(`size_${item.size.toLowerCase()}`, item.size);
      const addonsHtml = item.addons && item.addons.length > 0 
        ? `<div class="cart-item-addons">${item.addons.map(a => `<span class="badge-addon">+ ${isAr ? a.nameAr : a.nameEn}</span>`).join(" ")}</div>` 
        : "";

      return `
        <div class="cart-drawer-item" data-id="${item.id}">
          <img src="${item.image}" alt="${name}" class="cart-item-thumb" />
          <div class="cart-item-info">
            <h4 class="cart-item-name">${name}</h4>
            <div class="cart-item-meta">
              <span class="cart-item-size">${sizeLabel}</span>
              <span class="cart-item-price">${formatPrice(item.unitPrice)}</span>
            </div>
            ${addonsHtml}
            ${item.deliveryDate ? `<div class="cart-item-slot">📅 ${item.deliveryDate}</div>` : ""}
            <div class="cart-item-actions">
              <div class="qty-stepper">
                <button type="button" class="btn-qty-minus" onclick="MaisonCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" class="btn-qty-plus" onclick="MaisonCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
              <button type="button" class="btn-remove-item" onclick="MaisonCart.removeItem('${item.id}')" title="${t('btn_remove', 'Remove')}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Update Drawer Footer Totals
    const discount = getDiscount();
    const delivery = getDeliveryFee();
    const vat = getVat();
    const total = getTotal();

    const drawerSubtotalEl = document.getElementById("drawer-subtotal");
    const drawerDiscountRow = document.getElementById("drawer-discount-row");
    const drawerDiscountEl = document.getElementById("drawer-discount");
    const drawerDeliveryEl = document.getElementById("drawer-delivery");
    const drawerVatEl = document.getElementById("drawer-vat");
    const drawerTotalEl = document.getElementById("drawer-total");

    if (drawerSubtotalEl) drawerSubtotalEl.textContent = formatPrice(subtotal);
    if (drawerDeliveryEl) {
      drawerDeliveryEl.textContent = delivery === 0 ? t("cart_delivery_free", "Complimentary") : formatPrice(delivery);
    }
    if (drawerVatEl) drawerVatEl.textContent = formatPrice(vat);
    if (drawerTotalEl) drawerTotalEl.textContent = formatPrice(total);

    if (drawerDiscountRow) {
      if (discount > 0 && appliedPromo) {
        drawerDiscountRow.style.display = "flex";
        if (drawerDiscountEl) drawerDiscountEl.textContent = `- ${formatPrice(discount)} (${appliedPromo.code})`;
      } else {
        drawerDiscountRow.style.display = "none";
      }
    }
  }

  // Setup DOM Listeners
  document.addEventListener("DOMContentLoaded", () => {
    updateBadges();

    // Bind cart open buttons
    document.querySelectorAll(".open-cart-btn, [data-open-cart]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    // Bind cart close button & overlay
    const closeBtn = document.getElementById("close-cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);

    // Listen to language changes to re-render drawer
    window.addEventListener("languageChanged", () => {
      renderDrawer();
    });
  });

  // Global API
  window.MaisonCart = {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItems: () => [...cart],
    getCount,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getVat,
    getTotal,
    applyPromo,
    removePromo,
    getAppliedPromo: () => appliedPromo,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    renderDrawer,
    showToast
  };
})();

