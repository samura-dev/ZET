import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_BlockThreeSection.css";

gsap.registerPlugin(ScrollTrigger);

export const SdBlockThreeSection = (): JSX.Element => {
  const sd_sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const sd_section = sd_sectionRef.current;

    if (!sd_section) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sd_isMobile = window.matchMedia("(max-width: 920px)").matches;

    let sd_sceneTl: gsap.core.Timeline | null = null;
    let sd_mobileTl: gsap.core.Timeline | null = null;

    const sd_ctx = gsap.context(() => {
      const sd_title = sd_section.querySelector<HTMLElement>(".sd-block-three__title");
      const sd_lead = sd_section.querySelector<HTMLElement>(".sd-block-three__lead");
      const sd_description = sd_section.querySelector<HTMLElement>(".sd-block-three__description");
      const sd_largeCard = sd_section.querySelector<HTMLElement>(".sd-block-three__item--large");
      const sd_smallCard = sd_section.querySelector<HTMLElement>(".sd-block-three__item--small");
      const sd_textColumn = sd_section.querySelector<HTMLElement>(".sd-block-three__text-column");
      const sd_spotlight = sd_section.querySelector<HTMLElement>(".sd-block-three__spotlight");

      if (!sd_title || !sd_lead || !sd_description || !sd_largeCard || !sd_smallCard || !sd_textColumn || !sd_spotlight) {
        return;
      }

      if (sd_prefersReducedMotion) {
        gsap.set([sd_title, sd_lead, sd_description, sd_largeCard, sd_smallCard], {
          autoAlpha: 1,
          clearProps: "transform"
        });
        return;
      }

      if (sd_isMobile) {
        sd_mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sd_section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        });

        sd_mobileTl
          .from([sd_title, sd_lead], {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
          })
          .from(
            [sd_largeCard, sd_textColumn, sd_smallCard],
            {
              autoAlpha: 0,
              y: 40,
              duration: 0.95,
              stagger: 0.12,
              ease: "power3.out"
            },
            "-=0.4"
          );

        return;
      }

      gsap.set([sd_title, sd_lead, sd_description], { autoAlpha: 0, y: 36 });
      gsap.set(sd_largeCard, { autoAlpha: 0, y: 48, scale: 0.96, transformOrigin: "50% 55%" });
      gsap.set(sd_smallCard, { autoAlpha: 0, y: 48, scale: 0.9, transformOrigin: "50% 55%" });
      gsap.set(sd_textColumn, { autoAlpha: 0, y: 28 });
      gsap.set(sd_spotlight, { autoAlpha: 0.25, xPercent: -120, scale: 0.8 });

      sd_sceneTl = gsap.timeline({
        scrollTrigger: {
          trigger: sd_section,
          start: "top top",
          end: "+=145%",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      sd_sceneTl
        .to([sd_title, sd_lead], {
          autoAlpha: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
          stagger: 0.04
        }, 0)
        .to([sd_largeCard, sd_textColumn, sd_smallCard], {
          autoAlpha: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          stagger: 0.04
        }, 0.06)
        .to(sd_spotlight, {
          autoAlpha: 0.7,
          xPercent: 16,
          scale: 1,
          duration: 0.46,
          ease: "power2.out"
        }, 0.1)

        .to(sd_largeCard, {
          scale: 1.04,
          xPercent: -2,
          yPercent: -1.5,
          duration: 0.36,
          ease: "power2.inOut"
        }, 0.28)
        .to(sd_textColumn, {
          xPercent: -3,
          yPercent: -1,
          duration: 0.3,
          ease: "power2.inOut"
        }, 0.3)
        .to(sd_smallCard, {
          scale: 0.94,
          autoAlpha: 0.62,
          xPercent: 4,
          duration: 0.32,
          ease: "power2.inOut"
        }, 0.28)

        .to(sd_spotlight, {
          xPercent: 132,
          autoAlpha: 0.78,
          duration: 0.42,
          ease: "power2.inOut"
        }, 0.56)
        .to(sd_largeCard, {
          scale: 0.9,
          autoAlpha: 0.35,
          xPercent: -8,
          yPercent: 1,
          duration: 0.42,
          ease: "power2.inOut"
        }, 0.56)
        .to(sd_textColumn, {
          xPercent: -6,
          autoAlpha: 0.54,
          duration: 0.36,
          ease: "power2.inOut"
        }, 0.56)
        .to(sd_smallCard, {
          scale: 1.08,
          autoAlpha: 1,
          xPercent: -3,
          yPercent: -1,
          duration: 0.42,
          ease: "power2.inOut"
        }, 0.58)

        .to(sd_title, {
          yPercent: -10,
          autoAlpha: 0.92,
          duration: 0.3,
          ease: "power1.inOut"
        }, 0.78)
        .to(sd_description, {
          autoAlpha: 1,
          y: 0,
          duration: 0.26,
          ease: "power2.out"
        }, 0.8);
    }, sd_section);

    return () => {
      sd_sceneTl?.scrollTrigger?.kill(true);
      sd_mobileTl?.scrollTrigger?.kill(true);
      sd_sceneTl?.kill();
      sd_mobileTl?.kill();
      sd_ctx.revert();
    };
  }, []);

  return (
    <section className="sd-block-three" aria-label="Carry Art" ref={sd_sectionRef}>
      <span className="sd-block-three__spotlight" aria-hidden />

      <div className="sd-block-three__top">
        <h2 className="sd-block-three__title">carry art</h2>
        <p className="sd-block-three__lead">
          наша команда увлечена футуризмом и инновациями, и мы воплощаем эту
          страсть в каждой создаваемой нами сумке.
        </p>
      </div>

      <div className="sd-block-three__content">
        <article className="sd-block-three__item sd-block-three__item--large">
          <a href="/product/aqua-layer" className="sd-block-three__visual sd-block-three__visual--large">
            <img
              className="sd-block-three__image sd-block-three__image--large"
              src="/block3/AQUA LAYER.jpg"
              alt="Сумка aqua layer"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div className="sd-block-three__meta">
            <div className="sd-block-three__meta-text">
              <h3 className="sd-block-three__name">aqua layer</h3>
              <p className="sd-block-three__price">45 000 ₽</p>
            </div>
            <a className="sd-block-three__button" href="/product/aqua-layer">
              к товару
            </a>
          </div>
        </article>

        <div className="sd-block-three__text-column">
          <p className="sd-block-three__description">
            мы любим экспериментировать с современными материалами, технологиями
            и формами, чтобы создавать продукты, которые не только отвечают вашим
            потребностям, но и вдохновляют на новые возможности. вместе мы
            исследуем будущее моды и функциональности, создавая сумки, которые
            станут вашими верными спутниками в стремительном ритме современной
            жизни.
          </p>
        </div>

        <article className="sd-block-three__item sd-block-three__item--small">
          <a href="/product/spike-candy" className="sd-block-three__visual sd-block-three__visual--small">
            <img
              className="sd-block-three__image sd-block-three__image--small"
              src="/block3/SPIKE CANDY.jpg"
              alt="Сумка spike candy"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div className="sd-block-three__meta sd-block-three__meta--small">
            <div className="sd-block-three__meta-text">
              <h3 className="sd-block-three__name">spike candy</h3>
              <p className="sd-block-three__price">29 900 ₽</p>
            </div>
            <a className="sd-block-three__button" href="/product/spike-candy">
              к товару
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};

