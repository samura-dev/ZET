
import { useState, useMemo, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { sd_formatPrice, sd_getProductsByCategory, sd_products } from "../../data/sd_products";
import { sd_useCartStore } from "../../store/sd_useCartStore";
import "./sd_CatalogSection.css";

export const SdCatalogSection = () => {
    const [activeTab, setActiveTab] = useState("new");
    const addItem = sd_useCartStore(s => s.sd_addItem);
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

    const filtered = useMemo(() => sd_getProductsByCategory(activeTab as any), [activeTab]);

    return (
        <section className="sd_catalog" id="catalog">
            <div className="sd_catalog__tabs">
                {["bloggers", "new", "best"].map(t => (
                    <button key={t} className={activeTab === t ? "sd_catalog__tab sd_catalog__tab--active" : "sd_catalog__tab"} onClick={() => setActiveTab(t)}>
                        {t === "bloggers" ? "????? ????????" : t === "new" ? "???????" : "???????????"}
                    </button>
                ))}
            </div>
            <div className="sd_catalog__slider" ref={emblaRef}>
                <div className="sd_catalog__track">
                    {filtered.map(p => (
                        <div key={p.id} className="sd_catalog__slide">
                            <article className="sd_catalog__card">
                                <img src={p.images[0]} alt="" />
                                <div className="sd_catalog__card-footer">
                                    <div className="sd_catalog__card-meta">
                                        <h3>{p.title}</h3>
                                        <p>{sd_formatPrice(p.price)}</p>
                                    </div>
                                    <button onClick={() => addItem(p)} className="sd_catalog__card-add-btn">+</button>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
