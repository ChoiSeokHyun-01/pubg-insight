"use client";

import { useState } from "react";
import PlayerSummaryCard from "../player/PlayerSummaryCard";
import RankedSection from "../player/RankedSection";
import CasualSection from "../player/CasualSection";
import MatchHistoryTable from "../player/MatchHistoryTable";

export default function PlayerOverviewPage() {
  const [activeTab, setActiveTab] = useState<"TPP" | "FPP">("TPP");

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <PlayerSummaryCard />

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab("TPP")}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            activeTab === "TPP"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          TPP
        </button>
        <button
          onClick={() => setActiveTab("FPP")}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            activeTab === "FPP"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          FPP
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <RankedSection mode={activeTab} />
        <CasualSection mode={activeTab} />
      </div>

      <MatchHistoryTable />
    </div>
  );
}
