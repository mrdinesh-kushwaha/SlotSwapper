import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Requests from './components/Requests';
import { AuthProvider } from './hooks/useAuth';

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/">Dashboard</Link> | <Link to="/market">Marketplace</Link> | <Link to="/requests">Requests</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/market" element={<Marketplace/>} />
          <Route path="/requests" element={<Requests/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
