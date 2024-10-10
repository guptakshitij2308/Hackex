/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../themeContext"; // Import ThemeContext

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access theme from context

  const handleSignup = async () => {
    try {
      const response = await fetch(
        "https://hackex.onrender.com/api/v1/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (response.ok) {
        navigate("/login");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-8 ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
          theme === "light"
            ? "bg-gray-50 border border-gray-300"
            : "bg-gray-800 border border-gray-700"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Signup</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full p-3 mb-4 rounded-lg border-2 ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-400"
              : "bg-gray-700 text-white border-gray-600"
          } focus:outline-none focus:border-blue-500`}
          placeholder="Username"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 mb-4 rounded-lg border-2 ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-400"
              : "bg-gray-700 text-white border-gray-600"
          } focus:outline-none focus:border-blue-500`}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 mb-4 rounded-lg border-2 ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-400"
              : "bg-gray-700 text-white border-gray-600"
          } focus:outline-none focus:border-blue-500`}
          placeholder="Password"
        />

        <button
          onClick={handleSignup}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition w-full ${
            theme === "light" ? "hover:bg-blue-600" : "hover:bg-blue-700"
          }`}
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className={`text-blue-400 hover:underline ${
              theme === "light" ? "hover:text-blue-500" : "hover:text-blue-300"
            }`}
          >
            <p className="">Already have an account?</p>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
