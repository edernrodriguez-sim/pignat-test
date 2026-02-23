import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/IHM.css";
import Home from "./home";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Home />
    {/* <OnClickLabel /> */}
  </StrictMode>
);
