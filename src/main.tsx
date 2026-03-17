import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/IHM.css";
import Home from "./home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestPage from "./testPage";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/testPage" element={<TestPage />} />
    </Routes>
      {/* <Home /> */}
    </BrowserRouter>
    {/* <OnClickLabel /> */}
  </StrictMode>
);
