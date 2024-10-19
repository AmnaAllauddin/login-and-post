import React, { useState, useEffect } from 'react';
import { auth } from "./configration/firebase"; 
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; 
import "./configration/index.css";  

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // Google sign-in
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log(result.user);
        navigate('/'); // Redirect to home after login
      })
      .catch((error) => {
        console.error("Authentication error:", error);
      });
  };

  // Email/Password sign-in
  const signInWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUser(result.user);
        console.log(result.user);
        navigate('/'); // Redirect to home after login
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed. Please check your credentials.");
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate('/'); // Redirect to home if already logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white border border-black shadow-lg p-6 rounded-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        {/* Email and Password Login Form */}
        <form onSubmit={signInWithEmail} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="text-center mb-4">
          <span className="text-gray-500">or</span>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
