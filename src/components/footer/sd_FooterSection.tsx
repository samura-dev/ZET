
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_FooterSection.css";

gsap.registerPlugin(ScrollTrigger);

const sd_footerMenu = [
  { label: "???????", href: "/" },
  { label: "? ??????", href: "/about" },
  { label: "??????", href: "/reviews" },
  { label: "????????", href: "/contacts" }
];

export const SdFooterSection = () => {
  const sd_footerRef = useRef(null);
  useEffect(() => {
    if (!sd_footerRef.current) return;
    const sd_ctx = gsap.context(() => {
        gsap.to(".sd_footer__ticker-track", { xPercent: -50, duration: 22, repeat: -1, ease: "none" });
        gsap.to(".sd_footer__orb--left", { x: 26, y: -18, scale: 1.08, duration: 5.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
        // Correcting spelling orbs
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
      <div className="sd_footer__top"><p className="sd_footer__brand">HUSH / ZET</p><p className="sd_footer__subtitle">?????????? ?????????? ??? ?????? ????????</p></div>
      <div className="sd_footer__content">
        <nav className="sd_footer__column"><h3 className="sd_footer__column-title">????</h3><ul className="sd_footer__list">{sd_footerMenu.map(m => <li key={m.label}><a className="sd_footer__link" href={m.href}>{m.label}</a></li>)}</ul></nav>
        <div className="sd_footer__column"><h3 className="sd_footer__column-title">????????</h3><ul className="sd_footer__list"><li><a className="sd_footer__link" href="https://instagram.com/hush.zet">instagram</a></li><li><a className="sd_footer__link" href="https://t.me/hushzet">telegram</a></li></ul></div>
        <div className="sd_footer__column"><h3 className="sd_footer__column-title">??????</h3><ul className="sd_footer__list"><li><p className="sd_footer__meta">????????: 3-9 ??????? ????</p></li></ul></div>
      </div>
      <div className="sd_footer__bottom"><p className="sd_footer__meta">? 2026 HUSH. ??? ??? ?????????.</p></div>
    </footer>
  );
};
