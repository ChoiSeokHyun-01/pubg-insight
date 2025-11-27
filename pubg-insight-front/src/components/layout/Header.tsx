import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function Header() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const target = document.querySelector(".search-home__input");
    if (!target || typeof IntersectionObserver === "undefined") {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <div className={`site-header__inner ${isActive ? "is-active" : ""}`}>
        <div className="site-logo">
          <div className="logo-mark"></div>
          <span className="logo-title">PUBG INFO HUB</span>
        </div>

        <div className="site-search">
          <input
            type="text"
            placeholder="플레이어명을 입력하세요"
            className="site-search__input"
          />
          <Search size={20} className="site-search__icon" />
        </div>
      </div>

      <nav className="site-nav">
        <a href="#" className="site-nav__link site-nav__link--active">
          메인
        </a>
        <a href="#" className="site-nav__link">
          지도
        </a>
        <a href="#" className="site-nav__link">
          자료
        </a>
        <a href="#" className="site-nav__link">
          랭킹
        </a>
      </nav>
    </header>
  );
}
