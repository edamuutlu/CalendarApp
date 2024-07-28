import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Giris from "./components/Giris/Giris";
import Kayit from "./components/Kayit/Kayit";
import Takvim from "./components/Takvim/Takvim";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Giris />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route path="/anasayfa" element={<Takvim />} />
      </Routes>
    </Router>
  );
};

export default App;
