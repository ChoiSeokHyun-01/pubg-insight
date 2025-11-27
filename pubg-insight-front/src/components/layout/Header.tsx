import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
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
        {/* <a href="#" className="site-nav__link">
          자료
        </a>
        <a href="#" className="site-nav__link">
          랭킹
        </a> */}
      </nav>
    </header>
  );
}
