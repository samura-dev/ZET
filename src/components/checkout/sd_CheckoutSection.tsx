import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_CheckoutSection.css";
import { sd_useCartStore } from "../../store/sd_useCartStore";

gsap.registerPlugin(ScrollTrigger);

type sd_DeliveryOption = "courier" | "pickup" | "express";
type sd_PaymentOption = "card" | "sbp" | "cash";
type sd_PromoStatus = "idle" | "applied" | "invalid";

type sd_FormState = {
  fullName: string;
  phone: string;
  email: string;
};

type sd_FormErrors = Partial<Record<keyof sd_FormState, string>>;

type sd_CheckoutSectionProps = {
  onBackHome?: () => void;
};

// Удалены захардкоженные товары

const sd_currencyFormatter = new Intl.NumberFormat("ru-RU");

const sd_isEmailValid = (sd_email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sd_email.trim());
};

const sd_isPhoneValid = (sd_phone: string): boolean => {
  const sd_digits = sd_phone.replace(/\D/g, "");
  return sd_digits.length >= 10;
};

export const SdCheckoutSection = ({ onBackHome }: sd_CheckoutSectionProps): JSX.Element => {
  const sd_sectionRef = useRef<HTMLElement | null>(null);
  const sd_totalRef = useRef<HTMLParagraphElement | null>(null);
  const sd_successRef = useRef<HTMLDivElement | null>(null);

  const {
    items: sd_items,
    sd_updateQuantity,
    sd_removeItem,
    sd_clearCart,
    sd_getTotalPrice
  } = sd_useCartStore();

  const [sd_delivery, sd_setDelivery] = useState<sd_DeliveryOption>("courier");
  const [sd_payment, sd_setPayment] = useState<sd_PaymentOption>("card");
  const [sd_promoCode, sd_setPromoCode] = useState("");
  const [sd_promoStatus, sd_setPromoStatus] = useState<sd_PromoStatus>("idle");
  const [sd_promoMessage, sd_setPromoMessage] = useState("");

  const [sd_formState, sd_setFormState] = useState<sd_FormState>({
    fullName: "",
    phone: "",
    email: ""
  });
  const [sd_formErrors, sd_setFormErrors] = useState<sd_FormErrors>({});
  const [sd_orderSuccess, sd_setOrderSuccess] = useState(false);
  const [sd_orderNumber, sd_setOrderNumber] = useState("");

  const sd_subtotal = sd_getTotalPrice();

  const sd_deliveryPrice = useMemo(() => {
    if (sd_delivery === "pickup") {
      return 0;
    }

    if (sd_items.length === 0) {
      return 0;
    }

    if (sd_delivery === "express") {
      return 1800;
    }

    return 700;
  }, [sd_delivery, sd_items.length]);

  const sd_discount = useMemo(() => {
    return sd_promoStatus === "applied" ? Math.round(sd_subtotal * 0.1) : 0;
  }, [sd_promoStatus, sd_subtotal]);

  const sd_total = useMemo(() => {
    return Math.max(0, sd_subtotal + sd_deliveryPrice - sd_discount);
  }, [sd_subtotal, sd_deliveryPrice, sd_discount]);

  useEffect(() => {
    const sd_section = sd_sectionRef.current;

    if (!sd_section) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sd_ctx = gsap.context(() => {
      const sd_header = sd_section.querySelector<HTMLElement>(".sd-checkout__header");
      const sd_form = sd_section.querySelector<HTMLElement>(".sd-checkout__form");
      const sd_order = sd_section.querySelector<HTMLElement>(".sd-checkout__order");
      const sd_stripe = sd_section.querySelector<HTMLElement>(".sd-checkout__stripe-track");
      const sd_glow = sd_section.querySelector<HTMLElement>(".sd-checkout__glow");

      if (!sd_header || !sd_form || !sd_order || !sd_stripe || !sd_glow) {
        return;
      }

      if (sd_prefersReducedMotion) {
        gsap.set([sd_header, sd_form, sd_order], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.set([sd_header, sd_form, sd_order], { autoAlpha: 0, y: 44 });

      const sd_tl = gsap.timeline({
        scrollTrigger: {
          trigger: sd_section,
          start: "top 78%",
          once: true
        }
      });

      sd_tl
        .to(sd_header, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out"
        })
        .to(
          [sd_form, sd_order],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "power3.out"
          },
          "-=0.55"
        );

      gsap.to(sd_stripe, {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "none"
      });

      gsap.to(sd_glow, {
        xPercent: 24,
        yPercent: -10,
        scale: 1.08,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sd_section);

    return () => {
      sd_ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!sd_totalRef.current) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sd_prefersReducedMotion) {
      return;
    }

    gsap.fromTo(
      sd_totalRef.current,
      { scale: 0.96, filter: "brightness(1)" },
      {
        scale: 1,
        filter: "brightness(1.08)",
        duration: 0.38,
        ease: "power2.out"
      }
    );
  }, [sd_total]);

  useEffect(() => {
    if (!sd_orderSuccess || !sd_successRef.current) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sd_prefersReducedMotion) {
      return;
    }

    gsap.fromTo(
      sd_successRef.current,
      { autoAlpha: 0, y: 18, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    );
  }, [sd_orderSuccess]);

  const sd_handlePromoApply = (): void => {
    if (!sd_promoCode.trim()) {
      sd_setPromoStatus("invalid");
      sd_setPromoMessage("введите промокод");
      return;
    }

    sd_setPromoStatus("applied");
    sd_setPromoMessage(`промокод "${sd_promoCode.trim()}" применен: -10%`);
  };

  const sd_validateForm = (): boolean => {
    const sd_errors: sd_FormErrors = {};

    if (!sd_formState.fullName.trim()) {
      sd_errors.fullName = "укажите имя и фамилию";
    }

    if (!sd_isPhoneValid(sd_formState.phone)) {
      sd_errors.phone = "введите корректный телефон";
    }

    if (!sd_isEmailValid(sd_formState.email)) {
      sd_errors.email = "введите корректный email";
    }

    sd_setFormErrors(sd_errors);
    return Object.keys(sd_errors).length === 0;
  };

  const sd_handleSubmitOrder = (): void => {
    if (sd_items.length === 0) {
      return;
    }

    if (!sd_validateForm()) {
      return;
    }

    const sd_fakeOrderNumber = `HUSH-${new Date().getTime().toString().slice(-6)}`;
    sd_setOrderNumber(sd_fakeOrderNumber);
    sd_setOrderSuccess(true);
    sd_clearCart();
  };

  const sd_updateField = (sd_field: keyof sd_FormState, sd_value: string): void => {
    sd_setFormState((sd_prev) => ({ ...sd_prev, [sd_field]: sd_value }));
    sd_setFormErrors((sd_prev) => {
      const { [sd_field]: _sd_removed, ...sd_rest } = sd_prev;
      return sd_rest;
    });
  };

  return (
    <section className="sd-checkout" aria-label="Оформление заказа" ref={sd_sectionRef}>
      <span className="sd-checkout__glow" aria-hidden />

      <div className="sd-checkout__stripe" aria-hidden>
        <div className="sd-checkout__stripe-track">
          <span className="sd-checkout__stripe-item">SECURE CHECKOUT</span>
          <span className="sd-checkout__stripe-item">HUSH PREMIUM DELIVERY</span>
          <span className="sd-checkout__stripe-item">SECURE CHECKOUT</span>
          <span className="sd-checkout__stripe-item">HUSH PREMIUM DELIVERY</span>
        </div>
      </div>


      <header className="sd-checkout__header">
        <h2 className="sd-checkout__title">оформление заказа</h2>
        <p className="sd-checkout__lead">
          один шаг до вашей новой футуристичной сумки. заполните данные и подтвердите
          заказ.
        </p>
      </header>

      {sd_orderSuccess ? (
        <div className="sd-checkout__success" ref={sd_successRef}>
          <p className="sd-checkout__success-title">заказ принят</p>
          <p className="sd-checkout__success-text">
            номер заказа: <strong>{sd_orderNumber}</strong>
          </p>
          <p className="sd-checkout__success-text">
            мы отправили подтверждение на <strong>{sd_formState.email}</strong>
          </p>
          <button
            className="sd-checkout__success-button"
            type="button"
            onClick={() => {
              onBackHome?.();
            }}
          >
            вернуться на главную
          </button>
        </div>
      ) : (
        <div className="sd-checkout__layout">
          <form
            className="sd-checkout__form"
            onSubmit={(sd_event) => {
              sd_event.preventDefault();
              sd_handleSubmitOrder();
            }}
          >
            <section className="sd-checkout__group">
              <h3 className="sd-checkout__group-title">контактные данные</h3>
              <div className="sd-checkout__fields">
                <label className="sd-checkout__field">
                  <span>имя и фамилия</span>
                  <input
                    className={
                      sd_formErrors.fullName
                        ? "sd-checkout__input sd-checkout__input--error"
                        : "sd-checkout__input"
                    }
                    type="text"
                    placeholder="анастасия л."
                    value={sd_formState.fullName}
                    onChange={(sd_event) => {
                      sd_updateField("fullName", sd_event.target.value);
                    }}
                  />
                  {sd_formErrors.fullName ? (
                    <small className="sd-checkout__field-error">{sd_formErrors.fullName}</small>
                  ) : null}
                </label>
                <label className="sd-checkout__field">
                  <span>телефон</span>
                  <input
                    className={
                      sd_formErrors.phone
                        ? "sd-checkout__input sd-checkout__input--error"
                        : "sd-checkout__input"
                    }
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={sd_formState.phone}
                    onChange={(sd_event) => {
                      sd_updateField("phone", sd_event.target.value);
                    }}
                  />
                  {sd_formErrors.phone ? (
                    <small className="sd-checkout__field-error">{sd_formErrors.phone}</small>
                  ) : null}
                </label>
                <label className="sd-checkout__field sd-checkout__field--full">
                  <span>email</span>
                  <input
                    className={
                      sd_formErrors.email
                        ? "sd-checkout__input sd-checkout__input--error"
                        : "sd-checkout__input"
                    }
                    type="email"
                    placeholder="mail@example.com"
                    value={sd_formState.email}
                    onChange={(sd_event) => {
                      sd_updateField("email", sd_event.target.value);
                    }}
                  />
                  {sd_formErrors.email ? (
                    <small className="sd-checkout__field-error">{sd_formErrors.email}</small>
                  ) : null}
                </label>
              </div>
            </section>

            <section className="sd-checkout__group">
              <h3 className="sd-checkout__group-title">доставка</h3>
              <div className="sd-checkout__choices">
                <button
                  className={
                    sd_delivery === "courier"
                      ? "sd-checkout__choice sd-checkout__choice--active"
                      : "sd-checkout__choice"
                  }
                  type="button"
                  onClick={() => {
                    sd_setDelivery("courier");
                  }}
                >
                  курьер
                </button>
                <button
                  className={
                    sd_delivery === "pickup"
                      ? "sd-checkout__choice sd-checkout__choice--active"
                      : "sd-checkout__choice"
                  }
                  type="button"
                  onClick={() => {
                    sd_setDelivery("pickup");
                  }}
                >
                  самовывоз
                </button>
                <button
                  className={
                    sd_delivery === "express"
                      ? "sd-checkout__choice sd-checkout__choice--active"
                      : "sd-checkout__choice"
                  }
                  type="button"
                  onClick={() => {
                    sd_setDelivery("express");
                  }}
                >
                  экспресс
                </button>
              </div>
            </section>

            <section className="sd-checkout__group">
              <h3 className="sd-checkout__group-title">оплата</h3>
              <div className="sd-checkout__choices">
                <button
                  className={
                    sd_payment === "card"
                      ? "sd-checkout__choice sd-checkout__choice--active"
                      : "sd-checkout__choice"
                  }
                  type="button"
                  onClick={() => {
                    sd_setPayment("card");
                  }}
                >
                  карта
                </button>
                <button
                  className={
                    sd_payment === "sbp"
                      ? "sd-checkout__choice sd-checkout__choice--active"
                      : "sd-checkout__choice"
                  }
                  type="button"
                  onClick={() => {
                    sd_setPayment("sbp");
                  }}
                >
                  сбп
                </button>
                <button
                  className={
                    sd_payment === "cash"
                      ? "sd-checkout__choice sd-checkout__choice--active"
                      : "sd-checkout__choice"
                  }
                  type="button"
                  onClick={() => {
                    sd_setPayment("cash");
                  }}
                >
                  при получении
                </button>
              </div>
            </section>

            <section className="sd-checkout__group">
              <h3 className="sd-checkout__group-title">промокод</h3>
              <div className="sd-checkout__promo">
                <input
                  className="sd-checkout__input"
                  type="text"
                  placeholder="введите код (например HUSH10)"
                  value={sd_promoCode}
                  onChange={(sd_event) => {
                    sd_setPromoCode(sd_event.target.value);
                    if (sd_promoStatus !== "idle") {
                      sd_setPromoStatus("idle");
                      sd_setPromoMessage("");
                    }
                  }}
                />
                <button type="button" onClick={sd_handlePromoApply}>
                  применить
                </button>
              </div>
              {sd_promoMessage ? (
                <p
                  className={
                    sd_promoStatus === "applied"
                      ? "sd-checkout__promo-message sd-checkout__promo-message--success"
                      : "sd-checkout__promo-message sd-checkout__promo-message--error"
                  }
                >
                  {sd_promoMessage}
                </p>
              ) : null}
            </section>
          </form>

          <aside className="sd-checkout__order">
            <h3 className="sd-checkout__order-title">ваш заказ</h3>
            <div className="sd-checkout__order-list">
              {sd_items.length > 0 ? (
                sd_items.map((sd_item) => (
                  <article className="sd-checkout__order-item" key={sd_item.id}>
                    <img src={sd_item.images[0]} alt={`Сумка ${sd_item.title}`} />
                    <div className="sd-checkout__order-item-content">
                      <div className="sd-checkout__order-item-top">
                        <p>{sd_item.title}</p>
                        <button
                          className="sd-checkout__item-remove"
                          type="button"
                          onClick={() => sd_removeItem(sd_item.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="sd-checkout__order-item-bottom">
                        <div className="sd-checkout__quantity">
                          <button
                            type="button"
                            onClick={() => sd_updateQuantity(sd_item.id, sd_item.quantity - 1)}
                          >
                            -
                          </button>
                          <span>{sd_item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => sd_updateQuantity(sd_item.id, sd_item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span>{sd_currencyFormatter.format(sd_item.price)} ₽</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="sd-checkout__empty">
                  <p>ваша корзина пуста</p>
                  <button type="button" onClick={onBackHome}>
                    перейти к покупкам
                  </button>
                </div>
              )}
            </div>

            <div className="sd-checkout__summary">
              <div className="sd-checkout__summary-row">
                <span>товары</span>
                <span>{sd_currencyFormatter.format(sd_subtotal)} ₽</span>
              </div>
              <div className="sd-checkout__summary-row">
                <span>доставка</span>
                <span>{sd_currencyFormatter.format(sd_deliveryPrice)} ₽</span>
              </div>
              {sd_discount > 0 ? (
                <div className="sd-checkout__summary-row sd-checkout__summary-row--discount">
                  <span>скидка</span>
                  <span>-{sd_currencyFormatter.format(sd_discount)} ₽</span>
                </div>
              ) : null}
            </div>

            <p className="sd-checkout__total" ref={sd_totalRef}>
              итого: {sd_currencyFormatter.format(sd_total)} ₽
            </p>

            <button
              className="sd-checkout__submit"
              type="button"
              onClick={sd_handleSubmitOrder}
              disabled={sd_items.length === 0}
            >
              подтвердить заказ
            </button>
          </aside>
        </div>
      )}
    </section>
  );
};
