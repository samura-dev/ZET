import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import useEmblaCarousel from "embla-carousel-react";
import {
  sd_formatPrice,
  sd_getProductBySlug,
  sd_getRelatedProducts
} from "../../data/sd_products";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import "./sd_ProductPage.css";

type sd_ProductPageProps = {
  slug: string;
  onBackHome?: () => void;
  onOpenCheckout?: () => void;
};

export const SdProductPage = ({
  slug,
  onBackHome,
  onOpenCheckout
}: sd_ProductPageProps): JSX.Element => {
  const sd_product = sd_getProductBySlug(slug);
  const sd_addItem = sd_useCartStore((sd_state) => sd_state.sd_addItem);
  const [sd_ctaState, sd_setCtaState] = useState<"idle" | "added">("idle");
  const [sd_relatedEmblaRef, sd_relatedEmblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: false,
    duration: 40
  });

  const sd_related = useMemo(() => sd_getRelatedProducts(slug, 3), [slug]);

  useEffect(() => {
    sd_setCtaState("idle");
  }, [slug]);

  useEffect(() => {
    if (!sd_product) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sd_prefersReducedMotion) {
      return;
    }

    const sd_tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    sd_tl
      .from(".sd-product__breadcrumbs", { y: 12, opacity: 0, duration: 0.38, clearProps: "all" })
      .from(".sd-product__media", { y: 16, opacity: 0, duration: 0.44, clearProps: "all" }, "-=0.18")
      .from(".sd-product__content", { y: 16, opacity: 0, duration: 0.46, clearProps: "all" }, "-=0.3");

    return () => {
      sd_tl.kill();
    };
  }, [sd_product]);


  useEffect(() => {
    if (!sd_relatedEmblaApi) {
      return;
    }

    const sd_viewport = sd_relatedEmblaApi.rootNode();
    const sd_onWheel = (sd_event: WheelEvent): void => {
      if (Math.abs(sd_event.deltaY) < 6 && Math.abs(sd_event.deltaX) < 6) {
        return;
      }

      sd_event.preventDefault();

      if (sd_event.deltaY > 0 || sd_event.deltaX > 0) {
        sd_relatedEmblaApi.scrollNext();
      } else {
        sd_relatedEmblaApi.scrollPrev();
      }
    };

    sd_viewport.addEventListener("wheel", sd_onWheel, { passive: false });
    return () => {
      sd_viewport.removeEventListener("wheel", sd_onWheel);
    };
  }, [sd_relatedEmblaApi]);

  if (!sd_product) {
    return (
      <section className="sd-product sd-product--not-found" aria-label="Товар не найден">
        <div className="sd-product__not-found">
          <h2>товар не найден</h2>
          <p>Похоже, ссылка устарела. Вернитесь в каталог и выберите актуальную модель.</p>
          <button
            className="sd-product__ghost-button"
            type="button"
            onClick={() => {
              onBackHome?.();
            }}
          >
            на главную
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="sd-product" aria-label={`Страница товара ${sd_product.title}`}>
      <div className="sd-product__breadcrumbs">
        <button
          className="sd-product__crumb-button"
          type="button"
          onClick={() => {
            onBackHome?.();
          }}
        >
          ← каталог
        </button>
        <span>/</span>
        <span>{sd_product.title}</span>
      </div>

      <div className="sd-product__layout">
        <div className="sd-product__media">
          <div className="sd-product__main-image-wrap">
            <img
              className="sd-product__main-image"
              src={sd_product.images[0]}
              alt={`Сумка ${sd_product.title}`}
            />
          </div>
        </div>

        <div className="sd-product__content">
          <span className="sd-product__badge">{sd_product.badge}</span>
          <h1 className="sd-product__title">{sd_product.title}</h1>
          <p className="sd-product__subtitle">{sd_product.shortDescription}</p>

          <div className="sd-product__price-row">
            <strong>{sd_formatPrice(sd_product.price)}</strong>
            {sd_product.oldPrice ? <s>{sd_formatPrice(sd_product.oldPrice)}</s> : null}
            <span className={sd_product.stock > 0 ? "sd-product__stock" : "sd-product__stock sd-product__stock--out"}>
              {sd_product.stock > 0 ? `в наличии: ${sd_product.stock}` : "нет в наличии"}
            </span>
          </div>

          <p className="sd-product__description">{sd_product.description}</p>

          <ul className="sd-product__specs">
            {sd_product.specs.map((sd_spec) => (
              <li key={sd_spec}>{sd_spec}</li>
            ))}
          </ul>

          <div className="sd-product__actions">
            <button
              className="sd-product__primary-button"
              type="button"
              onClick={() => {
                if (sd_product) {
                  sd_addItem(sd_product);
                  sd_setCtaState("added");
                  window.setTimeout(() => {
                    sd_setCtaState("idle");
                  }, 1400);
                }
              }}
              disabled={!sd_product || sd_product.stock === 0}
            >
              {sd_ctaState === "added" ? "добавлено" : "в корзину"}
            </button>
            <button
              className="sd-product__secondary-button"
              type="button"
              onClick={() => {
                if (sd_product) {
                  sd_addItem(sd_product);
                  onOpenCheckout?.();
                }
              }}
              disabled={!sd_product || sd_product.stock === 0}
            >
              купить сейчас
            </button>
          </div>
        </div>
      </div>

      <div className="sd-product__related">
        <h2 className="sd-product__related-title">похожие товары</h2>
        <div className="sd-product__related-slider">
          <div className="sd-product__related-viewport" ref={sd_relatedEmblaRef}>
            <div className="sd-product__related-track">
              {sd_related.map((sd_item) => (
                <div className="sd-product__related-slide" key={sd_item.id}>
                  <article className="sd-product__related-card">
                    <a href={`/product/${sd_item.slug}`} className="sd-product__related-visual">
                      <span className="sd-product__related-badge">{sd_item.badge}</span>
                      <img
                        className="sd-product__related-image"
                        src={sd_item.images[0]}
                        alt={`Сумка ${sd_item.title}`}
                        loading="lazy"
                      />
                    </a>

                    <div className="sd-product__related-info">
                      <div className="sd-product__related-meta">
                        <h3 className="sd-product__related-name">{sd_item.title}</h3>
                        <p className="sd-product__related-price">{sd_formatPrice(sd_item.price)}</p>
                      </div>
                      <div className="sd-product__related-actions">
                        <button
                          className="sd-product__related-add"
                          type="button"
                          aria-label="Добавить в корзину"
                          onClick={(sd_event) => {
                            sd_event.preventDefault();
                            sd_addItem(sd_item);
                          }}
                        >
                          +
                        </button>
                        <a className="sd-product__related-link" href={`/product/${sd_item.slug}`}>
                          к товару
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
