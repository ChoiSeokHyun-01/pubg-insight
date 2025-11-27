import { Shirt } from "lucide-react";

interface RankedSectionProps {
  mode: "TPP" | "FPP";
}

export default function RankedSection({ mode }: RankedSectionProps) {
  return (
    <div className="stats-panel stats-panel--ranked">
      <div className="stats-panel__header">듀오</div>

      <div className="stats-panel__body">
        <div className="stats-header-row">
          <Shirt size={64} className="stats-icon" />
        </div>
        <p className="stat-label">기록 없음</p>

        <div className="stats-grid">
          <div>
            <div className="stat-label">KDA</div>
            <div className="stat-value">-</div>
          </div>
          <div>
            <div className="stat-label">승률</div>
            <div className="stat-value">-</div>
          </div>
          <div>
            <div className="stat-label">Top10</div>
            <div className="stat-value">-</div>
          </div>
        </div>

        <div className="metrics-divider">
          <div className="stats-grid">
            <div>
              <div className="stat-label">평균 딜량</div>
              <div className="stat-value">게임 수</div>
            </div>
            <div>
              <div className="stat-label">게임 수</div>
              <div className="stat-value">평균 등수</div>
            </div>
            <div>
              <div className="stat-label">평균 등수</div>
              <div className="stat-value">-</div>
            </div>
          </div>
        </div>

        <div className="metrics-divider">
          <div className="stats-grid">
            <div>
              <div className="stat-label">헤드샷</div>
              <div className="stat-value">치킨</div>
            </div>
            <div>
              <div className="stat-label">치킨</div>
              <div className="stat-value">생존</div>
            </div>
            <div>
              <div className="stat-label">생존</div>
              <div className="stat-value">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
