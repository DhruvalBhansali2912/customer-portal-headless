"use client";

import React, { useState,useEffect  } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/header";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([0,'Select a Company']);
    const [successMessage, setSuccessMessage] = useState("");
    const [options, setOptions] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust key if needed

    if (!token) {
      router.push("/");
    }
    else{
      try {
        // Decode JWT token
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        // Check for expiration
        const currentTime = Math.floor(Date.now() / 1000); // in seconds
        if (decodedPayload.exp && decodedPayload.exp < currentTime) {
          console.log("Token expired");
          localStorage.removeItem("token");
          router.push("/");
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("token");
        router.push("/");
      }
    }

    const fetchCompanies = async () => {
   try {
      var token = localStorage.getItem("token");
      var userEmail = localStorage.getItem("valid_user_email");
      var response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/getcompanies`, {
       headers: {
              Authorization: `Bearer ${token}`,
              authemail: `Bearer ${userEmail}`,
            },
      });
      if(response.data.success){
        setOptions(response.data.message);
      }
      
    } catch (error) {
      console.error("Error fetching companies", error);
      router.push("/");
    }
  }

  fetchCompanies();
  }, [router]);

    const handleRegister = async (e: React.FormEvent) => {
      var token = localStorage.getItem("token");
      var userEmail = localStorage.getItem("valid_user_email");
  e.preventDefault();
  setErrorMsg("");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/register`,
      {
        email: email,
        company: selectedCategory[0],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          authemail: `Bearer ${userEmail}`,
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
          <h2 className="text-4xl font-bold text-[#190089] mb-6">Register page</h2>

          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Company Name</label>
            <div className="relative">
        <button
        type="button"
          onClick={() => setCategoryDropdownOpen((prev) => !prev)}
          className="flex items-center justify-between w-full border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <span>{selectedCategory[1]}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              categoryDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {categoryDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(option);
                  setCategoryDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              >
                {option[1]}
              </div>
            ))}
          </div>
        )}
      </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-full px-3 py-2 bg-[#F6F6F6]">
                <span className="text-gray-500 mr-2">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none bg-transparent text-black"
                  placeholder="Email"
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
                className="lg:w-[60%] bg-[#462EFC] text-white font-semibold py-2 px-4 rounded-full cursor-pointer">
                Send Registration Link
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