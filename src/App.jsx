// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SoberDate from "./pages/SoberDate.jsx";
import AddGratitude from "./pages/AddGratitude.jsx";
import Gratitudes from "./pages/Gratitudes.jsx";
import Chips from "./pages/chips.jsx";
import MyWhy from "./pages/MyWhy.jsx";
import JFT from "./pages/JFT.jsx";
import Admin from "./pages/Admin.jsx";
import BossAccess from "./pages/BossAccess.jsx";
import Login from "./pages/Login.jsx";
import Debug from "./pages/Debug.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
                <Route path="/login" element={<Login />} />
                  <Route path="/debug" element={<Debug />} />      
        <Route path="/" element={<Home />} />
        <Route path="/sober-date" element={<SoberDate />} />
        <Route path="/gratitudes/new" element={<AddGratitude />} />
        <Route path="/gratitudes" element={<Gratitudes />} />
        <Route path="/chips" element={<Chips />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/boss" element={<BossAccess />} />
        <Route path="/my-why" element={<MyWhy />} />
                <Route path="/jft" element={<JFT />} />

      </Routes>
    </BrowserRouter>
  );
}
