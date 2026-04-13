import { useEffect, useMemo, useRef, useState } from "react";
import { SdHeroBagViewer } from "./sd_HeroBagViewer";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import sd_productsData from "../../data/sd_products.json";
import "./sd_HeroSection.css";

const sd_MARQUEE_TEXT = "FUTURISM IN EVERY FOLD";

const sd_marqueeItems: string[] = [
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT
];

const sd_menuItems: Array<{ label: string; href: string }> = [
  { label: "главная", href: "/" },
  { label: "о нас", href: "/about" },
  { label: "отзывы", href: "/reviews" },
  { label: "контакты", href: "/contacts" }
];

// Удалены локальные заглушки

const sd_currencyFormatter = new Intl.NumberFormat("ru-RU");

type sd_HeroSectionProps = {
  onCheckoutOpen?: () => void;
};

export const SdHeroSection = ({ onCheckoutOpen }: sd_HeroSectionProps): JSX.Element => {
  const [sd_isSearchOpen, sd_setIsSearchOpen] = useState(false);
  const [sd_searchQuery, sd_setSearchQuery] = useState("");
  const [sd_isCartOpen, sd_setIsCartOpen] = useState(false);
  const [sd_removingItemIds, sd_setRemovingItemIds] = useState<string[]>([]);
  
  const sd_products = sd_productsData;

  const {
    items: sd_cartItems,
    sd_updateQuantity,
    sd_removeItem,
    sd_getTotalItems,
    sd_getTotalPrice
  } = sd_useCartStore();

  const sd_searchInputRef = useRef<HTMLInputElement | null>(null);
  const sd_removeTimersRef = useRef<Record<string, number>>({});

  const sd_totalQuantity = sd_getTotalItems();
  const sd_totalPrice = sd_getTotalPrice();

  const sd_searchResults = useMemo(() => {
    if (sd_searchQuery.trim().length < 2) return [];
    const sd_q = sd_searchQuery.toLowerCase();
    return sd_products.filter(
      (p) => p.title.toLowerCase().includes(sd_q) || p.description.toLowerCase().includes(sd_q)
    ).slice(0, 5);
  }, [sd_searchQuery, sd_products]);

  useEffect(() => {
    if (sd_isSearchOpen) {
      sd_searchInputRef.current?.focus();
    }

    const sd_handleEscape = (sd_event: KeyboardEvent): void => {
      if (sd_event.key === "Escape") {
        sd_setIsSearchOpen(false);
        sd_setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", sd_handleEscape);
    return () => {
      window.removeEventListener("keydown", sd_handleEscape);
    };
  }, [sd_isSearchOpen]);

  useEffect(() => {
    return () => {
      Object.values(sd_removeTimersRef.current).forEach((sd_timerId) => {
        window.clearTimeout(sd_timerId);
      });
    };
  }, []);

  const sd_handleQuantityChange = (sd_itemId: string, sd_delta: number): void => {
    const sd_item = sd_cartItems.find((sd_i) => sd_i.id === sd_itemId);
    if (sd_item) {
      sd_updateQuantity(sd_itemId, sd_item.quantity + sd_delta);
    }
  };

  const sd_handleRemoveItem = (sd_itemId: string): void => {
    if (sd_removingItemIds.includes(sd_itemId)) {
      return;
    }

    sd_setRemovingItemIds((sd_prevIds) => [...sd_prevIds, sd_itemId]);

    sd_removeTimersRef.current[sd_itemId] = window.setTimeout(() => {
      sd_removeItem(sd_itemId);
      sd_setRemovingItemIds((sd_prevIds) => sd_prevIds.filter((sd_id) => sd_id !== sd_itemId));
      delete sd_removeTimersRef.current[sd_itemId];
    }, 300);
  };

  const [sd_isMobileMenuOpen, sd_setIsMobileMenuOpen] = useState(false);

  return (
    <section className="sd-hero" aria-label="Главный экран HUSH">
      <div className="sd-hero__background-glow" aria-hidden="true" />

      <header className="sd_hero__topbar">
        {/* Бургер для мобилок */}
        <button
          className="sd-hero__burger"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={sd_isMobileMenuOpen}
          onClick={() => sd_setIsMobileMenuOpen(true)}
        >
          <span />
          <span />
        </button>

        <nav className={sd_isMobileMenuOpen ? "sd-hero__menu sd-hero__menu--open" : "sd-hero__menu"}>
          <button
            className="sd-hero__menu-close"
            type="button"
            aria-label="Закрыть меню"
            onClick={() => sd_setIsMobileMenuOpen(false)}
          >
            &times;
          </button>
          {sd_menuItems.map((sd_item) => (
            <a className="sd-hero__menu-item" href={sd_item.href} key={sd_item.label} onClick={() => sd_setIsMobileMenuOpen(false)}>
              <span className="sd-hero__menu-label">{sd_item.label}</span>
              <span className="sd-hero__menu-arrow" aria-hidden>
                →
              </span>
            </a>
          ))}
        </nav>

        <div className="sd-hero__brand">
          <p className="sd-hero__brand-label">ZET</p>
        </div>

        <div className="sd-hero__tools">
          <button
            className="sd-hero__tool-button"
            type="button"
            aria-label="Поиск"
            aria-expanded={sd_isSearchOpen}
            aria-controls="sd-hero-search-panel"
            onClick={() => {
              sd_setIsSearchOpen((sd_prev) => !sd_prev);
              sd_setIsCartOpen(false);
            }}
          >
            <span className="sd-hero__search-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.9" />
                <path
                  d="M15.7 15.7L20 20"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>

          <button
            className="sd-hero__tool-button sd-hero__tool-button--cart"
            type="button"
            aria-label="Корзина"
            aria-expanded={sd_isCartOpen}
            aria-controls="sd-hero-cart-panel"
            onClick={() => {
              sd_setIsCartOpen((sd_prev) => !sd_prev);
              sd_setIsSearchOpen(false);
            }}
          >
            <span className="sd-hero__cart-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.2 4H6L7.6 13.2C7.8 14.3 8.8 15.1 9.9 15.1H18.3C19.4 15.1 20.4 14.3 20.6 13.2L21.5 8H7.1"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10.2" cy="19" r="1.75" stroke="currentColor" strokeWidth="1.9" />
                <circle cx="17.2" cy="19" r="1.75" stroke="currentColor" strokeWidth="1.9" />
              </svg>
            </span>
            {sd_totalQuantity > 0 ? (
              <span className="sd-hero__cart-badge">{sd_totalQuantity}</span>
            ) : null}
          </button>
        </div>
      </header>

      <div
        id="sd-hero-search-panel"
        className={
          sd_isSearchOpen
            ? "sd-hero__search-overlay sd-hero__search-overlay--open"
            : "sd-hero__search-overlay"
        }
        aria-hidden={!sd_isSearchOpen}
        onClick={() => {
          sd_setIsSearchOpen(false);
        }}
      >
        <div
          className="sd-hero__search-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Поиск по каталогу"
          onClick={(sd_event) => {
            sd_event.stopPropagation();
          }}
        >
          <span className="sd-hero__search-panel-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.9" />
              <path
                d="M15.7 15.7L20 20"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            ref={sd_searchInputRef}
            className="sd-hero__search-input"
            type="text"
            placeholder="Найти сумку..."
            value={sd_searchQuery}
            onChange={(sd_event) => {
              sd_setSearchQuery(sd_event.target.value);
            }}
          />
          <button
            className="sd-hero__search-close"
            type="button"
            aria-label="Закрыть поиск"
            onClick={() => {
              sd_setIsSearchOpen(false);
              sd_setSearchQuery("");
            }}
          >
            ×
          </button>

          {sd_searchResults.length > 0 && (
            <div className="sd-hero__search-results">
              {sd_searchResults.map((sd_result) => (
                <a
                  key={sd_result.id}
                  href={`/product/${sd_result.id}`}
                  className="sd-hero__search-result-item"
                >
                  <img src={sd_result.images[0]} alt="" />
                  <div className="sd-hero__search-result-info">
                    <p className="sd-hero__search-result-name">{sd_result.title}</p>
                    <p className="sd-hero__search-result-price">
                      {sd_currencyFormatter.format(sd_result.price)} ₽
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {sd_searchQuery.trim().length >= 2 && sd_searchResults.length === 0 && (
            <div className="sd-hero__search-no-results">
              ничего не найдено
            </div>
          )}
        </div>
      </div>

      <div
        id="sd-hero-cart-panel"
        className={
          sd_isCartOpen
            ? "sd-hero__cart-overlay sd-hero__cart-overlay--open"
            : "sd-hero__cart-overlay"
        }
        aria-hidden={!sd_isCartOpen}
        onClick={() => {
          sd_setIsCartOpen(false);
        }}
      >
        <aside
          className="sd-hero__cart-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Корзина"
          onClick={(sd_event) => {
            sd_event.stopPropagation();
          }}
        >
          <div className="sd-hero__cart-head">
            <h3 className="sd-hero__cart-title">корзина</h3>
            <button
              className="sd-hero__cart-close"
              type="button"
              aria-label="Закрыть корзину"
              onClick={() => {
                sd_setIsCartOpen(false);
              }}
            >
              ×
            </button>
          </div>

          <div className="sd-hero__cart-list">
            {sd_cartItems.length === 0 ? (
              <p className="sd-hero__cart-empty">в корзине пока пусто</p>
            ) : (
              sd_cartItems.map((sd_item) => (
                <article
                  className={
                    sd_removingItemIds.includes(sd_item.id)
                      ? "sd-hero__cart-item sd-hero__cart-item--removing"
                      : "sd-hero__cart-item"
                  }
                  key={sd_item.id}
                >
                  <img
                    className="sd-hero__cart-item-image"
                    src={sd_item.images[0]}
                    alt={`Сумка ${sd_item.title}`}
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="sd-hero__cart-item-content">
                    <p className="sd-hero__cart-item-title">{sd_item.title}</p>
                    <p className="sd-hero__cart-item-price">
                      {sd_currencyFormatter.format(sd_item.price)} ₽
                    </p>

                    <div className="sd-hero__cart-item-actions">
                      <div className="sd-hero__qty-control" aria-label="Количество товара">
                        <button
                          className="sd-hero__qty-btn"
                          type="button"
                          aria-label="Уменьшить"
                          onClick={() => {
                            sd_handleQuantityChange(sd_item.id, -1);
                          }}
                        >
                          −
                        </button>
                        <span className="sd-hero__qty-value">{sd_item.quantity}</span>
                        <button
                          className="sd-hero__qty-btn"
                          type="button"
                          aria-label="Увеличить"
                          onClick={() => {
                            sd_handleQuantityChange(sd_item.id, 1);
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="sd-hero__cart-remove"
                        type="button"
                        disabled={sd_removingItemIds.includes(sd_item.id)}
                        onClick={() => {
                          sd_handleRemoveItem(sd_item.id);
                        }}
                      >
                        удалить
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="sd-hero__cart-footer">
            <div className="sd-hero__cart-total-row">
              <span>итого</span>
              <strong>{sd_currencyFormatter.format(sd_totalPrice)} ₽</strong>
            </div>
            <button
              className="sd-hero__cart-checkout"
              type="button"
              onClick={() => {
                sd_setIsCartOpen(false);
                onCheckoutOpen?.();
              }}
            >
              оформить заказ
            </button>
          </div>
        </aside>
      </div>

      <div className="sd-hero__marquee" aria-hidden>
        <div className="sd-hero__marquee-track">
          {sd_marqueeItems.map((sd_item, sd_index) => (
            <span className="sd-hero__marquee-text" key={`sd_marquee_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
        <div className="sd-hero__marquee-track" aria-hidden>
          {sd_marqueeItems.map((sd_item, sd_index) => (
            <span className="sd-hero__marquee-text" key={`sd_marquee_copy_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
      </div>

      <div className="sd-hero__bag-container">
        <SdHeroBagViewer
          frameCount={240}
          durationMs={8000}
          frameDirectory="/output"
          framePrefix="ezgif-frame-"
          frameExtension="png"
          framePadLength={3}
          className="sd-hero__bag-viewer"
        />
      </div>

      <div className="sd-hero__info">
        <p className="sd-hero__info-text">
          each hush brand bag is the perfect combination of creativity and practicality.
        </p>
        <div className="sd-hero__actions">
          <a className="sd-hero__button-main" href="/about">
            <span className="sd-hero__button-main-text">узнать больше</span>
          </a>
          <button className="sd-hero__button-arrow" type="button" aria-label="Перейти">
            <svg
              className="sd-hero__button-arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M5 12H18.5M18.5 12L13 6.5M18.5 12L13 17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
