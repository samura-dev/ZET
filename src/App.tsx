import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SdHeroSection } from "./components/hero/sd_HeroSection";
import { SdCatalogSection } from "./components/catalog/sd_CatalogSection";
import { SdBlockThreeSection } from "./components/block3/sd_BlockThreeSection";
import { SdCarryArtSection } from "./components/block4/sd_CarryArtSection";
import { SdCheckoutSection } from "./components/checkout/sd_CheckoutSection";
import { SdFooterSection } from "./components/footer/sd_FooterSection";
import { SdProductPage } from "./components/product/sd_ProductPage";
import { SdGlobalHeader } from "./components/shared/sd_GlobalHeader";
import { SdAboutPage } from "./components/about/sd_AboutPage";
import { SdContactsPage } from "./components/contacts/sd_ContactsPage";
import { SdReviewsPage } from "./components/reviews/sd_ReviewsPage";

gsap.registerPlugin(ScrollTrigger);

const App = (): JSX.Element => {
  const [sd_pathname, sd_setPathname] = useState<string>(window.location.pathname);

  useEffect(() => {
    const sd_handlePopState = (): void => {
      sd_setPathname(window.location.pathname);
    };

    const sd_handleDocumentClick = (sd_event: MouseEvent): void => {
      const sd_target = sd_event.target as HTMLElement | null;
      const sd_anchor = sd_target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!sd_anchor) {
        return;
      }

      const sd_href = sd_anchor.getAttribute("href");

      if (!sd_href || !sd_href.startsWith("/")) {
        return;
      }

      if (sd_event.metaKey || sd_event.ctrlKey || sd_event.shiftKey || sd_event.altKey) {
        return;
      }

      sd_event.preventDefault();
      sd_navigate(sd_href);
    };

    window.addEventListener("popstate", sd_handlePopState);
    document.addEventListener("click", sd_handleDocumentClick);
    return () => {
      window.removeEventListener("popstate", sd_handlePopState);
      document.removeEventListener("click", sd_handleDocumentClick);
    };
  }, []);

  const sd_navigate = (sd_path: string): void => {
    if (window.location.pathname === sd_path) {
      return;
    }

    ScrollTrigger.getAll().forEach((sd_trigger) => {
      sd_trigger.kill(true);
    });
    gsap.killTweensOf("*");

    window.history.pushState({}, "", sd_path);
    sd_setPathname(sd_path);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  if (sd_pathname === "/checkout") {
    return (
      <>
        <SdGlobalHeader />
        <SdCheckoutSection
          onBackHome={() => {
            sd_navigate("/");
          }}
        />
        <SdFooterSection />
      </>
    );
  }

  if (sd_pathname.startsWith("/product/")) {
    const sd_slug = decodeURIComponent(sd_pathname.replace("/product/", "").trim());

    return (
      <>
        <SdGlobalHeader />
        <SdProductPage
          slug={sd_slug}
          onBackHome={() => {
            sd_navigate("/");
          }}
          onOpenCheckout={() => {
            sd_navigate("/checkout");
          }}
        />
        <SdFooterSection />
      </>
    );
  }

  if (sd_pathname === "/about") {
    return (
      <>
        <SdGlobalHeader />
        <SdAboutPage />
        <SdFooterSection />
      </>
    );
  }

  if (sd_pathname === "/contacts") {
    return (
      <>
        <SdGlobalHeader />
        <SdContactsPage />
        <SdFooterSection />
      </>
    );
  }

  if (sd_pathname === "/reviews") {
    return (
      <>
        <SdGlobalHeader />
        <SdReviewsPage />
        <SdFooterSection />
      </>
    );
  }

  return (
    <>
      <SdHeroSection
        onCheckoutOpen={() => {
          sd_navigate("/checkout");
        }}
      />
      <SdCatalogSection />
      <SdBlockThreeSection />
      <SdCarryArtSection />
      <SdFooterSection />
    </>
  );
};

export default App;
