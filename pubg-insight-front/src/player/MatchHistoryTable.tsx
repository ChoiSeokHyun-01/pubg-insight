export default function MatchHistoryTable() {
  return (
    <div>
      <div className="card">
        <div className="card__header">일반 게임 전적</div>
        <div className="card__body">
          <div className="tab-group">
            <button className="tab-button is-active">솔로</button>
            <button className="tab-button">듀오</button>
            <button className="tab-button">스쿼드</button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>KDA</th>
                  <th>승률</th>
                  <th>Top10</th>
                  <th>KDA</th>
                  <th>승률</th>
                  <th>Top10</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>평균 딜량</td>
                  <td>게임 수</td>
                  <td>어모</td>
                  <td>평균 딜량</td>
                  <td>게임 수</td>
                  <td>평균 등수</td>
                </tr>
                <tr>
                  <td>헤드샷</td>
                  <td>치킨</td>
                  <td>생존</td>
                  <td>헤드샷</td>
                  <td>치킨</td>
                  <td>어모</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">매치 히스토리</div>
        <div className="card__body">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>스쿼드</th>
                  <th>에란겔</th>
                  <th>AUG A3</th>
                  <th>1</th>
                  <th>238</th>
                  <th>1</th>
                  <th>8.64km</th>
                  <th>17분 49초</th>
                  <th>25m</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlight-row">
                  <td>#10 /15</td>
                  <td>지도</td>
                  <td>주무기</td>
                  <td>킬</td>
                  <td>딜량</td>
                  <td>DBNO</td>
                  <td>이동거리</td>
                  <td>생존 기간</td>
                  <td>거리</td>
                </tr>
                <tr>
                  <td>25분 전</td>
                  <td colSpan={8}>
                    <div className="badge-row">
                      <span className="badge">Notifpi 1</span>
                      <span className="badge">Notifpi 2</span>
                      <span className="badge">Notifpi 3</span>
                      <span className="inline-link">디지인일하는방법중요</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
