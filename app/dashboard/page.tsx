"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import TeamTabs from "../components/TeamTabs";
import Footer from "../components/Footer";
import { isValidToken } from "../utils/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    if (!isValidToken(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("valid_user_email");
      router.replace("/");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <>
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        Loading...
      </div>
      <Footer/>
      </>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <div className="grow sm:px-12 sm:py-6 px-6 py-4">
        <TeamTabs/>
      </div>
      <Footer/>
    </main>
  );
}