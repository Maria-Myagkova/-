import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import SectionPage from "./pages/SectionPage";
import AboutPage from "./pages/AboutPage";
import MythsPage from "./pages/MythsPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sections/:slug" element={<SectionPage />} />
        <Route path="/section/:slug" element={<SectionPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/myths" element={<MythsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
