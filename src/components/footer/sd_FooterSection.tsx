import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_FooterSection.css";

gsap.registerPlugin(ScrollTrigger);

const sd_footerMenu = [
  { label: "главная", href: "/" },
  { label: "о нас", href: "/about" },
  { label: "отзывы", href: "/reviews" },
  { label: "контакты", href: "/contacts" }
];

const sd_footerContacts = [
  { label: "instagram", href: "#" },
  { label: "telegram", href: "#" },
  { label: "почта", href: "mailto:hello@hush-bags.com" }
];

const sd_footerTicker = [
  "HUSH FUTURE OBJECT",
  "CARRY ART CODE",
  "ZET STUDIO",
  "HUSH FUTURE OBJECT",
  "CARRY ART CODE",
  "ZET STUDIO"
];

export const SdFooterSection = (): JSX.Element => {
  const sd_footerRef = useRef<HTMLElement | null>(null);
  const sd_currentYear = new Date().getFullYear();

  useEffect(() => {
    const sd_footer = sd_footerRef.current;

    if (!sd_footer) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sd_ctx = gsap.context(() => {
      const sd_top = sd_footer.querySelector<HTMLElement>(".sd_footer__top");
      const sd_content = sd_footer.querySelector<HTMLElement>(".sd_footer__content");
      const sd_bottom = sd_footer.querySelector<HTMLElement>(".sd_footer__bottom");
      const sd_tickerTrack = sd_footer.querySelector<HTMLElement>(".sd_footer__ticker-track");
      const sd_orbLeft = sd_footer.querySelector<HTMLElement>(".sd_footer__orb--left");
      const sd_orbRight = sd_footer.querySelector<HTMLElement>(".sd_footer__orb--right");
      const sd_columns = sd_footer.querySelectorAll<HTMLElement>(".sd_footer__column");

      if (!sd_top || !sd_content || !sd_bottom || !sd_tickerTrack || !sd_orbLeft || !sd_orbRight) {
        return;
      }

      if (sd_prefersReducedMotion) {
        gsap.set([sd_top, sd_content, sd_bottom, sd_columns], {
          autoAlpha: 1,
          clearProps: "transform"
        });
        return;
      }

      gsap.set([sd_top, sd_content, sd_bottom], { autoAlpha: 0, y: 42 });
      gsap.set(sd_columns, { autoAlpha: 0, y: 30 });

      const sd_introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sd_footer,
          start: "top 80%",
          once: true
        }
      });

      sd_introTl
        .to(sd_top, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out"
        })
        .to(
          sd_content,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out"
          },
          "-=0.52"
        )
        .to(
          sd_columns,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out"
          },
          "-=0.6"
        )
        .to(
          sd_bottom,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out"
          },
          "-=0.56"
        );

      gsap.to(sd_tickerTrack, {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "none"
      });

      gsap.to(sd_orbLeft, {
        x: 26,
        y: -18,
        scale: 1.08,
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(sd_orbRight, {
        x: -30,
        y: 20,
        scale: 1.1,
        duration: 6.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sd_footer);

    return () => {
      sd_ctx.revert();
    };
  }, []);

  return (
    <footer className="sd_footer" aria-label="Подвал сайта HUSH" ref={sd_footerRef}>
      <span className="sd_footer__orb sd_footer__orb--left" aria-hidden />
      <span className="sd_footer__orb sd_footer__orb--right" aria-hidden />
      <span className="sd_footer__grid" aria-hidden />

      <div className="sd_footer__ticker" aria-hidden>
        <div className="sd_footer__ticker-track">
          {sd_footerTicker.map((sd_item, sd_index) => (
            <span className="sd_footer__ticker-item" key={`sd_footer_ticker_a_${sd_index}`}>
              {sd_item}
            </span>
          ))}
          {sd_footerTicker.map((sd_item, sd_index) => (
            <span className="sd_footer__ticker-item" key={`sd_footer_ticker_b_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
      </div>

      <div className="sd_footer__top">
        <p className="sd_footer__brand">HUSH / ZET</p>
        <p className="sd_footer__subtitle">футуристичные сумки на стыке формы, практичности и искусства</p>
      </div>

      <div className="sd_footer__content">
        <nav className="sd_footer__column" aria-label="Навигация футера">
          <h3 className="sd_footer__column-title">навигация</h3>
          <ul className="sd_footer__list">
            {sd_footerMenu.map((sd_item) => (
              <li key={sd_item.label}>
                <a className="sd_footer__link" href={sd_item.href}>
                  {sd_item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sd_footer__column">
          <h3 className="sd_footer__column-title">контакты</h3>
          <ul className="sd_footer__list">
            {sd_footerContacts.map((sd_item) => (
              <li key={sd_item.label}>
                <a className="sd_footer__link" href={sd_item.href}>
                  {sd_item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sd_footer__column">
          <h3 className="sd_footer__column-title">доставка</h3>
          <ul className="sd_footer__list">
            <li>
              <p className="sd_footer__meta">по миру: 3-9 рабочих дней</p>
            </li>
            <li>
              <p className="sd_footer__meta">возврат: 14 дней</p>
            </li>
            <li>
              <p className="sd_footer__meta">поддержка: 24/7</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="sd_footer__bottom">
        <p className="sd_footer__meta">© {sd_currentYear} HUSH. Все права защищены.</p>
        <p className="sd_footer__meta">made with love in moscow</p>
      </div>
    </footer>
  );
};
