"use client";

import React, { useState,useEffect  } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/header";

export default function SetPasswordPage() {
    const router = useRouter();
    const [params, setParams] = useState(false);
    const [confirmpassword, setConfirmpassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [companyid, setCompanyid] = useState("");
    const [useremail, setUseremail] = useState("");
     const [newpassword, setNewpassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [rules, setRules] = useState(true);
    const [passwordValidations, setPasswordValidations] = useState({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
      match: false,
    });
     
    const searchParams = useSearchParams();
    const company_id = searchParams.get("company_id") || '';
    const email = searchParams.get("email") || '';
    

  useEffect(() => {
    if (company_id != '' && email != '') {
      setParams(true);
      setCompanyid(company_id);
      setUseremail(email);
    }

  }, [router]);

  const validatePassword = (password: string, confirm: string) => {
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
    match: password !== "" && password === confirm,
  };
   
    

  setPasswordValidations(validations);

  // Enable submit button only if all are true
  setRules(!Object.values(validations).every(Boolean));
};


  const handlesetpassword = async (e: React.FormEvent) => {
 
  e.preventDefault();
  setErrorMsg("");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/setpassword`,
      {
        email: useremail,
        company_id: companyid,
        password: newpassword
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if(response.data.success){
      setSuccessMessage(response.data.message);
      setTimeout(function(){
        window.location.href = '/';
      },2000);
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
          <h2 className="text-4xl font-bold text-[#190089] mb-6">Set Password Page</h2>

          <form onSubmit={handlesetpassword} className="space-y-4 text-left">
            <div>
              <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-full px-3 py-2 bg-[#F6F6F6]">
                <span className="text-gray-500 mr-2">🔑</span>
                <input
                  type="password"
                  id="newpassword"
                  name="newpassword"
                  value={newpassword}
                  onChange={(e) => {
                    setNewpassword(e.target.value);
                    validatePassword(e.target.value, confirmpassword);
                  }}
                  className="w-full outline-none bg-transparent text-black"
                  placeholder="Enter New Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-full px-3 py-2 bg-[#F6F6F6]">
                <span className="text-gray-500 mr-2">🔑</span>
                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  value={confirmpassword}
                  onChange={(e) => {
                    setConfirmpassword(e.target.value);
                    validatePassword(newpassword, e.target.value); 
                  }}
                  className="w-full outline-none bg-transparent text-black"
                  placeholder="Confirm New Password"
                />
              </div>
            </div>
            <div className="text-right">
              <a href="/dashboard" className="text-sm text-[#4C00C2] hover:underline">Back to Dashboard</a>
            </div>
            <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p className={passwordValidations.length ? "text-green-600" : ""}>✓ At least 8 characters</p>
            <p className={passwordValidations.uppercase ? "text-green-600" : ""}>✓ At least one uppercase letter</p>
            <p className={passwordValidations.lowercase ? "text-green-600" : ""}>✓ At least one lowercase letter</p>
            <p className={passwordValidations.number ? "text-green-600" : ""}>✓ At least one number</p>
            <p className={passwordValidations.specialChar ? "text-green-600" : ""}>✓ At least one special character (@, #, $, etc.)</p>
            <p className={passwordValidations.match ? "text-green-600" : "text-red-500"}>✓ Passwords match</p>
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
                disabled={rules || !params}
              >
                Set Password
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