// pages/index.js

//import Image from "next/image";
// import "./style.css";
import React from 'react';
import { FaFacebookSquare, FaTwitter, FaGooglePlusG } from "react-icons/fa";

export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="flex max-w-4xl w-full bg-white rounded-xl">
        {/* Cột bên trái chứa hình ảnh */}
        
        {/* Cột bên phải chứa form đăng ký */}
        <div className="md:w-1/2 w-full space-y-8 p-10">
          <h2 className="text-4xl font-bold text-[#0B1344]">
            Create an Account
          </h2>
          <p className="text-[#15143966] text-[16px] font-sans">
            By signing up, you agree to the Terms of Service.
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0B1344] py-2">E - MAIL</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-[20px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0B1344] py-2">PASSWORD</label>
              <div className="flex space-x-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-3 border border-gray-300 rounded-[20px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                />
                <input
                  type="password"
                  placeholder="Repeat"
                  className="w-full px-3 py-3 border border-gray-300 rounded-[20px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#AC7575] text-white font-medium rounded-full shadow-md hover:bg-[#AC7575] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
              >
                Sign Up
              </button>

              <div className="flex items-center space-x-2 px-3">
                <span className="text-gray-500">OR</span>
              </div>

              <button className="text-gray-400 px-3 hover:text-gray-600">
                <FaFacebookSquare />
              </button>
              <button className="text-gray-400 px-3 hover:text-gray-600">
                <FaTwitter />
              </button>
              <button className="text-gray-400 px-3 hover:text-gray-600">
                <FaGooglePlusG />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
