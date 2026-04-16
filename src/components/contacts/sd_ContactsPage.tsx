import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./sd_ContactsPage.css";

const sd_contactCards = [
  {
    title: "шоурум",
    lines: ["Москва, Большая Дмитровка, 18с2", "ежедневно: 11:00-21:00"],
    links: [] as Array<{ label: string; href: string }>
  },
  {
    title: "связь",
    lines: [],
    links: [
      { label: "+7 (495) 123-45-67", href: "tel:+74951234567" },
      { label: "hello@hush-zet.ru", href: "mailto:hello@hush-zet.ru" }
    ]
  },
  {
    title: "соцсети",
    lines: [],
    links: [
      { label: "instagram / @hush.zet", href: "#" },
      { label: "telegram / @hushzet", href: "#" },
      { label: "vk / hushzet", href: "#" }
    ]
  }
];

export const SdContactsPage = (): JSX.Element => {
  const sd_ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sd_root = sd_ref.current;
    if (!sd_root) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sd_prefersReducedMotion) {
      return;
    }

    const sd_ctx = gsap.context(() => {
      gsap.fromTo(
        ".sd_contacts__hero > *",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform"
        }
      );

      gsap.fromTo(
        ".sd_contacts__grid > *",
        { y: 34, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.78,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform"
        }
      );
    }, sd_root);

    return () => {
      sd_ctx.revert();
    };
  }, []);

  return (
    <section className="sd_contacts" ref={sd_ref}>
      <header className="sd_contacts__hero">
        <h1>контакты</h1>
        <p>
          Мы на связи каждый день. Отвечаем быстро и по делу: заказ, доставка, подбор модели и консультации по
          стилизации.
        </p>
      </header>

      <div className="sd_contacts__grid">
        {sd_contactCards.map((sd_card) => (
          <article className="sd_contacts__card" key={sd_card.title}>
            <h2>{sd_card.title}</h2>
            {sd_card.lines.map((sd_line) => (
              <p key={sd_line}>{sd_line}</p>
            ))}
            {sd_card.links.map((sd_link) => (
              <a href={sd_link.href} key={sd_link.label}>
                {sd_link.label}
              </a>
            ))}
          </article>
        ))}

        <article className="sd_contacts__card sd_contacts__card--cta">
          <h2>нужна помощь со стилем</h2>
          <p>
            Напишите нам, и стилист бренда соберет подборку под ваш гардероб, настроение и ближайшие события.
          </p>
          <a href="mailto:style@hush-zet.ru">написать стилисту</a>
        </article>
      </div>
    </section>
  );
};
