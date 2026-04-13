import { useState, useMemo } from "react";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import sd_productsData from "../../data/sd_products.json";
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

  return (
    <>
      <header className="sd-global-header" aria-label="Основная шапка">
        {showLeftMenu ? (
          <nav className="sd-global-header__menu" aria-label="Навигация">
            {sd_menuItems.map((sd_item) => (
              <a
                key={sd_item.href}
                href={sd_item.href}
                className={
                  sd_activePath === sd_item.href
                    ? "sd-global-header__menu-item sd-global-header__menu-item--active"
                    : "sd-global-header__menu-item"
                }
              >
                <span>{sd_item.label}</span>
              </a>
            ))}
          </nav>
        ) : (
          <span />
        )}

        <a href="/" className="sd-global-header__brand" aria-label="HUSH ZET">
          ZET
        </a>

        <div className="sd-global-header__tools">
          <button
            className="sd-global-header__tool-button"
            type="button"
            aria-label="Открыть поиск"
            onClick={() => {
              sd_setIsSearchOpen((sd_prev) => !sd_prev);
            }}
          >
            <span className="sd-global-header__search-icon" aria-hidden>
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
          <a className="sd-global-header__tool-button" href="/checkout" aria-label="Открыть корзину">
            <span className="sd-global-header__cart-icon" aria-hidden>
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
                <span className="sd-global-header__cart-badge">{sd_totalItems}</span>
              )}
            </span>
          </a>
        </div>
      </header>

      <div
        className={
          sd_isSearchOpen
            ? "sd-global-header__search-overlay sd-global-header__search-overlay--open"
            : "sd-global-header__search-overlay"
        }
        onClick={() => {
          sd_setIsSearchOpen(false);
        }}
      >
        <div
          className="sd-global-header__search-panel"
          onClick={(sd_event) => {
            sd_event.stopPropagation();
          }}
        >
          <span className="sd-global-header__search-panel-icon" aria-hidden>
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
            className="sd-global-header__search-input"
            placeholder="Поиск по каталогу..."
            value={sd_searchQuery}
            onChange={(sd_event) => {
              sd_setSearchQuery(sd_event.target.value);
            }}
          />
          <button
            className="sd-global-header__search-close"
            type="button"
            onClick={() => {
              sd_setIsSearchOpen(false);
              sd_setSearchQuery("");
            }}
          >
            ×
          </button>

          {sd_searchResults.length > 0 && (
            <div className="sd-global-header__search-results">
              {sd_searchResults.map((sd_result) => (
                <a
                  key={sd_result.id}
                  href={`/product/${sd_result.id}`}
                  className="sd-global-header__search-result-item"
                >
                  <img src={sd_result.images[0]} alt="" />
                  <div className="sd-global-header__search-result-info">
                    <p className="sd-global-header__search-result-name">{sd_result.title}</p>
                    <p className="sd-global-header__search-result-price">
                      {sd_currencyFormatter.format(sd_result.price)} ₽
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {sd_searchQuery.trim().length >= 2 && sd_searchResults.length === 0 && (
            <div className="sd-global-header__search-no-results">
              ничего не найдено
            </div>
          )}
        </div>
      </div>
    </>
  );
};
