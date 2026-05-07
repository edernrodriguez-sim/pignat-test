import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/rules.css";
import "./styles/avatar.css";
import "./styles/IHM.css";
import "./styles/dropdown.css";
import Home from "./home";
import { BrowserRouter, Route, Routes } from "react-router-dom";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/pignat-test">
      <Routes>
        {/* <Route path="/" element={<AppExercice />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
      {/* <Home /> */}
    </BrowserRouter>
    {/* <OnClickLabel /> */}
  </StrictMode>
);
