/**
 * Maison Fleuriste Dubai - Language & RTL Management Engine
 * Instant bilingual switching, localStorage persistence, RTL direction toggling
 */

(function () {
  const STORAGE_KEY = "maison_flower_lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || "en";

  // Translate string helper
  function t(key, fallback = "") {
    if (!window.TRANSLATIONS) return fallback || key;
    const dict = window.TRANSLATIONS[currentLang] || window.TRANSLATIONS["en"];
    return dict[key] !== undefined ? dict[key] : (fallback || key);
  }

  // Format price helper
  function formatPrice(amount) {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString("en-US");
    if (currentLang === "ar") {
      return `${formatted} د.إ`;
    }
    return `AED ${formatted}`;
  }

  // Apply translations to DOM
  function applyTranslations() {
    const dict = window.TRANSLATIONS ? (window.TRANSLATIONS[currentLang] || window.TRANSLATIONS["en"]) : {};
    
    // Elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] === undefined) return;

      // If element has data-i18n-html, use innerHTML
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = dict[key];
        return;
      }

      // If element only contains text nodes (no child elements), safe to set textContent
      const hasChildElements = Array.from(el.childNodes).some(n => n.nodeType === Node.ELEMENT_NODE);
      if (!hasChildElements) {
        el.textContent = dict[key];
        return;
      }

      // Otherwise update only the first text node child, preserving child elements (SVGs etc.)
      let textNodeFound = false;
      el.childNodes.forEach(node => {
        if (!textNodeFound && node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
          node.textContent = dict[key] + " ";
          textNodeFound = true;
        }
      });
      // If no text node found, prepend one before element children
      if (!textNodeFound) {
        const span = el.querySelector("[data-i18n-label], span:first-child");
        if (span && span.getAttribute("data-i18n") !== key) {
          span.textContent = dict[key];
        } else {
          const textNode = document.createTextNode(dict[key] + " ");
          el.insertBefore(textNode, el.firstChild);
        }
      }
    });

    // Elements with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    // Elements with data-i18n-title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined) {
        el.setAttribute("title", dict[key]);
      }
    });

    // Update switcher buttons UI
    document.querySelectorAll(".lang-switch-btn").forEach((btn) => {
      const targetLang = btn.getAttribute("data-lang");
      if (targetLang === currentLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Set Language Function
  function setLanguage(lang) {
    if (lang !== "en" && lang !== "ar") lang = "en";
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    if (lang === "ar") {
      htmlEl.setAttribute("lang", "ar");
      htmlEl.setAttribute("dir", "rtl");
      htmlEl.classList.add("is-rtl");
      if (bodyEl) bodyEl.classList.add("is-rtl");
    } else {
      htmlEl.setAttribute("lang", "en");
      htmlEl.setAttribute("dir", "ltr");
      htmlEl.classList.remove("is-rtl");
      if (bodyEl) bodyEl.classList.remove("is-rtl");
    }

    applyTranslations();

    // Dispatch event for other components to re-render
    const event = new CustomEvent("languageChanged", {
      detail: { lang: currentLang, isRTL: currentLang === "ar" }
    });
    window.dispatchEvent(event);
  }

  // Toggle Language
  function toggleLanguage() {
    setLanguage(currentLang === "en" ? "ar" : "en");
  }

  // Auto Init on DOMContentLoaded or immediate
  function init() {
    // Set immediate root attributes to prevent layout flash
    document.documentElement.setAttribute("lang", currentLang);
    document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
    if (currentLang === "ar") {
      document.documentElement.classList.add("is-rtl");
    }

    const onReady = () => {
      if (currentLang === "ar" && document.body) {
        document.body.classList.add("is-rtl");
      }
      applyTranslations();

      // Bind all switcher buttons
      document.querySelectorAll(".lang-switch-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const targetLang = btn.getAttribute("data-lang");
          if (targetLang) {
            setLanguage(targetLang);
          } else {
            toggleLanguage();
          }
        });
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady);
    } else {
      onReady();
    }
  }

  init();

  // Expose globally
  window.MaisonLang = {
    get current() {
      return currentLang;
    },
    get isRTL() {
      return currentLang === "ar";
    },
    t,
    formatPrice,
    setLanguage,
    toggleLanguage,
    applyTranslations
  };
})();

