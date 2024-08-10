import { Link } from "react-router-dom";
import { useUser } from "../userContext";
import { useTheme } from "../themeContext"; // Import ThemeContext
import { FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/logo.png"; // Light mode logo
import logoDark from "../assets/LogoDark.png"; // Dark mode logo
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function from context

  const navigate = useNavigate();
  const { isLoggedIn, logout } = useUser();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {
    const response = await fetch("http://localhost:3000/api/v1/users/logout", {
      method: "GET",
    });
    if (response.ok) {
      await logout();

      navigate("/");
    } else {
      alert("Logout failed. Please try again.");
    }
  };
  return (
    <nav
      className={`${
        theme === "light"
          ? "bg-white text-gray-900 shadow-md"
          : "bg-gray-800 text-gray-100 shadow-md"
      } sticky top-0 z-50`}
    >
      <div className="mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-semibold flex items-center space-x-2"
          >
            {/* Conditional Logo Rendering */}
            <img
              src={theme === "light" ? logoDark : logo}
              alt="Logo"
              className="h-10 w-auto"
            />
            <span className="ml-4">Hackex</span>
          </Link>
        </div>
        <div className="flex items-center justify-around space-x-12">
          <Link
            to="/problems"
            className="text-md hover:text-blue-400 transition duration-300"
          >
            Problems
          </Link>
          <Link
            to="/leaderboard"
            className="text-lg hover:text-blue-400 transition duration-300"
          >
            Leaderboard
          </Link>
          <Link
            to="/playground"
            className="text-md hover:text-blue-400 transition duration-300"
          >
            Playground
          </Link>
          <Link
            to="/submit"
            className="text-md hover:text-blue-400 transition duration-300"
          >
            Submit Problem
          </Link>
          <div className="ml-6 flex items-center space-x-4">
            {/* Theme toggle icon */}
            <button
              onClick={toggleTheme}
              className={`text-lg focus:outline-none transition duration-300 ${
                theme === "light" ? "text-gray-900" : "text-gray-100"
              }`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                Login/Register
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
                  aria-label="User Menu"
                >
                  <FaPowerOff className="text-xl" />
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 bg-gray-700 text-gray-100 rounded-lg shadow-lg w-40"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-blue-500"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link to="/home">
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-blue-500"
                      >
                        Logout
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
