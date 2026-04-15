
import { SdHeroBagViewer } from "./sd_HeroBagViewer";
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
      <p className="sd_hero__info_text">{"\u043a\u0430\u0436\u0434\u0430\u044f \u0441\u0443\u043c\u043a\u0430 hush brand \u2014 \u044d\u0442\u043e \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e\u0435 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0435 \u043a\u0440\u0435\u0430\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0438 \u0438 \u043f\u0440\u0430\u043a\u0442\u0438\u0447\u043d\u043e\u0441\u0442\u0438."}</p>
      <div className="sd_hero__actions">
        <button className="sd_hero__button_main" onClick={() => window.location.href="#catalog"}>{"\u043a\u0443\u043f\u0438\u0442\u044c \u0441\u0435\u0439\u0447\u0430\u0441"}</button>
        <button className="sd_hero__button_arrow" onClick={onCheckoutOpen}>?</button>
      </div>
    </div>
  </section>
);
