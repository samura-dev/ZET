
import { sd_useCartStore } from "../../store/sd_useCartStore";
import "./sd_GlobalHeader.css";

export const SdGlobalHeader = () => {
  const itemsCount = sd_useCartStore(s => s.sd_getTotalItems());
  return (
    <header className="sd_header">
      <div className="sd_header__logo">ZET</div>
      <nav className="sd_header__nav">
        <a href="/">???????</a>
        <a href="/about">? ??????</a>
      </nav>
      <div className="sd_header__actions">
        <div className="sd_header__cart-icon">?? <span className="sd_header__cart-count">{itemsCount}</span></div>
      </div>
    </header>
  );
};
