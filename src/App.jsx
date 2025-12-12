// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SoberDate from "./pages/SoberDate.jsx";
import AddGratitude from "./pages/AddGratitude.jsx";
import Gratitudes from "./pages/Gratitudes.jsx";
import Chips from "./pages/Chips.jsx";
import MyWhy from "./pages/MyWhy.jsx";
import JFT from "./pages/JFT.jsx";
import Admin from "./pages/Admin.jsx";
import BossAccess from "./pages/BossAccess.jsx";
import Login from "./pages/Login.jsx";
import Debug from "./pages/Debug.jsx";

// 👇 nuevas páginas
import ToolsPage from "./pages/Tools.jsx";
import GroupPage from "./pages/Group.jsx";
import MePage from "./pages/Me.jsx";

/**
 * Redirects to /login if the user doesn't have a local profile.
 */
function RequireProfile({ children }) {
  const hasProfile = localStorage.getItem("na_userProfile");
  const memberId = localStorage.getItem("na_memberId");

  // If BOTH profile and memberId are missing → new user → force login
  if (!hasProfile && !memberId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/debug" element={<Debug />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireProfile>
              <Home />
            </RequireProfile>
          }
        />

        <Route
          path="/sober-date"
          element={
            <RequireProfile>
              <SoberDate />
            </RequireProfile>
          }
        />

        <Route
          path="/gratitudes/new"
          element={
            <RequireProfile>
              <AddGratitude />
            </RequireProfile>
          }
        />

        <Route
          path="/gratitudes"
          element={
            <RequireProfile>
              <Gratitudes />
            </RequireProfile>
          }
        />

        <Route
          path="/chips"
          element={
            <RequireProfile>
              <Chips />
            </RequireProfile>
          }
        />

        <Route
          path="/my-why"
          element={
            <RequireProfile>
              <MyWhy />
            </RequireProfile>
          }
        />

        <Route
          path="/jft"
          element={
            <RequireProfile>
              <JFT />
            </RequireProfile>
          }
        />

        {/* 👇 nuevas rutas del bottom nav */}
        <Route
          path="/tools"
          element={
            <RequireProfile>
              <ToolsPage />
            </RequireProfile>
          }
        />

        <Route
          path="/group"
          element={
            <RequireProfile>
              <GroupPage />
            </RequireProfile>
          }
        />

        <Route
          path="/me"
          element={
            <RequireProfile>
              <MePage />
            </RequireProfile>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireProfile>
              <Admin />
            </RequireProfile>
          }
        />

        <Route
          path="/boss"
          element={
            <RequireProfile>
              <BossAccess />
            </RequireProfile>
          }
        />

        {/* Aliases & fallbacks */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
