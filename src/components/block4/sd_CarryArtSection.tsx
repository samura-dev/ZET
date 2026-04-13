import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sd_CarryArtSection.css";

gsap.registerPlugin(ScrollTrigger);

export const SdCarryArtSection = (): JSX.Element => {
  const sd_sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sd_section = sd_sectionRef.current;

    if (!sd_section) {
      return;
    }

    const sd_prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sd_ctx = gsap.context(() => {
      if (sd_prefersReducedMotion) {
        gsap.set(".sd-carry-art__word, .sd-carry-art__tile", { autoAlpha: 1, y: 0 });
        return;
      }

      const sd_entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sd_section,
          start: "top 72%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      });

      sd_entranceTl
        .from(".sd-carry-art__word", {
          autoAlpha: 0,
          y: 62,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out"
        })
        .from(
          ".sd-carry-art__tile",
          {
            autoAlpha: 0,
            y: 58,
            clipPath: "inset(100% 0 0 0)",
            duration: 1.05,
            stagger: 0.14,
            ease: "power3.out"
          },
          "-=0.72"
        )
        .from(
          ".sd-carry-art__tile-shine",
          {
            xPercent: -120,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power2.out"
          },
          "-=0.9"
        );

      gsap.to(".sd-carry-art__tile-media", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: sd_section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.25
        }
      });

      const sd_floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: {
          duration: 3.6,
          ease: "sine.inOut"
        }
      });

      sd_floatTl
        .to(".sd-carry-art__tile--chain", { y: -10, rotation: -0.8 }, 0)
        .to(".sd-carry-art__tile--liquid", { y: -16, rotation: 0.8 }, 0)
        .to(".sd-carry-art__tile--fur", { y: -12, rotation: -0.6 }, 0);
    }, sd_section);

    return () => {
      sd_ctx.revert();
    };
  }, []);

  return (
    <section className="sd-carry-art" ref={sd_sectionRef} aria-label="Art you can carry">
      <div className="sd-carry-art__grid">
        <h2 className="sd-carry-art__headline" aria-label="art you can carry">
          <span className="sd-carry-art__word">art</span>
          <span className="sd-carry-art__word">you</span>
          <span className="sd-carry-art__word">can</span>
          <span className="sd-carry-art__word">carry</span>
        </h2>

        <article className="sd-carry-art__tile sd-carry-art__tile--chain" aria-label="Металлическая цепь">
          <div className="sd-carry-art__tile-media">
            <img
              className="sd-carry-art__tile-image"
              src="/block4/Rectangle%202527.jpg"
              alt="Арт-текстура: хромированный объект"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="sd-carry-art__tile-shine" aria-hidden />
        </article>

        <article className="sd-carry-art__tile sd-carry-art__tile--liquid" aria-label="Жидкий металл">
          <div className="sd-carry-art__tile-media">
            <img
              className="sd-carry-art__tile-image"
              src="/block4/Rectangle%202526.jpg"
              alt="Арт-текстура: жидкий металл"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="sd-carry-art__tile-shine" aria-hidden />
        </article>

        <article className="sd-carry-art__tile sd-carry-art__tile--fur" aria-label="Текстура меха">
          <div className="sd-carry-art__tile-media">
            <img
              className="sd-carry-art__tile-image"
              src="/block4/Rectangle%202525.jpg"
              alt="Арт-текстура: розовый мех"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="sd-carry-art__tile-shine" aria-hidden />
        </article>
      </div>
    </section>
  );
};
