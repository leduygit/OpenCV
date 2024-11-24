"use client"
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import JobSearchSection from "../../component/jobSection";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setMessage("Password reset email sent. Please check your inbox.");
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
            Forgot password
          </h2>
          

          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#0B1344] py-2">E - MAIL</label>
              <input
                name="email"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-4/5 mt-1 px-3 py-3 border-2 border-[#EBEAED] rounded-[25px] focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-bold"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="mt-3 items-center py-3 px-4 bg-[#AC7575] text-white font-medium rounded-full shadow-md hover:bg-[#AC7575] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
            >
              Send Reset Email
            </button>
          </form>

        </div>

      </div>

      <JobSearchSection /> {/* Use the new component here */}

    </div>

    
      
    
  );
};

export default ForgotPasswordPage;