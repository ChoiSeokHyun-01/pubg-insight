"use client";

import { useState } from "react";
import PlayerSummaryCard from "../player/PlayerSummaryCard";
import RankedSection from "../player/RankedSection";
import CasualSection from "../player/CasualSection";
import MatchHistoryTable from "../player/MatchHistoryTable";

export default function PlayerOverviewPage() {
  const [activeTab, setActiveTab] = useState<"TPP" | "FPP">("TPP");

  return (
    <div className="page-container">
      <PlayerSummaryCard />

      <div className="pill-buttons">
        <button
          onClick={() => setActiveTab("TPP")}
          className={`pill-button ${activeTab === "TPP" ? "is-active" : ""}`}
        >
          TPP
        </button>
        <button
          onClick={() => setActiveTab("FPP")}
          className={`pill-button ${activeTab === "FPP" ? "is-active" : ""}`}
        >
          FPP
        </button>
      </div>

      <div className="stats-panels">
        <RankedSection mode={activeTab} />
        <CasualSection mode={activeTab} />
      </div>

      <MatchHistoryTable />
    </div>
  );
}
