import { useEffect, useMemo, useRef, useState } from "react";
import { SdHeroBagViewer } from "./sd_HeroBagViewer";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import sd_productsData from "../../data/sd_products.json";
import gsap from "gsap";
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

  useEffect(() => {
    if (sd_isMobileMenuOpen) {
      gsap.fromTo(
        ".sd_hero__menu_item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [sd_isMobileMenuOpen]);

  return (
    <section className="sd_hero" aria-label="Главный экран HUSH">
      <div className="sd_hero__background_glow" aria-hidden="true" />

      <header className={sd_isMobileMenuOpen ? "sd_hero__topbar sd_hero__topbar--menu_open" : "sd_hero__topbar"}>
        <button
          className="sd_hero__burger"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={sd_isMobileMenuOpen}
          onClick={() => sd_setIsMobileMenuOpen(true)}
        >
          <span />
          <span />
        </button>

        <nav className={sd_isMobileMenuOpen ? "sd_hero__menu sd_hero__menu--open" : "sd_hero__menu"}>
          <button
            className="sd_hero__menu_close"
            type="button"
            aria-label="Закрыть меню"
            onClick={() => sd_setIsMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {sd_menuItems.map((sd_item) => (
            <a 
              className="sd_hero__menu_item" 
              href={sd_item.href} 
              key={sd_item.label} 
              onClick={() => sd_setIsMobileMenuOpen(false)}
              style={{ opacity: 0 }}
            >
              <span className="sd_hero__menu_label">{sd_item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sd_hero__brand">
          <p className="sd_hero__brand_label">ZET</p>
        </div>

        <div className="sd_hero__tools">
          <button
            className="sd_hero__tool_button"
            type="button"
            aria-label="Поиск"
            aria-expanded={sd_isSearchOpen}
            onClick={() => {
              sd_setIsSearchOpen((sd_prev) => !sd_prev);
              sd_setIsCartOpen(false);
            }}
          >
            <span className="sd_hero__search_icon" aria-hidden>
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
            className="sd_hero__tool_button sd_hero__tool_button--cart"
            type="button"
            aria-label="Корзина"
            aria-expanded={sd_isCartOpen}
            onClick={() => {
              sd_setIsCartOpen((sd_prev) => !sd_prev);
              sd_setIsSearchOpen(false);
            }}
          >
            <span className="sd_hero__cart_icon" aria-hidden>
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
              <span className="sd_hero__cart_badge">{sd_totalQuantity}</span>
            ) : null}
          </button>
        </div>
      </header>

      <div
        className={
          sd_isSearchOpen
            ? "sd_hero__search_overlay sd_hero__search_overlay--open"
            : "sd_hero__search_overlay"
        }
        onClick={() => {
          sd_setIsSearchOpen(false);
        }}
      >
        <div
          className="sd_hero__search_panel"
          onClick={(sd_event) => {
            sd_event.stopPropagation();
          }}
        >
          <span className="sd_hero__search_panel_icon" aria-hidden>
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
            className="sd_hero__search_input"
            type="text"
            placeholder="Найти сумку..."
            value={sd_searchQuery}
            onChange={(sd_event) => {
              sd_setSearchQuery(sd_event.target.value);
            }}
          />
          <button
            className="sd_hero__search_close"
            type="button"
            onClick={() => {
              sd_setIsSearchOpen(false);
              sd_setSearchQuery("");
            }}
          >
            ×
          </button>

          {sd_searchResults.length > 0 && (
            <div className="sd_hero__search_results">
              {sd_searchResults.map((sd_result) => (
                <a
                  key={sd_result.id}
                  href={`/product/${sd_result.id}`}
                  className="sd_hero__search_result_item"
                >
                  <img src={sd_result.images[0]} alt="" />
                  <div className="sd_hero__search_result_info">
                    <p className="sd_hero__search_result_name">{sd_result.title}</p>
                    <p className="sd_hero__search_result_price">
                      {sd_currencyFormatter.format(sd_result.price)} ₽
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {sd_searchQuery.trim().length >= 2 && sd_searchResults.length === 0 && (
            <div className="sd_hero__search_no_results">
              ничего не найдено
            </div>
          )}
        </div>
      </div>

      <div
        className={
          sd_isCartOpen
            ? "sd_hero__cart_overlay sd_hero__cart_overlay--open"
            : "sd_hero__cart_overlay"
        }
        onClick={() => {
          sd_setIsCartOpen(false);
        }}
      >
        <aside
          className="sd_hero__cart_panel"
          onClick={(sd_event) => {
            sd_event.stopPropagation();
          }}
        >
          <div className="sd_hero__cart_head">
            <h3 className="sd_hero__cart_title">корзина</h3>
            <button
              className="sd_hero__cart_close"
              type="button"
              onClick={() => {
                sd_setIsCartOpen(false);
              }}
            >
              ×
            </button>
          </div>

          <div className="sd_hero__cart_list">
            {sd_cartItems.length === 0 ? (
              <p className="sd_hero__cart_empty">в корзине пока пусто</p>
            ) : (
              sd_cartItems.map((sd_item) => (
                <article
                  className={
                    sd_removingItemIds.includes(sd_item.id)
                      ? "sd_hero__cart_item sd_hero__cart_item--removing"
                      : "sd_hero__cart_item"
                  }
                  key={sd_item.id}
                >
                  <img
                    className="sd_hero__cart_item_image"
                    src={sd_item.images[0]}
                    alt={`Сумка ${sd_item.title}`}
                  />

                  <div className="sd_hero__cart_item_content">
                    <p className="sd_hero__cart_item_title">{sd_item.title}</p>
                    <p className="sd_hero__cart_item_price">
                      {sd_currencyFormatter.format(sd_item.price)} ₽
                    </p>

                    <div className="sd_hero__cart_item_actions">
                      <div className="sd_hero__qty_control">
                        <button
                          className="sd_hero__qty_btn"
                          type="button"
                          onClick={() => {
                            sd_handleQuantityChange(sd_item.id, -1);
                          }}
                        >
                          −
                        </button>
                        <span className="sd_hero__qty_value">{sd_item.quantity}</span>
                        <button
                          className="sd_hero__qty_btn"
                          type="button"
                          onClick={() => {
                            sd_handleQuantityChange(sd_item.id, 1);
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="sd_hero__cart_remove"
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

          <div className="sd_hero__cart_footer">
            <div className="sd_hero__cart_total_row">
              <span>итого</span>
              <strong>{sd_currencyFormatter.format(sd_totalPrice)} ₽</strong>
            </div>
            <button
              className="sd_hero__cart_checkout"
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

      <div className="sd_hero__marquee" aria-hidden>
        <div className="sd_hero__marquee_track">
          {sd_marqueeItems.map((sd_item, sd_index) => (
            <span className="sd_hero__marquee_text" key={`sd_marquee_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
        <div className="sd_hero__marquee_track" aria-hidden>
          {sd_marqueeItems.map((sd_item, sd_index) => (
            <span className="sd_hero__marquee_text" key={`sd_marquee_copy_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
      </div>

      <div className="sd_hero__bag_container">
        <SdHeroBagViewer
          frameCount={240}
          durationMs={8000}
          frameDirectory="/output"
          framePrefix="ezgif-frame-"
          frameExtension="png"
          framePadLength={3}
          className="sd_hero__bag_viewer"
        />
      </div>

      <div className="sd_hero__info">
        <p className="sd_hero__info_text">
          each hush brand bag is the perfect combination of creativity and practicality.
        </p>
        <div className="sd_hero__actions">
          <a className="sd_hero__button_main" href="/about">
            <span className="sd_hero__button_main_text">узнать больше</span>
          </a>
          <button className="sd_hero__button_arrow" type="button" aria-label="Перейти">
            <svg
              className="sd_hero__button_arrow_icon"
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
