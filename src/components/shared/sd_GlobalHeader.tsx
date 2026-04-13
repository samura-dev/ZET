import { useState, useMemo, useEffect } from "react";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import sd_productsData from "../../data/sd_products.json";
import gsap from "gsap";
import "./sd_GlobalHeader.css";

const sd_menuItems: Array<{ label: string; href: string }> = [
  { label: "главная", href: "/" },
  { label: "о нас", href: "/about" },
  { label: "отзывы", href: "/reviews" },
  { label: "контакты", href: "/contacts" }
];

type sd_GlobalHeaderProps = {
  showLeftMenu?: boolean;
};

export const SdGlobalHeader = ({ showLeftMenu = true }: sd_GlobalHeaderProps): JSX.Element => {
  const [sd_isSearchOpen, sd_setIsSearchOpen] = useState(false);
  const [sd_searchQuery, sd_setSearchQuery] = useState("");
  const [sd_isMobileMenuOpen, sd_setIsMobileMenuOpen] = useState(false);
  const sd_activePath = window.location.pathname;
  const sd_totalItems = sd_useCartStore((sd_state) => sd_state.sd_getTotalItems());
  
  const sd_products = sd_productsData;
  const sd_currencyFormatter = new Intl.NumberFormat("ru-RU");

  const sd_searchResults = useMemo(() => {
    if (sd_searchQuery.trim().length < 2) return [];
    const sd_q = sd_searchQuery.toLowerCase();
    return sd_products.filter(
      (p) => p.title.toLowerCase().includes(sd_q) || p.description.toLowerCase().includes(sd_q)
    ).slice(0, 5);
  }, [sd_searchQuery, sd_products]);

  useEffect(() => {
    if (sd_isMobileMenuOpen) {
      gsap.fromTo(
        ".sd_global_header__menu_item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [sd_isMobileMenuOpen]);

  return (
    <>
      <header className={sd_isMobileMenuOpen ? "sd_global_header sd_global_header--menu_open" : "sd_global_header"} aria-label="Основная шапка">
        {showLeftMenu && (
          <>
            <button
              className="sd_global_header__burger"
              type="button"
              aria-label="Открыть меню"
              aria-expanded={sd_isMobileMenuOpen}
              onClick={() => sd_setIsMobileMenuOpen(true)}
            >
              <span />
              <span />
            </button>

            <nav
              className={
                sd_isMobileMenuOpen
                  ? "sd_global_header__menu sd_global_header__menu--open"
                  : "sd_global_header__menu"
              }
              aria-label="Навигация"
            >
              <button
                className="sd_global_header__menu_close"
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
                  key={sd_item.href}
                  href={sd_item.href}
                  onClick={() => sd_setIsMobileMenuOpen(false)}
                  style={{ opacity: 0 }}
                  className={
                    sd_activePath === sd_item.href
                      ? "sd_global_header__menu_item sd_global_header__menu_item--active"
                      : "sd_global_header__menu_item"
                  }
                >
                  <span>{sd_item.label}</span>
                </a>
              ))}
            </nav>
          </>
        )}

        <a href="/" className="sd_global_header__brand" aria-label="HUSH ZET">
          ZET
        </a>

        <div className="sd_global_header__tools">
          <button
            className="sd_global_header__tool_button"
            type="button"
            aria-label="Открыть поиск"
            onClick={() => {
              sd_setIsSearchOpen((sd_prev) => !sd_prev);
            }}
          >
            <span className="sd_global_header__search_icon" aria-hidden>
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
          <a className="sd_global_header__tool_button" href="/checkout" aria-label="Открыть корзину">
            <span className="sd_global_header__cart_icon" aria-hidden>
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
              {sd_totalItems > 0 && (
                <span className="sd_global_header__cart_badge">{sd_totalItems}</span>
              )}
            </span>
          </a>
        </div>
      </header>

      <div
        className={
          sd_isSearchOpen
            ? "sd_global_header__search_overlay sd_global_header__search_overlay--open"
            : "sd_global_header__search_overlay"
        }
        onClick={() => {
          sd_setIsSearchOpen(false);
        }}
      >
        <div
          className="sd_global_header__search_panel"
          onClick={(sd_event) => {
            sd_event.stopPropagation();
          }}
        >
          <span className="sd_global_header__search_panel_icon" aria-hidden>
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
            className="sd_global_header__search_input"
            placeholder="Поиск по каталогу..."
            value={sd_searchQuery}
            onChange={(sd_event) => {
              sd_setSearchQuery(sd_event.target.value);
            }}
          />
          <button
            className="sd_global_header__search_close"
            type="button"
            onClick={() => {
              sd_setIsSearchOpen(false);
              sd_setSearchQuery("");
            }}
          >
            ×
          </button>

          {sd_searchResults.length > 0 && (
            <div className="sd_global_header__search_results">
              {sd_searchResults.map((sd_result) => (
                <a
                  key={sd_result.id}
                  href={`/product/${sd_result.id}`}
                  className="sd_global_header__search_result_item"
                >
                  <img src={sd_result.images[0]} alt="" />
                  <div className="sd_global_header__search_result_info">
                    <p className="sd_global_header__search_result_name">{sd_result.title}</p>
                    <p className="sd_global_header__search_result_price">
                      {sd_currencyFormatter.format(sd_result.price)} ₽
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {sd_searchQuery.trim().length >= 2 && sd_searchResults.length === 0 && (
            <div className="sd_global_header__search_no_results">
              ничего не найдено
            </div>
          )}
        </div>
      </div>
    </>
  );
};
