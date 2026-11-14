/**
 * Maison Fleuriste Dubai - Wishlist Engine
 * LocalStorage persistence, heart toggling, badge counters, toast alerts
 */

(function () {
  const STORAGE_KEY = "maison_flower_wishlist";
  let wishlist = [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) wishlist = JSON.parse(saved);
  } catch (e) {
    wishlist = [];
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    updateBadges();
    updateHeartIcons();
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { wishlist } }));
  }

  function toggle(productId) {
    const idx = wishlist.indexOf(productId);
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;
    const showToast = window.MaisonCart ? window.MaisonCart.showToast : () => {};

    if (idx > -1) {
      wishlist.splice(idx, 1);
      save();
      showToast(t("toast_removed_wishlist", "Removed from wishlist"));
      return false;
    } else {
      wishlist.push(productId);
      save();
      showToast(t("toast_added_to_wishlist", "Added to wishlist"));
      return true;
    }
  }

  function has(productId) {
    return wishlist.includes(productId);
  }

  function getItems() {
    return [...wishlist];
  }

  function getCount() {
    return wishlist.length;
  }

  function updateBadges() {
    const count = getCount();
    document.querySelectorAll(".wishlist-count-badge").forEach((el) => {
      el.textContent = count;
      if (count > 0) {
        el.classList.add("visible");
      } else {
        el.classList.remove("visible");
      }
    });
  }

  function updateHeartIcons() {
    document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
      const id = btn.getAttribute("data-wishlist-id");
      if (has(id)) {
        btn.classList.add("in-wishlist");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("in-wishlist");
        btn.setAttribute("aria-pressed", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateBadges();
    updateHeartIcons();

    // Delegate wishlist clicks
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-wishlist-id]");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-wishlist-id");
        toggle(id);
      }
    });
  });

  window.MaisonWishlist = {
    toggle,
    has,
    getItems,
    getCount,
    updateHeartIcons
  };
})();

