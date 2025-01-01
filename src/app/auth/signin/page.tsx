// pages/index.js
"use client";
import Image from "next/image";
import "./style.css";
import React from "react";
import { useState } from "react";
import { FaFacebookSquare, FaTwitter, FaGooglePlusG } from "react-icons/fa";
import JobSearchSection from "../../component/jobSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signin() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="flex max-w-6xl w-full bg-white rounded-xl">
        {/* Cột bên trái chứa hình ảnh */}
        <Image
          src="/images/sign-in.png"
          alt="Picture of the author"
          width={500}
          height={500}
          className="object-cover"
        />

        {/* Cột bên phải chứa form đăng ký */}
        <div className="md:w-1/2 w-full space-y-8 p-10 ml-8">
          <h2 className="mt-4 text-4xl font-semibold text-[#0B1344] ">
            Signing in
          </h2>
          <p className="text-[#15143966] text-[16px] font-sans">
            By signing up, you agree to the Terms of Service.
          </p>
          {message && <p>{message}</p>}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#0B1344] py-2">
                E - MAIL
              </label>
              <input
                type="text"
                name="emailOrUsername" // Add this
                value={formData.emailOrUsername} // Bind the value
                onChange={handleChange} // Attach the handler
                placeholder="Your email"
                className="w-4/5 mt-1 px-3 py-3 border-2 border-[#EBEAED] rounded-[25px] focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-bold"
              />
            </div>

            <div>
              <div className="flex md:w-4/5">
                <label className="block text-xs font-semibold text-[#0B1344] py-2">
                  PASSWORD
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[#AC7575] text-xs font-semibold ml-auto py-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="flex space-x-4">
                <input
                  type="password"
                  name="password" // Add this
                  value={formData.password} // Bind the value
                  onChange={handleChange} // Attach the handler
                  placeholder="Password"
                  className="w-4/5 px-3 py-3 border-2 border-[#EBEAED] rounded-[25px] focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-bold"
                />
              </div>
            </div>

            <div className="flex">
              <button
                type="submit"
                className="w-1/5 py-3 px-4 bg-[#AC7575] text-white font-medium rounded-full shadow-md hover:bg-[#AC7575] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
              >
                Sign In
              </button>

              <div className="flex items-center space-x-2 px-3">
                <span className="text-[#EBEAED] font-semibold text-xs">OR</span>
              </div>

              <button className="text-[#EBEAED] px-3 hover:text-gray-400">
                <FaFacebookSquare />
              </button>
              <button className="text-[#EBEAED] px-3 hover:text-gray-400">
                <FaTwitter />
              </button>
              <button className="text-[#EBEAED] px-3 hover:text-gray-400">
                <FaGooglePlusG />
              </button>
            </div>
          </form>
        </div>
      </div>
      <JobSearchSection /> {/* Use the new component here */}
    </div>
  );
}
