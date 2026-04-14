
import { SdHeroBagViewer } from "./sd_HeroBagViewer.tsx";
import "./sd_HeroSection.css";

export const SdHeroSection = ({ onCheckoutOpen }) => (
  <section className="sd_hero">
    <div className="sd_hero__background_glow" />
    <div className="sd_hero__marquee">
      <div className="sd_hero__marquee_track">
        {Array(10).fill("FUTURISM IN EVERY FOLD ").map((t, i) => <span key={i} className="sd_hero__marquee_text">{t}</span>)}
      </div>
    </div>
    <div className="sd_hero__bag_container">
      <SdHeroBagViewer frameCount={240} durationMs={8000} frameDirectory="/output" framePrefix="ezgif-frame-" frameExtension="png" framePadLength={3} className="sd_hero__bag_viewer" />
    </div>
    <div className="sd_hero__info">
      <p className="sd_hero__info_text">?????? ????? hush brand ? ??? ????????? ????????? ???????????? ? ????????????.</p>
      <div className="sd_hero__actions">
        <button className="sd_hero__button_main" onClick={() => window.location.href="#catalog"}>?????? ??????</button>
        <button className="sd_hero__button_arrow" onClick={onCheckoutOpen}>?</button>
      </div>
    </div>
  </section>
);
