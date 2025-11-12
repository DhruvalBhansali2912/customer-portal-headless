"use client";

import { useState } from "react";
import TeamMembers from "./TeamMembers";
import Billing from "./Billing";
import Documentation from "./Documentation";
import SOP from "./sop";

const tabs = ["Team", "Billing", "Documentation", "SOP's"];

export default function TeamTabs() {
  const [activeTab, setActiveTab] = useState("Team");

  return (
    <section className="">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 sm:justify-start justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex items-center gap-2 pb-2 text-sm sm:text-base border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-[#462EFC] text-[#462EFC] font-semibold"
                : "border-transparent text-[#8984AF] font-semibold"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/05/${tab.toLowerCase().replace(/'s/g, '')}${
                activeTab === tab ? "-active" : ""
              }.png`}
              alt={tab}
              className="h-5"
            />
            {tab}
          </button>
        ))}
      </div>

      {/* Persisted Tab Content */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-md">
        <div className={activeTab === "Team" ? "block" : "hidden"}>
          <TeamMembers />
        </div>
        <div className={activeTab === "Billing" ? "block" : "hidden"}>
          <Billing />
        </div>
        <div className={activeTab === "Documentation" ? "block" : "hidden"}>
          <Documentation />
        </div>
        <div className={activeTab === "SOP's" ? "block" : "hidden"}>
          <SOP />
        </div>
      </div>
    </section>
  );
}
