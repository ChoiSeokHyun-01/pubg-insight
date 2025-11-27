import { Search } from "lucide-react";
export default function SearchHome() {
  return (
    <div className="bg-white min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              {/* Map pin icon */}
              <path
                d="M90 20C70 20 54 36 54 56C54 82 90 120 90 120C90 120 126 82 126 56C126 36 110 20 90 20Z"
                fill="#F59E0B"
                stroke="#F59E0B"
                strokeWidth="3"
              />
              <circle cx="90" cy="56" r="12" fill="white" />
              {/* Grid squares */}
              <rect // 1행1열
                x="55"
                y="90"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 1행2열
                x="80"
                y="90"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 2행1열
                x="55"
                y="115"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 2행2열
                x="80"
                y="115"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 3행1열
                x="55"
                y="140"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 3행2열
                x="80"
                y="140"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 1행3열
                x="105"
                y="90"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 2행3열
                x="105"
                y="115"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect // 3행3열
                x="105"
                y="140"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <div className="text-center mt-4">
              <h1 className="text-5xl font-bold text-[#F59E0B] tracking-wide">
                PUBG INFO HUB
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="플레이어명을 입력하세요"
                className="w-full bg-gray-700 text-white px-4 py-3 pr-20 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
