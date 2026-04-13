import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_AboutPage.css";

gsap.registerPlugin(ScrollTrigger);

type sd_AboutPoint = {
  id: string;
  title: string;
  text: string;
};

const sd_aboutPoints: sd_AboutPoint[] = [
  {
    id: "01",
    title: "производство",
    text:
      "Мы не верим в компромисс между формой и технологией. Каждая модель проходит лабораторию прототипов, ручную сборку и финальную шлифовку, чтобы визуальный акцент всегда был подкреплён точностью."
  },
  {
    id: "02",
    title: "процесс создания",
    text:
      "Мы собираем сумки как арт-объекты: исследуем материалы, моделируем геометрию, тестируем посадку и функциональность. Итог — вещи, которые работают в городе и выглядят как дизайнерский объект."
  },
  {
    id: "03",
    title: "качество",
    text:
      "Каждый материал проверяется по износостойкости, тактильности и визуальной чистоте. Мы добиваемся баланса между блеском и мягкостью, чтобы сумка сохраняла форму и характер годы."
  },
  {
    id: "04",
    title: "для кого",
    text:
      "Для тех, кто выбирает форму осознанно: смелые силуеты, архитектурные линии, технологичная отделка. HUSH / ZET — это аксессуары, которые говорят за вас прежде слов."
  }
];

export const SdAboutPage = (): JSX.Element => {
  const sd_rootRef = useRef<HTMLElement | null>(null);
  const sd_textRef = useRef<HTMLParagraphElement | null>(null);
  const sd_titleRef = useRef<HTMLHeadingElement | null>(null);
  const sd_bagRef = useRef<HTMLImageElement | null>(null);
  const [sd_activePoint, sd_setActivePoint] = useState(0);

  const sd_currentPoint = useMemo(() => sd_aboutPoints[sd_activePoint], [sd_activePoint]);

  useEffect(() => {
    const sd_root = sd_rootRef.current;
    if (!sd_root) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sd_prefersReducedMotion) {
      return;
    }

    const sd_ctx = gsap.context(() => {
      const sd_title = sd_titleRef.current;
      const sd_bag = sd_bagRef.current;

      gsap.fromTo(
        ".sd-about__hero > *",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform"
        }
      );

      if (sd_title && sd_bag) {
        const sd_targetY = Math.max(
          0,
          sd_bag.offsetTop + sd_bag.offsetHeight + 56 - sd_title.offsetTop
        );

        gsap.to(sd_title, {
          y: sd_targetY,
          ease: "none",
          scrollTrigger: {
            trigger: ".sd-about__hero",
            start: "top top",
            end: "bottom+=120 top",
            scrub: true
          }
        });
      }

      gsap.utils.toArray<HTMLElement>(".sd-about__section").forEach((sd_section) => {
        gsap.fromTo(
          sd_section,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: sd_section,
              start: "top 80%"
            }
          }
        );
      });
    }, sd_root);

    return () => {
      sd_ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!sd_textRef.current) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sd_prefersReducedMotion) {
      return;
    }

    gsap.fromTo(
      sd_textRef.current,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "opacity,transform" }
    );
  }, [sd_activePoint]);

  return (
    <section className="sd-about" ref={sd_rootRef}>
      <header className="sd-about__hero sd-about__section">
        <div className="sd-about__hero-top">
          <span className="sd-about__hero-caption">shape your reality</span>
        </div>
        <div className="sd-about__hero-visual">
          <img ref={sd_bagRef} src="/hero-about.png" alt="ZET hero" loading="lazy" />
          <h1 ref={sd_titleRef}>futurism in every fold</h1>
          <span className="sd-about__hero-note">visual shock</span>
        </div>
      </header>

      <section className="sd-about__process sd-about__section">
        <div className="sd-about__process-left">
          {sd_aboutPoints.map((sd_point, sd_index) => (
            <button
              className={
                sd_index === sd_activePoint
                  ? "sd-about__process-item sd-about__process-item--active"
                  : "sd-about__process-item"
              }
              key={sd_point.id}
              type="button"
              onMouseEnter={() => {
                sd_setActivePoint(sd_index);
              }}
              onFocus={() => {
                sd_setActivePoint(sd_index);
              }}
            >
              <span className="sd-about__process-id">{sd_point.id}</span>
              <span className="sd-about__process-title">{sd_point.title}</span>
              <span className="sd-about__process-line" aria-hidden />
            </button>
          ))}
        </div>
        <div className="sd-about__process-right">
          <p ref={sd_textRef}>{sd_currentPoint.text}</p>
        </div>
      </section>

      <section className="sd-about__vision sd-about__section">
        <div className="sd-about__vision-left">
          <p>
            Лучшие материалы, выверенная до миллиметра эргономика и прайс, который позволяет тебе
            собирать собственный гардероб из смелых стейтмент-вещей, а не копить на один аксессуар
            годами.
          </p>
          <a className="sd-about__vision-actions" href="/#catalog">
            <span className="sd-about__vision-button">
              каталог
            </span>
            <span className="sd-about__vision-arrow" aria-hidden>
              <svg
                className="sd-about__vision-arrow-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 10H16M16 10L11.5 5.5M16 10L11.5 14.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
          <div className="sd-about__vision-photo sd-about__vision-photo--small">
            <img src="/about/about201.jpg" alt="Коллекция ZET" loading="lazy" />
          </div>
        </div>
        <div className="sd-about__vision-right">
          <div className="sd-about__vision-photo sd-about__vision-photo--large">
            <img src="/about/about202.jpg" alt="Витрина ZET" loading="lazy" />
          </div>
        </div>
      </section>
    </section>
  );
};
