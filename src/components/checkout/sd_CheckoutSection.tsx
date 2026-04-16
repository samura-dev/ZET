import { useState } from "react";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import "./sd_CheckoutSection.css";

interface sd_CheckoutSectionProps {
  onBackHome?: () => void;
}

type sd_DeliveryMethod = "courier" | "pickup";
type sd_PaymentMethod = "card" | "cash";

type sd_FormData = {
  sd_fullName: string;
  sd_email: string;
  sd_phone: string;
  sd_city: string;
  sd_address: string;
  sd_deliveryMethod: sd_DeliveryMethod;
  sd_paymentMethod: sd_PaymentMethod;
  sd_promoCode: string;
};

export const SdCheckoutSection = ({ onBackHome }: sd_CheckoutSectionProps): JSX.Element => {
  const { items: sd_items, sd_getTotalPrice, sd_removeItem, sd_updateQuantity, sd_clearCart } = sd_useCartStore();
  const [sd_isSubmitted, sd_setIsSubmitted] = useState(false);

  // Состояние формы.
  const [sd_formData, sd_setFormData] = useState<sd_FormData>({
    sd_fullName: "",
    sd_email: "",
    sd_phone: "",
    sd_city: "",
    sd_address: "",
    sd_deliveryMethod: "courier",
    sd_paymentMethod: "card",
    sd_promoCode: ""
  });

  const [sd_errors, sd_setErrors] = useState<Record<string, string>>({});
  const [sd_appliedPromo, sd_setAppliedPromo] = useState<{ sd_code: string; sd_discount: number } | null>(null);
  const [sd_promoError, sd_setPromoError] = useState("");

  const sd_currencyFormatter = new Intl.NumberFormat("ru-RU");

  const sd_handleInputChange = (sd_event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = sd_event.target;
    sd_setFormData((sd_prev) => ({ ...sd_prev, [name]: value }));

    if (sd_errors[name]) {
      sd_setErrors((sd_prev) => {
        const sd_next = { ...sd_prev };
        delete sd_next[name];
        return sd_next;
      });
    }
  };

  const sd_applyPromo = (): void => {
    const sd_code = sd_formData.sd_promoCode.trim().toUpperCase();

    if (sd_code === "HUSH10") {
      sd_setAppliedPromo({ sd_code: "HUSH10", sd_discount: 0.1 });
      sd_setPromoError("");
      return;
    }

    sd_setPromoError("неверный промокод");
    sd_setAppliedPromo(null);
  };

  const sd_validate = (): boolean => {
    const sd_newErrors: Record<string, string> = {};

    if (!sd_formData.sd_fullName.trim()) {
      sd_newErrors.sd_fullName = "введите имя";
    }
    if (!sd_formData.sd_email.includes("@")) {
      sd_newErrors.sd_email = "неверный email";
    }
    if (!sd_formData.sd_phone.trim()) {
      sd_newErrors.sd_phone = "введите телефон";
    }
    if (sd_formData.sd_deliveryMethod === "courier" && !sd_formData.sd_address.trim()) {
      sd_newErrors.sd_address = "введите адрес";
    }

    sd_setErrors(sd_newErrors);
    return Object.keys(sd_newErrors).length === 0;
  };

  const sd_handleSubmit = (sd_event: React.FormEvent): void => {
    sd_event.preventDefault();
    if (!sd_validate()) {
      return;
    }

    sd_setIsSubmitted(true);
    sd_clearCart();
    window.scrollTo(0, 0);
  };

  const sd_subtotal = sd_getTotalPrice();
  const sd_discountAmount = sd_appliedPromo ? sd_subtotal * sd_appliedPromo.sd_discount : 0;
  const sd_shipping = sd_formData.sd_deliveryMethod === "courier" ? 500 : 0;
  const sd_total = sd_subtotal - sd_discountAmount + sd_shipping;

  if (sd_isSubmitted) {
    return (
      <section className="sd_checkout">
        <div className="sd_checkout__glow" />
        <div className="sd_checkout__success">
          <h1 className="sd_checkout__title">заказ принят!</h1>
          <p className="sd_checkout__lead">
            спасибо за доверие. наш менеджер скоро свяжется с вами для уточнения деталей.
          </p>
          <button className="sd_checkout__success_button" onClick={onBackHome}>
            вернуться на главную
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="sd_checkout">
      <div className="sd_checkout__glow" />

      <header className="sd_checkout__header">
        <div className="sd_checkout__header_main">
          <h1 className="sd_checkout__title">оформление заказа</h1>
          <p className="sd_checkout__lead">
            один шаг до вашей новой футуристичной сумки. заполните данные и подтвердите заказ.
          </p>
        </div>
      </header>

      <div className="sd_checkout__layout">
        <form className="sd_checkout__form" onSubmit={sd_handleSubmit}>
          <div className="sd_checkout__group">
            <h2 className="sd_checkout__group_title">контактные данные</h2>
            <div className="sd_checkout__fields">
              <div className="sd_checkout__field">
                <span>имя и фамилия</span>
                <input className={sd_errors.sd_fullName ? "sd_checkout__input sd_checkout__input--error" : "sd_checkout__input"} name="sd_fullName" value={sd_formData.sd_fullName} onChange={sd_handleInputChange} placeholder="иван иванов" />
                {sd_errors.sd_fullName ? <p className="sd_checkout__field_error">{sd_errors.sd_fullName}</p> : null}
              </div>
              <div className="sd_checkout__field">
                <span>email</span>
                <input className={sd_errors.sd_email ? "sd_checkout__input sd_checkout__input--error" : "sd_checkout__input"} name="sd_email" type="email" value={sd_formData.sd_email} onChange={sd_handleInputChange} placeholder="example@mail.com" />
                {sd_errors.sd_email ? <p className="sd_checkout__field_error">{sd_errors.sd_email}</p> : null}
              </div>
              <div className="sd_checkout__field sd_checkout__field--full">
                <span>телефон</span>
                <input className={sd_errors.sd_phone ? "sd_checkout__input sd_checkout__input--error" : "sd_checkout__input"} name="sd_phone" value={sd_formData.sd_phone} onChange={sd_handleInputChange} placeholder="+7 (___) ___-__-__" />
                {sd_errors.sd_phone ? <p className="sd_checkout__field_error">{sd_errors.sd_phone}</p> : null}
              </div>
            </div>
          </div>

          <div className="sd_checkout__group">
            <h2 className="sd_checkout__group_title">способ доставки</h2>
            <div className="sd_checkout__choices">
              <button type="button" className={sd_formData.sd_deliveryMethod === "courier" ? "sd_checkout__choice sd_checkout__choice--active" : "sd_checkout__choice"} onClick={() => sd_setFormData((sd_prev) => ({ ...sd_prev, sd_deliveryMethod: "courier" }))}>курьером (500 ₽)</button>
              <button type="button" className={sd_formData.sd_deliveryMethod === "pickup" ? "sd_checkout__choice sd_checkout__choice--active" : "sd_checkout__choice"} onClick={() => sd_setFormData((sd_prev) => ({ ...sd_prev, sd_deliveryMethod: "pickup" }))}>самовывоз (бесплатно)</button>
            </div>
            {sd_formData.sd_deliveryMethod === "courier" ? (
              <div className="sd_checkout__fields" style={{ marginTop: "12px" }}>
                <div className="sd_checkout__field sd_checkout__field--full">
                  <span>адрес доставки</span>
                  <input className={sd_errors.sd_address ? "sd_checkout__input sd_checkout__input--error" : "sd_checkout__input"} name="sd_address" value={sd_formData.sd_address} onChange={sd_handleInputChange} placeholder="город, улица, дом, квартира" />
                  {sd_errors.sd_address ? <p className="sd_checkout__field_error">{sd_errors.sd_address}</p> : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="sd_checkout__group">
            <h2 className="sd_checkout__group_title">способ оплаты</h2>
            <div className="sd_checkout__choices">
              <button type="button" className={sd_formData.sd_paymentMethod === "card" ? "sd_checkout__choice sd_checkout__choice--active" : "sd_checkout__choice"} onClick={() => sd_setFormData((sd_prev) => ({ ...sd_prev, sd_paymentMethod: "card" }))}>картой онлайн</button>
              <button type="button" className={sd_formData.sd_paymentMethod === "cash" ? "sd_checkout__choice sd_checkout__choice--active" : "sd_checkout__choice"} onClick={() => sd_setFormData((sd_prev) => ({ ...sd_prev, sd_paymentMethod: "cash" }))}>при получении</button>
            </div>
          </div>
        </form>

        <div className="sd_checkout__order">
          <h2 className="sd_checkout__order_title">ваш заказ</h2>

          <div className="sd_checkout__order_list">
            {sd_items.length === 0 ? (
              <div className="sd_checkout__empty">
                <p>ваша корзина пуста</p>
                <button type="button" onClick={onBackHome}>перейти к покупкам</button>
              </div>
            ) : (
              sd_items.map((sd_item) => (
                <div key={sd_item.id} className="sd_checkout__order_item">
                  <img src={sd_item.images[0]} alt={sd_item.title} />
                  <div className="sd_checkout__order_item_content">
                    <div className="sd_checkout__order_item_top">
                      <p>{sd_item.title}</p>
                      <button className="sd_checkout__item_remove" type="button" onClick={() => sd_removeItem(sd_item.id)}>×</button>
                    </div>
                    <div className="sd_checkout__order_item_bottom">
                      <div className="sd_checkout__quantity">
                        <button type="button" onClick={() => sd_updateQuantity(sd_item.id, Math.max(1, sd_item.quantity - 1))}>−</button>
                        <span>{sd_item.quantity}</span>
                        <button type="button" onClick={() => sd_updateQuantity(sd_item.id, sd_item.quantity + 1)}>+</button>
                      </div>
                      <span>{sd_currencyFormatter.format(sd_item.price * sd_item.quantity)} ₽</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sd_checkout__summary">
            <div className="sd_checkout__promo" style={{ marginBottom: "16px" }}>
              <input className="sd_checkout__input" placeholder="промокод" name="sd_promoCode" value={sd_formData.sd_promoCode} onChange={sd_handleInputChange} />
              <button className="sd_checkout__promo_apply" type="button" onClick={sd_applyPromo}>применить</button>
              {sd_promoError ? <p className="sd_checkout__promo_message sd_checkout__promo_message--error">{sd_promoError}</p> : null}
              {sd_appliedPromo ? <p className="sd_checkout__promo_message sd_checkout__promo_message--success">скидка 10% применена</p> : null}
            </div>

            <div className="sd_checkout__summary_row">
              <span>товары</span>
              <span>{sd_currencyFormatter.format(sd_subtotal)} ₽</span>
            </div>
            {sd_appliedPromo ? <div className="sd_checkout__summary_row sd_checkout__summary_row--discount"><span>скидка</span><span>-{sd_currencyFormatter.format(sd_discountAmount)} ₽</span></div> : null}
            <div className="sd_checkout__summary_row">
              <span>доставка</span>
              <span>{sd_currencyFormatter.format(sd_shipping)} ₽</span>
            </div>
            <div className="sd_checkout__total">итого: {sd_currencyFormatter.format(sd_total)} ₽</div>
            <button className="sd_checkout__submit" type="submit" disabled={sd_items.length === 0}>подтвердить заказ</button>
          </div>
        </div>
      </div>
    </section>
  );
};

