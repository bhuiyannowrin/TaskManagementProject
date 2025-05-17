import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './layout/Layout';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn') === 'true';
    const storedUser = JSON.parse(localStorage.getItem('user'));

    setIsLoggedIn(storedLogin);
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (userData) => {
    // Example userData = { email: 'user@example.com' }
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login setUser={handleLogin} />
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Layout onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
