import { Trophy } from "lucide-react";

interface CasualSectionProps {
  mode: "TPP" | "FPP";
}

export default function CasualSection({ mode }: CasualSectionProps) {
  return (
    <div className="stats-panel stats-panel--casual">
      <div className="stats-panel__header">스쿼드</div>

      <div className="stats-panel__body">
        <div className="stats-header-row">
          <div className="badge-row">
            <Trophy size={48} className="stats-icon" />
            <div>
              <div className="stat-label">Survivor 1</div>
              <div className="stat-value stat-value--xl">7732 RP</div>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: "60%" }}></div>
          </div>
        </div>

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
              <div className="stat-value">어모</div>
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
              <div className="stat-value">어모</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
