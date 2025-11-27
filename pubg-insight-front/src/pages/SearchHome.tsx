import { Search } from "lucide-react";

export default function SearchHome() {
  return (
    <div className="search-home">
      <div className="search-home__inner">
        <div className="search-home__hero">
          <div>
            <svg
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="search-home__logo"
            >
              <path
                d="M90 20C70 20 54 36 54 56C54 82 90 120 90 120C90 120 126 82 126 56C126 36 110 20 90 20Z"
                fill="#F59E0B"
                stroke="#F59E0B"
                strokeWidth="3"
              />
              <circle cx="90" cy="56" r="12" fill="white" />
              <rect
                x="55"
                y="90"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="80"
                y="90"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="55"
                y="115"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="80"
                y="115"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="55"
                y="140"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="80"
                y="140"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="105"
                y="90"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="105"
                y="115"
                width="20"
                height="20"
                rx="2"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
              />
              <rect
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
            <div className="search-home__title">PUBG INFO HUB</div>
          </div>

          <div className="search-home__search">
            <input
              type="text"
              placeholder="플레이어명을 입력하세요"
              className="search-home__input"
            />
            <Search size={22} className="search-home__icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
