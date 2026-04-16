import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { sd_products } from "../../data/sd_products";
import "./sd_ReviewsPage.css";

type sd_Review = {
  id: string;
  name: string;
  productSlug: string;
  rating: number;
  text: string;
  createdAt: string;
};

const sd_STORAGE_KEY = "sd_reviews_v1";

const sd_defaultReviews: sd_Review[] = [
  {
    id: "r1",
    name: "Анастасия",
    productSlug: "vex-metal",
    rating: 5,
    text: "Очень удобная форма, вживую выглядит даже лучше. Материал приятный и не маркий.",
    createdAt: "2026-03-22"
  },
  {
    id: "r2",
    name: "Ирина",
    productSlug: "blue-arc",
    rating: 4,
    text: "Брала как акцентный аксессуар, отлично собрал образ. Хочется больше цветов.",
    createdAt: "2026-03-18"
  }
];

const sd_hasMojibake = (sd_value: string): boolean => {
  return sd_value.includes("�") || /[РС][\u0400-\u040F\u0450-\u045F]/.test(sd_value);
};

const sd_isReviewBroken = (sd_review: sd_Review): boolean => {
  return (
    sd_hasMojibake(sd_review.name) ||
    sd_hasMojibake(sd_review.productSlug) ||
    sd_hasMojibake(sd_review.text) ||
    sd_hasMojibake(sd_review.createdAt)
  );
};

