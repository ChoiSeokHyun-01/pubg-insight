import { Shirt } from "lucide-react";

interface RankedSectionProps {
  mode: "TPP" | "FPP";
}

export default function RankedSection({ mode }: RankedSectionProps) {
  return (
    <div className="bg-blue-600 text-white rounded-lg overflow-hidden">
      <div className="bg-blue-700 px-4 py-2 font-medium">듀오</div>

      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <Shirt className="w-16 h-16 text-blue-300" />
        </div>
        <p className="text-center text-blue-200 text-sm">기록 없음</p>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-blue-200 mb-1">KDA</div>
            <div className="font-medium">-</div>
          </div>
          <div>
            <div className="text-blue-200 mb-1">승률</div>
            <div className="font-medium">-</div>
          </div>
          <div>
            <div className="text-blue-200 mb-1">Top10</div>
            <div className="font-medium">-</div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-500">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-200 mb-1">평균 딜량</div>
              <div className="font-medium">게임 수</div>
            </div>
            <div>
              <div className="text-blue-200 mb-1">게임 수</div>
              <div className="font-medium">평균 등수</div>
            </div>
            <div>
              <div className="text-blue-200 mb-1">평균 등수</div>
              <div className="font-medium">-</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-500">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-200 mb-1">헤드샷</div>
              <div className="font-medium">치킨</div>
            </div>
            <div>
              <div className="text-blue-200 mb-1">치킨</div>
              <div className="font-medium">생존</div>
            </div>
            <div>
              <div className="text-blue-200 mb-1">생존</div>
              <div className="font-medium">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
