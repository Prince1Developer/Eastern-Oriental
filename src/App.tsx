/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authApi, TokenManager, ApiError } from './api';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Reservations from './pages/Reservations';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(TokenManager.isAuthenticated());

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Still clear tokens even if logout API fails
      TokenManager.clearTokens();
    }
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      {/* Public Pages with Layout */}
      <Route element={<Layout onLogout={handleLogout} />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/reservations" element={<Reservations />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

      {/* Admin Page */}
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <Admin onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}
