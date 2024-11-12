"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

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
        <nav className="flex gap-14 ml-20 p-8">
          {["Home", "About", "Contact", "Blog"].map((text, index) => (
            <button
              key={index}
              className="relative text-[#15143966] text-[16px] font-medium after:content-[''] after:absolute after:left-[-6px] after:right-[-6px] after:bottom-[-3px] after:h-[3px] after:bg-[#AC7575] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              onClick={() => router.push(`/${text.toLowerCase()}`)}
            >
              {text}
            </button>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <button
            className="w-24 h-10 text-[#15143966] font-medium border-none rounded-full hover:bg-gray-100 transition-all"
            onClick={() => router.push("/auth/signin")}
          >
            Sign In
          </button>
          <button
            className="w-24 h-10 font-medium text-white bg-[#AC7575] rounded-full hover:bg-opacity-90 transition-all"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
