export default function MatchHistoryTable() {
  return (
    <div className="mt-6">
      <div className="bg-gray-700 text-white px-4 py-2 rounded-t-lg font-medium">
        일반 게임 전적
      </div>

      <div className="bg-white rounded-b-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-4 p-6 border-b">
          <button className="text-gray-700 font-medium border-b-2 border-gray-700 pb-2">
            솔로
          </button>
          <button className="text-gray-400 hover:text-gray-700 pb-2">
            듀오
          </button>
          <button className="text-gray-400 hover:text-gray-700 pb-2">
            스쿼드
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">KDA</th>
                <th className="px-4 py-3 text-left">승률</th>
                <th className="px-4 py-3 text-left">Top10</th>
                <th className="px-4 py-3 text-left">KDA</th>
                <th className="px-4 py-3 text-left">승률</th>
                <th className="px-4 py-3 text-left">Top10</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="px-4 py-3">평균 딜량</td>
                <td className="px-4 py-3">게임 수</td>
                <td className="px-4 py-3">어모</td>
                <td className="px-4 py-3">평균 딜량</td>
                <td className="px-4 py-3">게임 수</td>
                <td className="px-4 py-3">평균 등수</td>
              </tr>
              <tr>
                <td className="px-4 py-3">헤드샷</td>
                <td className="px-4 py-3">치킨</td>
                <td className="px-4 py-3">생존</td>
                <td className="px-4 py-3">헤드샷</td>
                <td className="px-4 py-3">치킨</td>
                <td className="px-4 py-3">어모</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-gray-700 text-white px-4 py-2 rounded-t-lg font-medium">
        매치 히스토리
      </div>

      <div className="bg-white rounded-b-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">스쿼드</th>
                <th className="px-4 py-3 text-left">에란겔</th>
                <th className="px-4 py-3 text-left">AUG A3</th>
                <th className="px-4 py-3 text-left">1</th>
                <th className="px-4 py-3 text-left">238</th>
                <th className="px-4 py-3 text-left">1</th>
                <th className="px-4 py-3 text-left">8.64km</th>
                <th className="px-4 py-3 text-left">17분 49초</th>
                <th className="px-4 py-3 text-left">25m</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-green-50">
                <td className="px-4 py-3">#10 /15</td>
                <td className="px-4 py-3">지도</td>
                <td className="px-4 py-3">주무기</td>
                <td className="px-4 py-3">킬</td>
                <td className="px-4 py-3">딜량</td>
                <td className="px-4 py-3">DBNO</td>
                <td className="px-4 py-3">이동거리</td>
                <td className="px-4 py-3">생존 기간</td>
                <td className="px-4 py-3">거리</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3">25분 전</td>
                <td className="px-4 py-3" colSpan={8}>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      Notifpi 1
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      Notifpi 2
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      Notifpi 3
                    </span>
                    <span className="text-xs text-blue-600">
                      디지인일하는방법중요
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
