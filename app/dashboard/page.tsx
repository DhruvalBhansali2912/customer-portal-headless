"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import TeamTabs from "../components/TeamTabs";
import Footer from "../components/Footer";

export default function DashboardPage() {
  const router = useRouter();

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
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Header />
        <div className="flex-grow sm:px-12 sm:py-6 px-6 py-4">
      <TeamTabs/>
      </div>
      <Footer/>
    </main>
  );
}