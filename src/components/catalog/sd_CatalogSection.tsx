import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  sd_formatPrice,
  sd_getProductsByCategory,
  sd_products
} from "../../data/sd_products";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import "./sd_CatalogSection.css";

type sd_TabKey = "bloggers" | "new" | "best";

interface sd_CatalogProduct {
  id: string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  badge: string;
  href: string;
}

interface sd_Tab {
  key: sd_TabKey;
  label: string;
  tone: "side" | "center";
}

const sd_tabs: sd_Tab[] = [
  { key: "bloggers", label: "ВЫБОР БЛОГЕРОВ", tone: "side" },
  { key: "new", label: "НОВИНКИ", tone: "center" },
  { key: "best", label: "БЕСТСЕЛЛЕРЫ", tone: "side" }
];

const sd_expandProductsToNine = (sd_items: sd_CatalogProduct[]): sd_CatalogProduct[] => {
  return Array.from({ length: 9 }, (_, sd_index) => {
    const sd_source = sd_items[sd_index % sd_items.length];
    return {
      ...sd_source,
      id: `${sd_source.id}-${sd_index + 1}`
    };
  });
};

export const SdCatalogSection = (): JSX.Element => {
  const [sd_activeTab, sd_setActiveTab] = useState<sd_TabKey>("new");
  const [sd_activeSlide, sd_setActiveSlide] = useState<number>(0);
  const sd_addItem = sd_useCartStore((sd_state) => sd_state.sd_addItem);
  const [sd_emblaRef, sd_emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: false,
    duration: 40
  });

  const sd_productsByTab = useMemo<Record<sd_TabKey, sd_CatalogProduct[]>>(() => {
    const sd_toCatalogProduct = (
      sd_item: (typeof sd_products)[number]
    ): sd_CatalogProduct => ({
      id: sd_item.id,
      title: sd_item.title,
      price: sd_formatPrice(sd_item.price),
      imageSrc: sd_item.images[0] ?? "/bags/bags1.png",
      imageAlt: `Сумка ${sd_item.title}`,
      badge: sd_item.badge,
      href: `/product/${sd_item.slug}`
    });

    const sd_fallback = sd_toCatalogProduct(sd_products[0]);
    const sd_bloggers = sd_getProductsByCategory("bloggers").map(sd_toCatalogProduct);
    const sd_new = sd_getProductsByCategory("new").map(sd_toCatalogProduct);
    const sd_best = sd_getProductsByCategory("best").map(sd_toCatalogProduct);

    return {
      bloggers: sd_expandProductsToNine(sd_bloggers.length ? sd_bloggers : [sd_fallback]),
      new: sd_expandProductsToNine(sd_new.length ? sd_new : [sd_fallback]),
      best: sd_expandProductsToNine(sd_best.length ? sd_best : [sd_fallback])
    };
  }, []);

  const sd_productsList = sd_productsByTab[sd_activeTab];

  const sd_syncActiveSlide = useCallback((): void => {
    if (!sd_emblaApi) {
      return;
    }
    sd_setActiveSlide(sd_emblaApi.selectedScrollSnap());
  }, [sd_emblaApi]);

  useEffect(() => {
    if (!sd_emblaApi) {
      return;
    }

    sd_syncActiveSlide();
    sd_emblaApi.on("select", sd_syncActiveSlide);
    sd_emblaApi.on("reInit", sd_syncActiveSlide);

    return () => {
      sd_emblaApi.off("select", sd_syncActiveSlide);
      sd_emblaApi.off("reInit", sd_syncActiveSlide);
    };
  }, [sd_emblaApi, sd_syncActiveSlide]);

  useEffect(() => {
    if (!sd_emblaApi) {
      return;
    }
    sd_emblaApi.reInit();
    sd_emblaApi.scrollTo(0, true);
    sd_setActiveSlide(0);
  }, [sd_activeTab, sd_emblaApi]);

  useEffect(() => {
    if (!sd_emblaApi) {
      return;
    }

    const sd_viewport = sd_emblaApi.rootNode();
    const sd_onWheel = (sd_event: WheelEvent): void => {
      if (Math.abs(sd_event.deltaY) < 6 && Math.abs(sd_event.deltaX) < 6) {
        return;
      }
      sd_event.preventDefault();
      if (sd_event.deltaY > 0 || sd_event.deltaX > 0) {
        sd_emblaApi.scrollNext();
      } else {
        sd_emblaApi.scrollPrev();
      }
    };

    sd_viewport.addEventListener("wheel", sd_onWheel, { passive: false });
    return () => {
      sd_viewport.removeEventListener("wheel", sd_onWheel);
    };
  }, [sd_emblaApi]);

  return (
    <section className="sd_catalog" id="catalog" aria-label="Каталог сумок HUSH">
      <div className="sd_catalog__tabs" role="tablist" aria-label="Группы товаров">
        {sd_tabs.map((sd_tab) => {
          const sd_isActive = sd_activeTab === sd_tab.key;
          return (
            <button
              key={sd_tab.key}
              type="button"
              role="tab"
              aria-selected={sd_isActive}
              aria-controls={`sd_catalog-panel-${sd_tab.key}`}
              className={[
                "sd_catalog__tab",
                sd_tab.tone === "center"
                  ? "sd_catalog__tab--center"
                  : "sd_catalog__tab--side",
                sd_isActive ? "sd_catalog__tab--active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                sd_setActiveTab(sd_tab.key);
              }}
            >
              {sd_tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="sd_catalog__slider"
        id={`sd_catalog-panel-${sd_activeTab}`}
        role="tabpanel"
      >
        <div className="sd_catalog__viewport" ref={sd_emblaRef}>
          <div className="sd_catalog__track">
            {sd_productsList.map((sd_product, sd_index) => {
              const sd_isCentered = sd_index === sd_activeSlide;
              return (
                <div
                  className={
                    sd_isCentered
                      ? "sd_catalog__slide sd_catalog__slide--active"
                      : "sd_catalog__slide"
                  }
                  key={sd_product.id}
                >
                  <article
                    className="sd_catalog__card"
                    onClick={() => {
                      sd_emblaApi?.scrollNext();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(sd_event) => {
                      if (sd_event.key === "Enter" || sd_event.key === " ") {
                        sd_event.preventDefault();
                        sd_emblaApi?.scrollNext();
                      }
                    }}
                  >
                    <div className="sd_catalog__card-visual">
                      <span className="sd_catalog__card-badge">{sd_product.badge}</span>
                      <img
                        className="sd_catalog__card-image"
                        src={sd_product.imageSrc}
                        alt={sd_product.imageAlt}
                        width={385}
                        height={350}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="sd_catalog__card-footer">
                      <div className="sd_catalog__card-meta">
                        <h3 className="sd_catalog__card-title">{sd_product.title}</h3>
                        <p className="sd_catalog__card-price">{sd_product.price}</p>
                      </div>
                      <div className="sd_catalog__card-actions">
                        <button
                          className="sd_catalog__card-add-btn"
                          type="button"
                          aria-label="Добавить в корзину"
                          onClick={(sd_event) => {
                            sd_event.stopPropagation();
                            const sd_originalId = sd_product.id.includes("-") 
                              ? sd_product.id.substring(0, sd_product.id.lastIndexOf("-"))
                              : sd_product.id;
                            const sd_originalProduct = sd_products.find(p => p.id === sd_originalId);
                            if (sd_originalProduct) {
                              sd_addItem(sd_originalProduct);
                            }
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                        <a
                          className="sd_catalog__card-cta"
                          href={sd_product.href}
                          onClick={(sd_event) => {
                            sd_event.stopPropagation();
                          }}
                        >
                          К товару
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

