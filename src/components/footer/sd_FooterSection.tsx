
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_FooterSection.css";

gsap.registerPlugin(ScrollTrigger);

const sd_footerMenu = [
  { label: "\u0433\u043b\u0430\u0432\u043d\u0430\u044f", href: "/" },
  { label: "\u043e \u0431\u0440\u0435\u043d\u0434\u0435", href: "/about" },
  { label: "\u043e\u0442\u0437\u044b\u0432\u044b", href: "/reviews" },
  { label: "\u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", href: "/contacts" }
];

export const SdFooterSection = () => {
  const sd_footerRef = useRef(null);
  useEffect(() => {
    if (!sd_footerRef.current) return;
    const sd_ctx = gsap.context(() => {
        gsap.to(".sd_footer__ticker-track", { xPercent: -50, duration: 22, repeat: -1, ease: "none" });
        gsap.to(".sd_footer__orb--left", { x: 26, y: -18, scale: 1.08, duration: 5.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".sd_footer__orb--right", { x: -30, y: 20, scale: 1.1, duration: 6.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    return () => sd_ctx.revert();
  }, []);

  return (
    <footer className="sd_footer" ref={sd_footerRef}>
      <span className="sd_footer__orb sd_footer__orb--left" />
      <span className="sd_footer__orb sd_footer__orb--right" />
      <span className="sd_footer__grid" />
      <div className="sd_footer__ticker">
        <div className="sd_footer__ticker-track">
          {["HUSH FUTURE OBJECT", "CARRY ART CODE", "ZET STUDIO"].map(t => <span className="sd_footer__ticker-item" key={t}>{t}</span>)}
          {["HUSH FUTURE OBJECT", "CARRY ART CODE", "ZET STUDIO"].map(t => <span className="sd_footer__ticker-item" key={t+"-2"}>{t}</span>)}
        </div>
      </div>
      <div className="sd_footer__top"><p className="sd_footer__brand">HUSH / ZET</p><p className="sd_footer__subtitle">{"\u044d\u0441\u0442\u0435\u0442\u0438\u0447\u043d\u044b\u0435 \u0430\u043a\u0446\u0435\u0441\u0441\u0443\u0430\u0440\u044b \u0434\u043b\u044f \u0442\u0432\u043e\u0435\u0433\u043e \u0431\u0443\u0434\u0443\u0449\u0435\u0433\u043e"}</p></div>
      <div className="sd_footer__content">
        <nav className="sd_footer__column"><h3 className="sd_footer__column-title">{"\u043c\u0435\u043d\u044e"}</h3><ul className="sd_footer__list">{sd_footerMenu.map(m => <li key={m.label}><a className="sd_footer__link" href={m.href}>{m.label}</a></li>)}</ul></nav>
        <div className="sd_footer__column"><h3 className="sd_footer__column-title">{"\u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b"}</h3><ul className="sd_footer__list"><li><a className="sd_footer__link" href="https://instagram.com/hush.zet">instagram</a></li><li><a className="sd_footer__link" href="https://t.me/hushzet">telegram</a></li></ul></div>
        <div className="sd_footer__column"><h3 className="sd_footer__column-title">{"\u0441\u0435\u0440\u0432\u0438\u0441"}</h3><ul className="sd_footer__list"><li><p className="sd_footer__meta">{"\u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0430: 3-9 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0434\u043d\u0435\u0439"}</p></li></ul></div>
      </div>
      <div className="sd_footer__bottom"><p className="sd_footer__meta">{"\u00a9 2026 HUSH. \u0432\u0441\u0451 \u043f\u043e\u0434 \u043aонтролем."}</p></div>
    </footer>
  );
};
