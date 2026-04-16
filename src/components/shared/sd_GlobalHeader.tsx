import { useEffect, useMemo, useRef, useState } from "react";
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

export const SdGlobalHeader = (): JSX.Element => {
  const [sd_isSearchOpen, sd_setIsSearchOpen] = useState(false);
  const [sd_searchQuery, sd_setSearchQuery] = useState("");
  const [sd_isCartOpen, sd_setIsCartOpen] = useState(false);
  const [sd_isMobileMenuOpen, sd_setIsMobileMenuOpen] = useState(false);
  const [sd_removingItemIds, sd_setRemovingItemIds] = useState<string[]>([]);

  const sd_activePath = window.location.pathname;
  const {
    items: sd_cartItems,
    sd_updateQuantity,
    sd_removeItem,
    sd_getTotalItems,
    sd_getTotalPrice
  } = sd_useCartStore();

  const sd_products = sd_productsData;
  const sd_currencyFormatter = new Intl.NumberFormat("ru-RU");
  const sd_searchInputRef = useRef<HTMLInputElement | null>(null);
  const sd_removeTimersRef = useRef<Record<string, number>>({});

  const sd_totalQuantity = sd_getTotalItems();
  const sd_totalPrice = sd_getTotalPrice();

  const sd_searchResults = useMemo(() => {
    if (sd_searchQuery.trim().length < 2) {
      return [];
    }

    const sd_query = sd_searchQuery.toLowerCase();
    return sd_products
      .filter(
        (sd_product) =>
          sd_product.title.toLowerCase().includes(sd_query) ||
          sd_product.description.toLowerCase().includes(sd_query)
      )
      .slice(0, 5);
  }, [sd_searchQuery, sd_products]);

  useEffect(() => {
    if (sd_isSearchOpen) {
      window.setTimeout(() => sd_searchInputRef.current?.focus(), 100);
    }

    const sd_handleEscape = (sd_event: KeyboardEvent): void => {
      if (sd_event.key === "Escape") {
        sd_setIsSearchOpen(false);
        sd_setIsCartOpen(false);
        sd_setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", sd_handleEscape);
    return () => {
      window.removeEventListener("keydown", sd_handleEscape);
    };
  }, [sd_isSearchOpen]);

  useEffect(() => {
    if (sd_isMobileMenuOpen) {
      gsap.fromTo(
        ".sd_global_header__menu_item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [sd_isMobileMenuOpen]);

  const sd_handleQuantityChange = (sd_itemId: string, sd_delta: number): void => {
    const sd_item = sd_cartItems.find((sd_cartItem) => sd_cartItem.id === sd_itemId);
    if (sd_item) {
      sd_updateQuantity(sd_itemId, Math.max(1, sd_item.quantity + sd_delta));
    }
  };

  const sd_handleRemoveItem = (sd_itemId: string): void => {
    if (sd_removingItemIds.includes(sd_itemId)) {
      return;
    }

    sd_setRemovingItemIds((sd_prev) => [...sd_prev, sd_itemId]);
    sd_removeTimersRef.current[sd_itemId] = window.setTimeout(() => {
      sd_removeItem(sd_itemId);
      sd_setRemovingItemIds((sd_prev) => sd_prev.filter((sd_id) => sd_id !== sd_itemId));
      delete sd_removeTimersRef.current[sd_itemId];
    }, 300);
  };

  return (
    <>
      <header className={sd_isMobileMenuOpen ? "sd_global_header sd_global_header--menu_open" : "sd_global_header"}>
        <button className="sd_global_header__burger" type="button" onClick={() => sd_setIsMobileMenuOpen(true)} aria-label="Открыть меню">
          <span />
          <span />
        </button>

        <nav className={sd_isMobileMenuOpen ? "sd_global_header__menu sd_global_header__menu--open" : "sd_global_header__menu"}>
          <button className="sd_global_header__menu_close" type="button" onClick={() => sd_setIsMobileMenuOpen(false)} aria-label="Закрыть меню">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {sd_menuItems.map((sd_item) => (
            <a key={sd_item.href} href={sd_item.href} onClick={() => sd_setIsMobileMenuOpen(false)} className={sd_activePath === sd_item.href ? "sd_global_header__menu_item sd_global_header__menu_item--active" : "sd_global_header__menu_item"}>
              <span>{sd_item.label}</span>
            </a>
          ))}
        </nav>

        <a href="/" className="sd_global_header__brand">ZET</a>

        <div className="sd_global_header__tools">
          <button className="sd_global_header__tool_button" type="button" onClick={() => { sd_setIsSearchOpen(true); sd_setIsCartOpen(false); }} aria-label="Открыть поиск">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.9" />
              <path d="M15.7 15.7L20 20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>

          <button className="sd_global_header__tool_button" type="button" onClick={() => { sd_setIsCartOpen(true); sd_setIsSearchOpen(false); }} aria-label="Открыть корзину">
            <div className="sd_global_header__cart_icon_wrapper">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M3.2 4H6L7.6 13.2C7.8 14.3 8.8 15.1 9.9 15.1H18.3C19.4 15.1 20.4 14.3 20.6 13.2L21.5 8H7.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10.2" cy="19" r="1.75" stroke="currentColor" strokeWidth="1.9" />
                <circle cx="17.2" cy="19" r="1.75" stroke="currentColor" strokeWidth="1.9" />
              </svg>
              {sd_totalQuantity > 0 ? <span className="sd_global_header__cart_badge">{sd_totalQuantity}</span> : null}
            </div>
          </button>
        </div>
      </header>

      <div className={sd_isSearchOpen ? "sd_global_header__search_overlay sd_global_header__search_overlay--open" : "sd_global_header__search_overlay"} onClick={() => sd_setIsSearchOpen(false)}>
        <div className="sd_global_header__search_panel" onClick={(sd_event) => sd_event.stopPropagation()}>
          <div className="sd_global_header__search_input_wrapper">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20" className="sd_global_header__search_panel_icon">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.9" />
              <path d="M15.7 15.7L20 20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
            <input ref={sd_searchInputRef} className="sd_global_header__search_input" placeholder="Найти сумку..." value={sd_searchQuery} onChange={(sd_event) => sd_setSearchQuery(sd_event.target.value)} />
            <button className="sd_global_header__search_close" onClick={() => sd_setIsSearchOpen(false)} aria-label="Закрыть поиск">×</button>
          </div>

          {sd_searchResults.length > 0 ? (
            <div className="sd_global_header__search_results">
              {sd_searchResults.map((sd_result) => (
                <a key={sd_result.id} href={`/product/${sd_result.slug}`} className="sd_global_header__search_result_item">
                  <img src={sd_result.images[0]} alt={sd_result.title} />
                  <div>
                    <p className="sd_global_header__search_result_name">{sd_result.title}</p>
                    <p className="sd_global_header__search_result_price">{sd_currencyFormatter.format(sd_result.price)} ₽</p>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={sd_isCartOpen ? "sd_global_header__cart_overlay sd_global_header__cart_overlay--open" : "sd_global_header__cart_overlay"} onClick={() => sd_setIsCartOpen(false)}>
        <aside className="sd_global_header__cart_panel" onClick={(sd_event) => sd_event.stopPropagation()}>
          <div className="sd_global_header__cart_head">
            <h3 className="sd_global_header__cart_title">корзина</h3>
            <button className="sd_global_header__cart_close" onClick={() => sd_setIsCartOpen(false)} aria-label="Закрыть корзину">×</button>
          </div>

          <div className="sd_global_header__cart_list">
            {sd_cartItems.length === 0 ? (
              <p className="sd_global_header__cart_empty">в корзине пока пусто</p>
            ) : (
              sd_cartItems.map((sd_item) => (
                <article key={sd_item.id} className={sd_removingItemIds.includes(sd_item.id) ? "sd_global_header__cart_item sd_global_header__cart_item--removing" : "sd_global_header__cart_item"}>
                  <img src={sd_item.images[0]} alt={sd_item.title} className="sd_global_header__cart_item_image" />
                  <div className="sd_global_header__cart_item_content">
                    <p className="sd_global_header__cart_item_title">{sd_item.title}</p>
                    <p className="sd_global_header__cart_item_price">{sd_currencyFormatter.format(sd_item.price)} ₽</p>
                    <div className="sd_global_header__cart_item_actions">
                      <div className="sd_global_header__qty_control">
                        <button type="button" onClick={() => sd_handleQuantityChange(sd_item.id, -1)} aria-label="Уменьшить количество">−</button>
                        <span>{sd_item.quantity}</span>
                        <button type="button" onClick={() => sd_handleQuantityChange(sd_item.id, 1)} aria-label="Увеличить количество">+</button>
                      </div>
                      <button type="button" className="sd_global_header__cart_remove" onClick={() => sd_handleRemoveItem(sd_item.id)}>удалить</button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="sd_global_header__cart_footer">
            <div className="sd_global_header__cart_total_row">
              <span>итого</span>
              <strong>{sd_currencyFormatter.format(sd_totalPrice)} ₽</strong>
            </div>
            <a href="/checkout" className="sd_global_header__cart_checkout" onClick={() => sd_setIsCartOpen(false)}>оформить заказ</a>
          </div>
        </aside>
      </div>
    </>
  );
};
