import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/urbannest.png";

const Navbar = ({ isScrolled }) => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const topBarRef = useRef(null); // Ref to measure top bar height

  // TEMP: Set a sample user in localStorage for testing
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify({ name: "Login", role: "user" }));
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      {/* Top Bar */}
      <div
        ref={topBarRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-[#1A525E] text-white text-sm flex justify-end items-center px-6 py-2 gap-6 border-b border-gray-700 transition-transform duration-300 ease-in-out ${isScrolled ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        <div className="flex items-center gap-6 h-full">
          <span>www.urbannest.com</span>
          <div className="border-l border-gray-700 h-5"></div>
          <span>9800123445</span>
          <div className="border-l border-gray-700 h-5"></div>

          {!user ? (
            <Link
              to="/login"
              className="hover:underline hover:text-gray-200 transition-colors duration-200"
            >
              Login
            </Link>
          ) : (
            <div className="relative dropdown-wrapper">
              <button
                className="flex items-center gap-1 hover:text-gray-200 transition-colors duration-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.name || "Profile"} <FaCaretDown size={12} />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl ring-1 ring-gray-200 z-[9999]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to="/wishlist"
                    className="flex items-center px-5 py-3 hover:bg-gray-100 text-sm font-medium transition-all duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaHeart className="mr-3 text-pink-500" size={16} />
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-5 py-3 hover:bg-gray-100 text-sm font-medium text-left transition-all duration-150"
                  >
                    <FaSignOutAlt className="mr-3 text-red-500" size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`fixed left-0 right-0 bg-white shadow-md py-3 px-6 flex justify-between items-center border-b border-gray-200 z-40 transition-all duration-300 ease-in-out ${isScrolled ? "top-0" : "top-[40px]"
          }`}
      >
        {/* Logo + Title */}
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <img
            src={logo}
            alt="Urban Nest Logo"
            className="h-16 w-auto"
            style={{ borderRadius: "20%" }}
          />
          <h1 className="text-2xl font-bold text-[#1A525E] tracking-tight">
            Urban Nest
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 font-semibold text-lg">
          {user && user.role === "admin" && (
            <>
              <Link
                to="/adminDash"
                className="hover:underline text-[#1A525E] transition-colors duration-200"
              >
                Admin Dashboard
              </Link>
              <div className="border-l border-[#1A525E] h-6"></div>
            </>
          )}
          <Link
            to="/"
            className="hover:underline text-[#1A525E] transition-colors duration-200"
          >
            Home
          </Link>
          <div className="border-l border-[#1A525E] h-6"></div>
          <Link
            to="/contactus"
            className="hover:underline text-[#1A525E] transition-colors duration-200"
          >
            Contact Us
          </Link>
          <div className="border-l border-[#1A525E] h-6"></div>
          <Link
            to="/aboutus"
            className="hover:underline text-[#1A525E] transition-colors duration-200"
          >
            About Us
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;