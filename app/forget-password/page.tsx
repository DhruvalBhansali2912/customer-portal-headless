"use client";

import React, { useState,useEffect  } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/header";

export default function ForgetPasswordPage() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");
    const [useremail, setUseremail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
     


  const handleforgetpassword = async (e: React.FormEvent) => {
  var token = localStorage.getItem("token");
  var userEmail = localStorage.getItem("valid_user_email");

 
  e.preventDefault();
  setErrorMsg("");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/forgetpassword`,
      {
        email: useremail,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if(response.data.success){
      setSuccessMessage(response.data.message);
     
    }

  } catch (error: any) {
    console.error("Login Error:", error);
    setErrorMsg("Invalid credentials. Please try again.");
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] justify-end">
         <div className="relative bg-[#f7f8fc] flex flex-col justify-center overflow-hidden">
      {/* Background logos (as in previous code)... */}

	<img
        src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/04/Group-4.png`}
        alt="Decorative top left"
        className="absolute top-0 left-0 w-[30%] h-[80%] pointer-events-none"
      />
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/04/logo-relayback.png`}
        alt="Decorative bottom right"
        className="absolute bottom-0 right-0 w-[50%] h-[90%] pointer-events-none"
      />

      <div className="flex-grow flex items-center justify-center z-10 sm:p-0 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center m-12">
          <h2 className="text-4xl font-bold text-[#190089] mb-6">Forget Password</h2>

          <form onSubmit={handleforgetpassword} className="space-y-4 text-left">
            <div>
              <label htmlFor="useremail" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-full px-3 py-2 bg-[#F6F6F6]">
                <span className="text-gray-500 mr-2">📧</span>
                <input
                  type="email"
                  id="useremail"
                  name="useremail"
                  required
                  value={useremail}
                  onChange={(e) => {
                    setUseremail(e.target.value);
                  }}
                  className="w-full outline-none bg-transparent text-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="text-right">
              <a href="/dashboard" className="text-sm text-[#4C00C2] hover:underline">Back to Dashboard</a>
            </div>
            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            {successMessage && (
              <p className="text-green-500 text-sm text-center">{successMessage}</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="lg:w-[60%] bg-[#462EFC] text-white font-semibold py-2 px-4 rounded-full cursor-pointer"
              >
                Get Password Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}