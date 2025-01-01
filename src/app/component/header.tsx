"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsSignedIn(!!token);
    setLoading(false); // Set loading to false after checking the token
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
    router.push("/auth/signin");
  };

  // Don't render the sign-in/sign-up buttons while loading
  if (loading) {
    return null; // You could also return a loading spinner here
  }

  return (
    <header className="w-full bg-transparent shadow-none">
      <div className="flex justify-between items-center px-32 mt-8">
        {/* Logo */}
        <h1
          className="text-[#AC7575] text-2xl font-bold font-sans cursor-pointer"
          onClick={() => router.push("/")}
        >
          OpenCV
        </h1>

        {/* Navigation Links */}
        <nav className="flex gap-14 ml-20 pt-8 pb-10">
          {["Home", "Recommend", "Job", "About Us"].map((text, index) => (
            <button
              key={index}
              className="relative text-[#15143966] text-[16px] font-medium after:content-[''] after:absolute after:left-[-6px] after:right-[-6px] after:bottom-[-3px] after:h-[3px] after:bg-[#AC7575] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              onClick={() => router.push(`/${text.toLowerCase()}`)}
            >
              {text}
            </button>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="relative flex items-center">
          {isSignedIn ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {/* Avatar Circle */}
              <div
                className="right-20 w-10 h-10 bg-[#AC75754D] rounded-full flex items-center justify-center text-white font-medium border-2 border-gray-300"
                style={{
                  marginRight: "12px", // Move avatar slightly to the left
                  fontFamily: "sans-serif", // Match font family
                  fontSize: "14px", // Match font size
                }}
              >
                U
              </div>
              {/* Dropdown Icon */}
              <div className="text-gray-400 text-[14px] font-medium">
                &#x25BC;
              </div>
            </div>
          ) : (
            <div className="flex gap-1">
              <button
                className="w-24 h-10 text-[#15143966] font-medium text-[14px] border-none rounded-full hover:bg-gray-100 transition-all"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </button>
              <button
                className="w-24 h-10 font-medium text-[14px] text-white bg-[#AC7575] rounded-full hover:bg-opacity-90 transition-all"
                onClick={() => router.push("/auth/signup")}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Dropdown Menu */}
          {showDropdown && isSignedIn && (
            <div
              ref={dropdownRef}
              className="absolute right-1/2 translate-x-1/2 mt-48 w-48 bg-white border border-gray-200 rounded-md shadow-md z-10"
            >
              <ul className="text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#15143966]"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer  text-[#15143966]"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </li>
                <li
                  className="px-4 py-2 text-[#AC7575] hover:bg-gray-100 cursor-pointer"
                  onClick={handleSignOut}
                >
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
