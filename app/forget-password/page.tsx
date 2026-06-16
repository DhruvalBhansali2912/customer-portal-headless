"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../components/Footer";
import { isValidToken } from "../utils/auth";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [useremail, setUseremail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token && isValidToken(token)) {
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const token = localStorage.getItem("token");
        if (token && isValidToken(token)) {
          window.location.replace("/dashboard/");
        } else {
          setCheckingAuth(false);
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  const handleforgetpassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMsg("");
    setIsLoading(true);

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
        },
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setErrorMsg("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <>
        <div className="min-h-screen bg-[#F5F7FA] text-[#202328] flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-[#462EFC]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] justify-end">
      <div className="flex flex-col justify-center overflow-hidden">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/04/Group-4.png`}
          alt="Decorative top left"
          className="absolute top-0 left-0 w-[30%] h-[60%] pointer-events-none"
        />
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/04/logo-relayback.png`}
          alt="Decorative bottom right"
          className="absolute bottom-0 right-0 w-[50%] h-[90%] pointer-events-none"
        />

        <div className="grow flex items-center justify-center z-10 sm:p-0 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center m-12">
            <h2 className="text-4xl font-bold text-[#190089] mb-6">
              Forget Password
            </h2>

            <form
              onSubmit={handleforgetpassword}
              className="space-y-4 text-left"
            >
              <div>
                <label
                  htmlFor="useremail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
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
                <a href="/" className="text-sm text-[#4C00C2] hover:underline">
                  Back to login
                </a>
              </div>
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}

              {successMessage && (
                <p className="text-green-500 text-sm text-center">
                  {successMessage}
                </p>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="lg:w-[60%] bg-[#462EFC] text-white font-semibold py-2 px-4 rounded-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Get Password Reset Link"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
