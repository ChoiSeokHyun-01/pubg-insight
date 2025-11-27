import { Search, Moon, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MouseEvent, WheelEvent } from "react";
import "../styles/search-home.css";
import LogoIcon from "../components/icon/LogoIcon";

type MapInfo = {
  id: string;
  name: string;
  imageUrl: string;
};

const MAPS: MapInfo[] = [
  { id: "erangel", name: "에란겔", imageUrl: "https://YOUR_S3/maps/erangel.png" },
  { id: "miramar", name: "미라마", imageUrl: "https://YOUR_S3/maps/miramar.png" },
  { id: "sanok", name: "사녹", imageUrl: "https://YOUR_S3/maps/sanok.png" },
  { id: "vikendi", name: "비켄디", imageUrl: "https://YOUR_S3/maps/vikendi.png" },
  { id: "taego", name: "태이고", imageUrl: "https://YOUR_S3/maps/taego.png" },
  { id: "deston", name: "데스턴", imageUrl: "https://YOUR_S3/maps/deston.png" },
  { id: "paramo", name: "파라모", imageUrl: "https://YOUR_S3/maps/paramo.png" },
  { id: "haven", name: "헤이븐", imageUrl: "https://YOUR_S3/maps/haven.png" },
  { id: "ronne", name: "론네", imageUrl: "https://YOUR_S3/maps/ronne.png" },
];

const PAGE_SIZE = 4;
const TOTAL_PAGES = Math.ceil(MAPS.length / PAGE_SIZE);

export default function SearchHome() {

  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  //캐러셀 상태
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const animatingRef = useRef(false);

  /* -------------------------
     페이지 이동 함수
  -------------------------- */
  const goToPage = (next: number) => {
    const target = Math.max(0, Math.min(TOTAL_PAGES - 1, next));
    if (target === page) return;

    setPage(target);
    animatingRef.current = true;

    setTimeout(() => {
      animatingRef.current = false;
    }, 400);
  };

  /* -------------------------
     휠로 넘기기
  -------------------------- */
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (animatingRef.current) return;

    if (e.deltaY > 0 || e.deltaX > 0) goToPage(page + 1);
    else goToPage(page - 1);
  };

  /* -------------------------
     드래그 앤 드롭
  -------------------------- */
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDelta(0);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX === null) return;
    setDragDelta(e.clientX - dragStartX);
  };

  const endDrag = () => {
    if (!isDragging) return;

    const threshold = 60;

    if (dragDelta > threshold) goToPage(page - 1);
    else if (dragDelta < -threshold) goToPage(page + 1);

    setIsDragging(false);
    setDragStartX(null);
    setDragDelta(0);
  };

  /* -------------------------
     맵 클릭 → 페이지 이동
  -------------------------- */
  const goToMap = (id: string) => {
    navigate(`/maps/${id}`);
  };

  const baseTranslate = -page * 100;
  const dragTranslate = isDragging ? dragDelta : 0;

  /* -------------------------
     렌더링
  -------------------------- */
  return <>
    <div className={`search-home ${isDark ? "search-home--dark" : ""}`}>
      {/* 다크모드 토글 버튼 */}
      <button
        type="button"
        className="search-home__theme-toggle"
        onClick={() => setIsDark((prev) => !prev)}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        <span className="search-home__theme-label">
          {isDark ? "라이트" : "다크"}
        </span>
      </button>
      <div className="search-home__inner">
        {/* 로고 + 검색창 */}
        <div className="search-home__hero">
          <div>
            <LogoIcon>
            </LogoIcon>
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
        {/* 캐러셀 추가 */}
    <section style={{ marginTop: "40px" }}>
      <div
        className="relative overflow-hidden select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div
          className="flex"
          style={{
            width: `${TOTAL_PAGES * 100}%`,
            transform: `translateX(calc(${baseTranslate}% + ${dragTranslate}px))`,
            transition: isDragging ? "none" : "transform 0.4s ease",
          }}
        >
          {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="flex w-full flex-none gap-6 justify-center"
            >
              {MAPS.slice(
                pageIndex * PAGE_SIZE,
                (pageIndex + 1) * PAGE_SIZE
              ).map((map) => (
                <button
                  key={map.id}
                  type="button"
                  onClick={() => goToMap(map.id)}
                  className="w-56 h-72 bg-white rounded-2xl shadow-md border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-transform duration-150 text-left"
                >
                  <div className="w-full h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={map.imageUrl}
                      alt={map.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-base font-semibold text-gray-800">
                      {map.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      CLICK TO OPEN
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
}
