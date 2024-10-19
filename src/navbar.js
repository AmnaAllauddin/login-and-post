 // Navbar.js
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './home';
import About from './about';
import Contact from './contact';
import React, { useState, useEffect } from 'react';
import LoginForm from './form'; // Import the LoginForm component
import { auth } from "./configration/firebase"; 
import { signOut } from "firebase/auth"; 

function Navbar() {
  const [user, setUser] = useState(null); // Manage user state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Clear user state on logout
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <Router>
      <nav className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {user && user.photoURL && (
            <img
              src={user.photoURL}
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
          )}
          {user && (
            <span className="text-gray-700 font-semibold">{user.displayName}</span>
          )}
        </div>

        <ul className="flex space-x-8 text-center">
          <li>
            <Link to="/" className="text-gray-700 hover:text-gray-900 no-underline">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 no-underline">About</Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 no-underline">Contact</Link>
          </li>
        </ul>

        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded">
              Logout
            </button>
          ) : null}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginForm />} /> {/* Route for login */}
      </Routes>
    </Router>
  );
}

export default Navbar;