export const SdReviewsPage = (): JSX.Element => {
  const sd_rootRef = useRef<HTMLElement | null>(null);
  const sd_productMenuRef = useRef<HTMLDivElement | null>(null);
  const sd_ratingSteps = [0, 1, 2, 3, 4, 5];
  const [sd_reviews, sd_setReviews] = useState<sd_Review[]>(sd_defaultReviews);
  const [sd_name, sd_setName] = useState("");
  const [sd_productSlug, sd_setProductSlug] = useState(sd_products[0]?.slug ?? "");
  const [sd_isProductMenuOpen, sd_setIsProductMenuOpen] = useState(false);
  const [sd_rating, sd_setRating] = useState(5);
  const [sd_text, sd_setText] = useState("");

  useEffect(() => {
    try {
      const sd_raw = window.localStorage.getItem(sd_STORAGE_KEY);
      if (!sd_raw) {
        return;
      }

      const sd_parsed = JSON.parse(sd_raw) as sd_Review[];
      if (!Array.isArray(sd_parsed) || sd_parsed.length === 0) {
        return;
      }

      const sd_hasBroken = sd_parsed.some((sd_review) => sd_isReviewBroken(sd_review));
      if (sd_hasBroken) {
        window.localStorage.removeItem(sd_STORAGE_KEY);
        return;
      }

      sd_setReviews(sd_parsed);
    } catch {
      // Игнорируем битый localStorage и оставляем дефолтные отзывы.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(sd_STORAGE_KEY, JSON.stringify(sd_reviews));
  }, [sd_reviews]);

  useEffect(() => {
    if (!sd_rootRef.current) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sd_prefersReducedMotion) {
      return;
    }

    const sd_ctx = gsap.context(() => {
      gsap.fromTo(
        ".sd_reviews__hero, .sd_reviews__layout > *",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform"
        }
      );
    }, sd_rootRef);

    return () => {
      sd_ctx.revert();
    };
  }, []);

  useEffect(() => {
    const sd_handleClickOutside = (sd_event: MouseEvent): void => {
      if (!sd_productMenuRef.current) {
        return;
      }

      if (!sd_productMenuRef.current.contains(sd_event.target as Node)) {
        sd_setIsProductMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", sd_handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", sd_handleClickOutside);
    };
  }, []);

  const sd_handleSubmit = (sd_event: FormEvent): void => {
    sd_event.preventDefault();
    if (!sd_name.trim() || !sd_text.trim() || !sd_productSlug) {
      return;
    }

    const sd_nextReview: sd_Review = {
      id: `r_${Date.now()}`,
      name: sd_name.trim(),
      productSlug: sd_productSlug,
      rating: Math.max(0, Math.min(5, Math.round(sd_rating))),
      text: sd_text.trim(),
      createdAt: new Date().toISOString()
    };

    sd_setReviews((sd_prev) => [sd_nextReview, ...sd_prev]);
    sd_setName("");
    sd_setText("");
    sd_setRating(5);
  };

  const sd_reviewsWithProduct = useMemo(
    () =>
      sd_reviews.map((sd_review) => ({
        ...sd_review,
        product: sd_products.find((sd_product) => sd_product.slug === sd_review.productSlug)
      })),
    [sd_reviews]
  );

  const sd_selectedProduct = useMemo(
    () => sd_products.find((sd_product) => sd_product.slug === sd_productSlug),
    [sd_productSlug]
  );

  return (
    <section className="sd_reviews" aria-label="Отзывы" ref={sd_rootRef}>
      <header className="sd_reviews__hero">
        <h1>отзывы</h1>
        <p>Реальные мнения клиентов о моделях HUSH / ZET.</p>
      </header>

      <div className="sd_reviews__layout">
        <div className="sd_reviews__list">
          {sd_reviewsWithProduct.map((sd_review) => (
            <article className="sd_reviews__item" key={sd_review.id}>
              <div className="sd_reviews__item-head">
                <strong>{sd_review.name}</strong>
                <span>{new Date(sd_review.createdAt).toLocaleDateString("ru-RU")}</span>
              </div>
              <p className="sd_reviews__item-product">товар: {sd_review.product?.title ?? sd_review.productSlug}</p>
              <p className="sd_reviews__item-rating">
                рейтинг:
                <span className="sd_reviews__rating-pill" aria-label={`Рейтинг ${sd_review.rating} из 5`}>
                  {sd_review.rating}
                </span>
                <span>/5</span>
              </p>
              <p className="sd_reviews__item-text">{sd_review.text}</p>
            </article>
          ))}
        </div>

        <form className="sd_reviews__form" onSubmit={sd_handleSubmit}>
          <h2>оставить отзыв</h2>
          <label>
            имя
            <input value={sd_name} onChange={(sd_event) => sd_setName(sd_event.target.value)} />
          </label>
          <label>
            товар
            <div className="sd_reviews__select" ref={sd_productMenuRef}>
              <button
                className={
                  sd_isProductMenuOpen
                    ? "sd_reviews__select-trigger sd_reviews__select-trigger--open"
                    : "sd_reviews__select-trigger"
                }
                type="button"
                onClick={() => {
                  sd_setIsProductMenuOpen((sd_prev) => !sd_prev);
                }}
              >
                <span>{sd_selectedProduct?.title ?? "выберите товар"}</span>
                <span className="sd_reviews__select-chevron" aria-hidden>
                  v
                </span>
              </button>
              {sd_isProductMenuOpen ? (
                <div className="sd_reviews__select-menu">
                  {sd_products.map((sd_product) => (
                    <button
                      className={
                        sd_product.slug === sd_productSlug
                          ? "sd_reviews__select-option sd_reviews__select-option--active"
                          : "sd_reviews__select-option"
                      }
                      key={sd_product.id}
                      type="button"
                      onClick={() => {
                        sd_setProductSlug(sd_product.slug);
                        sd_setIsProductMenuOpen(false);
                      }}
                    >
                      {sd_product.title}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>
          <fieldset className="sd_reviews__rating-fieldset">
            <legend>рейтинг (0-5)</legend>
            <div className="sd_reviews__rating-grid" role="radiogroup" aria-label="Выбор рейтинга">
              {sd_ratingSteps.map((sd_step) => (
                <button
                  key={sd_step}
                  className={
                    sd_rating === sd_step
                      ? "sd_reviews__rating-button sd_reviews__rating-button--active"
                      : "sd_reviews__rating-button"
                  }
                  type="button"
                  role="radio"
                  aria-checked={sd_rating === sd_step}
                  onClick={() => {
                    sd_setRating(sd_step);
                  }}
                >
                  {sd_step}
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            отзыв
            <textarea value={sd_text} onChange={(sd_event) => sd_setText(sd_event.target.value)} />
          </label>
          <button type="submit">добавить отзыв</button>
        </form>
      </div>
    </section>
  );
};
