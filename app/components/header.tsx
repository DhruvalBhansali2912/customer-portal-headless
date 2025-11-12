"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import { useSession } from "./SessionContext";

export default function Header() {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { session, setSession, clearSession } = useSession();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Select a category");
  const categoryOptions = ["Feedback", "Question","Others"];

  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);


  const handleSupport = () => {
  setShowSupportModal(true);
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("company");
    router.push("/");
  };

  const handleMainPage = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    // Replace with your real API endpoint
    const fetchClients = async () => {
   try {
      var token = localStorage.getItem("token");
      var userEmail = localStorage.getItem("valid_user_email");
      var response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/clientList`, {
       headers: {
              Authorization: `Bearer ${token}`,
              authemail: `Bearer ${userEmail}`,
            },
      });
      setOptions(response.data);
      if(localStorage.getItem('company')){
        var company = localStorage.getItem('company');
        if (company !== null) {
        setSelectedOption(company);
        }
      }
      else{
        setSelectedOption(response.data[0]);
        localStorage.setItem('company',response.data[0]);
        setSession({
          company: response.data[0]
        });
      }
    } catch (error) {
      console.error("Error fetching feedback types", error);
    }
  }

  fetchClients();
  }, []);

  const modalRef = useRef<HTMLDivElement>(null);

// useEffect(() => {
//   function handleClickOutside(event: MouseEvent) {
//     if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//       setShowSupportModal(false);
//     }
//   }

//   if (showSupportModal) {
//     document.addEventListener("mousedown", handleClickOutside);
//   }

//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, [showSupportModal]);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    // Client dropdown
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <header className="bg-gradient-to-r from-[#141464] to-[#5C7CB8] px-4 sm:px-12 py-4 flex justify-between items-center shadow-md">

      {/* Mobile Menu Button */}
      <div className="lg:hidden self-start">
      <button
        onClick={() => setShowMobileMenu(true)}
        className="text-white focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
      <div className="flex items-center space-x-4 self-center lg:self-auto">
        <button
          onClick={handleMainPage}
          className="flex items-center space-x-2 text-white hover:opacity-80 transition cursor-pointer"
        >
          <img
            src= {`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/05/Customer-Portal.png`}
            alt="Logo"
            width={200}
            height={30}
          />
        </button>
      </div>

      {/* Left: Logo */}
      {/* Right: Dropdown + Support + Logout */}
      <div className="hidden lg:flex items-center space-x-6 relative">
        {/* Custom Dropdown */}
        {options.length > 1 ? (
        <div className="relative" ref={dropdownRef}>
        {/* Toggle button (closed: transparent, open: same) */}
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center space-x-2 px-4 py-2 text-white text-md hover:bg-white/10 transition rounded-[18px] cursor-pointer"
        >
          <img src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/06/Layer_1.png`} alt="Client" className="w-5 h-5" />
          <span>{selectedOption || "Client"}</span>
          <svg
            className={`w-4 h-4 text-white transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-54 bg-white text-black rounded-2xl shadow-lg z-50 max-h-56 overflow-y-auto">
            {options.map((opt, i) => (
              <div
                key={i}
                onClick={() => {
                  if(opt!=selectedOption){
                    setSelectedOption(opt);
                    localStorage.setItem('company',opt);
                    window.location.reload();
                  }
                  setDropdownOpen(false);
                }}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
        ):(
           <div className="flex items-center space-x-2 px-4 py-2 text-white text-md rounded-[18px]">
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/06/Layer_1.png`}
      alt="Client"
      className="w-5 h-5"
    />
    <span>{selectedOption || "Client"}</span>
  </div>
        )}

        {/* Support */}
        <button
          onClick={handleSupport}
          className="flex items-center space-x-2 text-white hover:opacity-80 transition text-md cursor-pointer"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/06/Layer_1-1.png`}
            alt="Support Icon"
            className="w-5 h-5"
          />
          <span className="text-md">Support</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:opacity-80 transition cursor-pointer"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/06/Log-out.png`}
            alt="Support Icon"
            className="w-5 h-5"
          />
          <span className="text-md">Logout</span>
        </button>
      </div>
      {showSupportModal && (
  <div className="fixed inset-0 bg-black/[0.4] backdrop-blur-sm z-50 flex items-center justify-center">
    <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
      {/* Header */}
      <div className="bg-[#190089] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
        <h2 className="text-lg font-semibold">Contact Us</h2>
        <button
          onClick={() => setShowSupportModal(false)}
          className="text-white text-xl cursor-pointer"
        >
          x
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 text-sm">
          Have a question or need assistance? Send us a message and we’ll get back to you as soon as possible.
        </p>
        <input
        type="text"
        placeholder="Name"
        value={supportName}
        onChange={(e) => setSupportName(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="email"
        placeholder="Email"
        value={supportEmail}
        onChange={(e) => setSupportEmail(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

        <div className="relative">
        <button
          onClick={() => setCategoryDropdownOpen((prev) => !prev)}
          className="flex items-center justify-between w-full border rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <span>{selectedCategory}</span>
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
            {categoryOptions.map((option, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(option);
                  setCategoryDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

              <textarea
              placeholder="Message"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />

              <button className="w-full bg-[#462EFC] text-white font-semibold rounded-full py-2 hover:bg-indigo-700 transition cursor-pointer"
              onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const userEmail = localStorage.getItem("valid_user_email");
                const company = localStorage.getItem("company");

                if(company){
                  const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/submitsupport`,
                  {
                    name: supportName,
                    email: supportEmail,
                    category: selectedCategory,
                    message: supportMessage,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      authemail: `Bearer ${userEmail}`,
                      company: company
                    },
                  }
                );
                }
                else{
                  const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/submitsupport`,
                  {
                    name: supportName,
                    email: supportEmail,
                    category: selectedCategory,
                    message: supportMessage,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      authemail: `Bearer ${userEmail}`,
                    },
                  }
                );
                }
              
                setSupportSuccess(true);
                setSupportName("");
                setSupportEmail("");
                setSupportMessage("");
                setSelectedCategory("Select a category");

                setTimeout(() => {
                  setShowSupportModal(false);
                  setSupportSuccess(false);
                }, 1500);
              } catch (err) {
                alert("Failed to submit support request.");
                console.error(err);
              }
            }}
              >
                Submit
              </button>
               {supportSuccess && (
                <div className="text-green-600 font-medium text-center mt-2">
                  ✅ Contact submitted successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Mobile Sidebar Menu */}
{showMobileMenu && (
  <div className="fixed inset-0 z-50 flex">
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black opacity-50"
      onClick={() => setShowMobileMenu(false)}
    />

    {/* Sidebar */}
    <div className={`fixed top-12 left-0 ${dropdownOpen ? "w-68" : "w-52"} bg-[#EFEFEF] shadow-lg z-50 transform transition-transform duration-300 ease-in-out rounded-2xl ${
    showMobileMenu ? "translate-x-0" : "translate-x-full"
  }`}>
      <button
        onClick={() => setShowMobileMenu(false)}
        className="absolute top-4 right-4 text-gray-800"
      >
        ✕
      </button>

      <div className="flex flex-col space-y-4 mt-8 mb-8">
        <div className="relative text-black " ref={dropdownRef}>
        {/* Toggle button (closed: transparent, open: same) */}
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center space-x-2 px-4 py-2 font-semibold text-md hover:bg-white/10 transition rounded-[18px] cursor-pointer"
        >
          <span>{selectedOption || "Client"}</span>
          <svg
            className={`w-4 h-4 text-black transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="text-black-400 mt-2 w-54 bg-white text-black rounded-2xl shadow-lg z-50 max-h-56 overflow-y-auto">
            {options.map((opt, i) => (
              <div
                key={i}
                onClick={() => {
                  if(opt!=selectedOption){
                    setSelectedOption(opt);
                    localStorage.setItem('company',opt);
                    window.location.reload();
                  }
                  setDropdownOpen(false);
                }}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
        <button onClick={()=>{
          handleSupport();
          setShowMobileMenu(false);
         }} className="text-left pl-4 text-black font-semibold">
          Support
        </button>
        <button onClick={()=>{
          handleLogout(); 
          setShowMobileMenu(false);}} className="text-left pl-4 text-red-600 font-semibold">
          Logout
        </button>
      </div>
    </div>
  </div>
)}

    </header>
  );
}
