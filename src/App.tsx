import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddFile from './pages/AddFile';
import TrackFile from './pages/TrackFile';
import ScanQR from './pages/ScanQR';
import History from './pages/History';

import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-file" element={<AddFile />} />
          <Route path="/track-file" element={<TrackFile />} />
          <Route path="/scan-qr" element={<ScanQR />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
