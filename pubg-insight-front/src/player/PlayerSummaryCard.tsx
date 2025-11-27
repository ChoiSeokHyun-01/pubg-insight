export default function PlayerSummaryCard() {
  return (
    <div className="player-card">
      <div className="player-card__controls">
        <button className="season-chip">경쟁전 시즌 36</button>
        <button className="season-chip">경쟁전 시즌 37</button>
        <button className="season-chip is-active">경쟁전 시즌 38</button>
        <select className="season-select">
          <option>과거 시즌</option>
        </select>
      </div>

      <div className="player-card__body">
        <div className="player-avatar"></div>
        <div className="player-card__info">
          <h1>디지인일하는방법중요</h1>
          <button className="primary-button">업데 완싱</button>
          <p className="player-meta">마지막업데: 1분 전</p>
        </div>
      </div>

      <div className="player-tabs">
        <button className="tab-link is-active">개요</button>
        <button className="tab-link">실세 전적</button>
        <button className="tab-link">매치 기록</button>
      </div>
    </div>
  );
}
