"use client";

import React, { useState,useEffect  } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "./components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

   useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your token key
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}wp-json/jwt-auth/v1/token`,
      {
        username: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { token, user_display_name,user_email } = response.data;

    // Save token in localStorage or cookies
    localStorage.setItem("token", token);
    localStorage.setItem("valid_user_email", user_email);

    // Redirect
    router.push("/dashboard");
  } catch (error: any) {
    console.error("Login Error:", error);
    setErrorMsg("Invalid credentials. Please try again.");
  }
};

  return (
    <div className="relative min-h-screen bg-[#f7f8fc] flex flex-col justify-center overflow-hidden">
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
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center m-8">
          <h2 className="text-4xl font-bold text-[#190089] mb-6">Login page</h2>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-full px-3 py-2 bg-[#F6F6F6]">
                <span className="text-gray-500 mr-2">🔑</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none bg-transparent text-black"
                  placeholder="Password"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            <div className="text-right">
              <a href="/forget-password" className="text-sm text-[#4C00C2] hover:underline">Forgot password?</a>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="lg:w-[60%] bg-[#462EFC] text-white font-semibold py-2 px-4 rounded-full cursor-pointer"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      
      <Footer/>
    </div>
  );
}
