export default function PlayerSummaryCard() {
  return (
    <div className="bg-gray-700 text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-600 rounded text-sm">
            경쟁전 시즌 36
          </button>
          <button className="px-4 py-2 bg-gray-600 rounded text-sm">
            경쟁전 시즌 37
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded text-sm">
            경쟁전 시즌 38
          </button>
          <select className="px-4 py-2 bg-gray-600 rounded text-sm">
            <option>과거 시즌</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-yellow-500 rounded-lg"></div>
        <div>
          <h1 className="text-2xl font-bold mb-2">디지인일하는방법중요</h1>
          <button className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600">
            업데 완싱
          </button>
          <p className="text-sm text-gray-400 mt-1">마지막업데: 1분 전</p>
        </div>
      </div>

      <div className="mt-4 flex gap-6 text-sm border-t border-gray-600 pt-4">
        <button className="text-white font-medium border-b-2 border-white pb-2">
          개요
        </button>
        <button className="text-gray-400 hover:text-white pb-2">
          실세 전적
        </button>
        <button className="text-gray-400 hover:text-white pb-2">
          매치 기록
        </button>
      </div>
    </div>
  );
}
