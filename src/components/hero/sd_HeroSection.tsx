import { SdHeroBagViewer } from "./sd_HeroBagViewer";
import "./sd_HeroSection.css";

const sd_MARQUEE_TEXT = "FUTURISM IN EVERY FOLD";

const sd_marqueeItems: string[] = [
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT,
  sd_MARQUEE_TEXT
];

type sd_HeroSectionProps = {
  onCheckoutOpen?: () => void;
};

export const SdHeroSection = ({ onCheckoutOpen }: sd_HeroSectionProps): JSX.Element => {
  return (
    <section className="sd_hero" aria-label="Главный экран HUSH">
      <div className="sd_hero__background_glow" aria-hidden="true" />

      {/* Хедер удален, так как теперь используется SdGlobalHeader */}

      <div className="sd_hero__marquee" aria-hidden>
        <div className="sd_hero__marquee_track">
          {sd_marqueeItems.map((sd_item, sd_index) => (
            <span className="sd_hero__marquee_text" key={`sd_marquee_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
        <div className="sd_hero__marquee_track" aria-hidden>
          {sd_marqueeItems.map((sd_item, sd_index) => (
            <span className="sd_hero__marquee_text" key={`sd_marquee_copy_${sd_index}`}>
              {sd_item}
            </span>
          ))}
        </div>
      </div>

      <div className="sd_hero__bag_container">
        <SdHeroBagViewer
          frameCount={240}
          durationMs={8000}
          frameDirectory="/output"
          framePrefix="ezgif-frame-"
          frameExtension="png"
          framePadLength={3}
          className="sd_hero__bag_viewer"
        />
      </div>

      <div className="sd_hero__info">
        <p className="sd_hero__info_text">
          each hush brand bag is the perfect combination of creativity and practicality.
        </p>
        <div className="sd_hero__actions">
          <a className="sd_hero__button_main" href="/about">
            <span className="sd_hero__button_main_text">узнать больше</span>
          </a>
          <button 
            className="sd_hero__button_arrow" 
            type="button" 
            aria-label="Открыть корзину"
            onClick={onCheckoutOpen}
          >
            <svg
              className="sd_hero__button_arrow_icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M5 12H18.5M18.5 12L13 6.5M18.5 12L13 17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
