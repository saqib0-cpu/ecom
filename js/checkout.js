/**
 * Maison Fleuriste Dubai - Checkout Controller & Order Engine
 * Multi-payment methods (Apple Pay, Card, Tabby, COD), Dubai Address validation,
 * Date/Slot selection, and LocalStorage order placement
 */

(function () {
  function initCheckoutPage() {
    const checkoutContainer = document.getElementById("checkout-page-container");
    if (!checkoutContainer) return;

    const cart = window.MaisonCart ? window.MaisonCart.getItems() : [];
    if (cart.length === 0) {
      window.location.href = "cart.html";
      return;
    }

    const isAr = window.MaisonLang && window.MaisonLang.isRTL;
    const formatPrice = window.MaisonLang ? window.MaisonLang.formatPrice : (p) => `AED ${p}`;
    const t = window.MaisonLang ? window.MaisonLang.t : (k, f) => f;

    // Populate Dubai Areas Select
    const areaSelect = document.getElementById("checkout-dubai-area");
    if (areaSelect && window.DUBAI_AREAS) {
      areaSelect.innerHTML = `<option value="">${isAr ? "-- اختر منطقة دبي --" : "-- Select Dubai Area --"}</option>` +
        window.DUBAI_AREAS.map((a) => `<option value="${a.id}" data-charge="${a.charge}">${isAr ? a.nameAr : a.nameEn}</option>`).join("");
    }

    // Set Default Delivery Date to Today & Minimum to Today
    const dateInput = document.getElementById("checkout-delivery-date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
      dateInput.value = today;
    }

    // Render Order Summary
    function renderSummary() {
      const summaryItems = document.getElementById("checkout-summary-items");
      if (!summaryItems) return;

      const items = window.MaisonCart.getItems();
      summaryItems.innerHTML = items.map((item) => {
        const name = isAr ? item.nameAr : item.nameEn;
        const sizeLabel = t(`size_${item.size.toLowerCase()}`, item.size);
        return `
          <div class="checkout-summary-item">
            <div class="checkout-item-thumb-wrap">
              <img src="${item.image}" alt="${name}" />
              <span class="checkout-item-badge">${item.quantity}</span>
            </div>
            <div class="checkout-item-details">
              <h4 class="checkout-item-title">${name}</h4>
              <span class="checkout-item-variant">${sizeLabel}</span>
              ${item.addons && item.addons.length ? `<span class="checkout-item-addons">+ ${item.addons.map(a => isAr ? a.nameAr : a.nameEn).join(", ")}</span>` : ""}
            </div>
            <div class="checkout-item-price">${formatPrice(item.unitPrice * item.quantity)}</div>
          </div>
        `;
      }).join("");

      const subtotal = window.MaisonCart.getSubtotal();
      const discount = window.MaisonCart.getDiscount();
      const delivery = window.MaisonCart.getDeliveryFee();
      const vat = window.MaisonCart.getVat();
      const total = window.MaisonCart.getTotal();

      document.getElementById("chk-subtotal").textContent = formatPrice(subtotal);
      document.getElementById("chk-delivery").textContent = delivery === 0 ? t("cart_delivery_free", "Complimentary") : formatPrice(delivery);
      document.getElementById("chk-vat").textContent = formatPrice(vat);
      document.getElementById("chk-total").textContent = formatPrice(total);

      const discountRow = document.getElementById("chk-discount-row");
      if (discountRow) {
        if (discount > 0) {
          discountRow.style.display = "flex";
          document.getElementById("chk-discount").textContent = `- ${formatPrice(discount)}`;
        } else {
          discountRow.style.display = "none";
        }
      }

      // Tabby split calculation
      const tabbyAmount = document.getElementById("tabby-installment-amount");
      if (tabbyAmount) {
        tabbyAmount.textContent = formatPrice(Math.round(total / 4));
      }
    }

    renderSummary();

    // Payment Option Switching
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    paymentMethods.forEach((input) => {
      input.addEventListener("change", (e) => {
        document.querySelectorAll(".payment-panel").forEach((p) => p.classList.remove("active"));
        const targetPanel = document.getElementById(`panel-${e.target.value}`);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });

    // Credit card number auto-formatting (adds spaces every 4 digits)
    const cardInput = document.getElementById("card-number-input");
    if (cardInput) {
      cardInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").substring(0, 16);
        let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
        e.target.value = formatted;
      });
    }

    const expiryInput = document.getElementById("card-expiry-input");
    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").substring(0, 4);
        if (val.length >= 2) {
          e.target.value = val.substring(0, 2) + " / " + val.substring(2);
        } else {
          e.target.value = val;
        }
      });
    }

    // Checkout Form Submission
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("checkout-name").value.trim();
        const email = document.getElementById("checkout-email").value.trim();
        const phone = document.getElementById("checkout-phone").value.trim();
        const area = document.getElementById("checkout-dubai-area").value;
        const building = document.getElementById("checkout-building").value.trim();
        const street = document.getElementById("checkout-street").value.trim();
        const apt = document.getElementById("checkout-apt") ? document.getElementById("checkout-apt").value.trim() : "";
        const notes = document.getElementById("checkout-notes") ? document.getElementById("checkout-notes").value.trim() : "";
        const deliveryDate = document.getElementById("checkout-delivery-date").value;
        const deliverySlot = document.getElementById("checkout-delivery-slot").value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || "card";

        if (!fullName || !email || !phone || !area || !building || !street) {
          alert(isAr ? "يرجى ملء جميع الحقول المطلوبة لعنوان التوصيل في دبي." : "Please fill in all required delivery address fields.");
          return;
        }

        // Generate luxury order reference
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const orderId = `MF-DXB-${randomNum}`;

        const orderData = {
          orderId,
          orderDate: new Date().toISOString(),
          customer: { fullName, email, phone },
          delivery: {
            area,
            areaName: document.getElementById("checkout-dubai-area").selectedOptions[0]?.text || area,
            building,
            street,
            apt,
            notes,
            deliveryDate,
            deliverySlot
          },
          items: window.MaisonCart.getItems(),
          payment: {
            method: paymentMethod,
            subtotal: window.MaisonCart.getSubtotal(),
            discount: window.MaisonCart.getDiscount(),
            delivery: window.MaisonCart.getDeliveryFee(),
            vat: window.MaisonCart.getVat(),
            total: window.MaisonCart.getTotal()
          },
          status: "Order Placed"
        };

        // Save order to history
        try {
          const orders = JSON.parse(localStorage.getItem("maison_orders") || "[]");
          orders.unshift(orderData);
          localStorage.setItem("maison_orders", JSON.stringify(orders));
          localStorage.setItem("maison_latest_order", JSON.stringify(orderData));
        } catch (err) {
          console.error("Failed saving order", err);
        }

        // Clear cart
        window.MaisonCart.clearCart();

        // Redirect to confirmation page
        window.location.href = `order-confirmation.html?orderId=${orderId}`;
      });
    }

    window.addEventListener("languageChanged", () => {
      renderSummary();
    });
  }

  document.addEventListener("DOMContentLoaded", initCheckoutPage);
})();

