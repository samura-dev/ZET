import React from "react";
import ReactDOM from "react-dom/client";
import { gsap } from "gsap";
import App from "./App";
import "./styles/sd_globals.css";

// @ts-ignore
window.gsap = gsap;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
