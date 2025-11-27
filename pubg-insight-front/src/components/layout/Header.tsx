import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded"></div>
            <span className="text-xl font-bold">PUBG INFO HUB</span>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="플레이어명을 입력하세요"
                className="w-full bg-gray-700 text-white px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <nav className="mt-3 flex gap-6">
          <a href="#" className="text-yellow-500 font-medium">
            메인
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            지도
          </a>
          {/* <a href="#" className="text-gray-300 hover:text-white">
            자료
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            랭킹
          </a> */}
        </nav>
      </div>
    </header>
  );
}
