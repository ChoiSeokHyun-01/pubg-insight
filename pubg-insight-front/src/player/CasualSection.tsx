import { Trophy } from "lucide-react";

interface CasualSectionProps {
  mode: "TPP" | "FPP";
}

export default function CasualSection({ mode }: CasualSectionProps) {
  return (
    <div className="bg-green-600 text-white rounded-lg overflow-hidden">
      <div className="bg-green-700 px-4 py-2 font-medium">스쿼드</div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <div>
              <div className="text-sm text-green-200">Survivor 1</div>
              <div className="text-2xl font-bold">7732 RP</div>
            </div>
          </div>
          <div className="w-32 bg-green-500 rounded-full h-2">
            <div
              className="bg-yellow-400 rounded-full h-2"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-green-200 mb-1">KDA</div>
            <div className="font-medium">-</div>
          </div>
          <div>
            <div className="text-green-200 mb-1">승률</div>
            <div className="font-medium">-</div>
          </div>
          <div>
            <div className="text-green-200 mb-1">Top10</div>
            <div className="font-medium">-</div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-green-500">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-green-200 mb-1">평균 딜량</div>
              <div className="font-medium">게임 수</div>
            </div>
            <div>
              <div className="text-green-200 mb-1">게임 수</div>
              <div className="font-medium">평균 등수</div>
            </div>
            <div>
              <div className="text-green-200 mb-1">평균 등수</div>
              <div className="font-medium">어모</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-green-500">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-green-200 mb-1">헤드샷</div>
              <div className="font-medium">치킨</div>
            </div>
            <div>
              <div className="text-green-200 mb-1">치킨</div>
              <div className="font-medium">생존</div>
            </div>
            <div>
              <div className="text-green-200 mb-1">생존</div>
              <div className="font-medium">어모</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
