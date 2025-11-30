import { NavLink } from "react-router-dom";
import LogoIcon from "../icon/LogoIcon";
import "../../styles/header.css";

const NAV_ITEMS = [
    { label: "메인", to: "/" },
    { label: "지도", to: "/map", hasSubmenu: true },
    { label: "자료", to: "/data", hasSubmenu: true },
    { label: "랭커", to: "/ranker" },
];

export default function Header() {
    return (
        <header className="header">
            <div className="header__container">
                <div className="header__top">
                    <NavLink to="/" className="header__logo">
                        <div className="header__logo-mark">
                            <LogoIcon viewBox="0 0 200 200" />
                        </div>
                        <span className="header__logo-text">PUBG INSIGHT</span>
                    </NavLink>

                    <div className="header__search">
                        <span className="header__search-placeholder">검색 기능 준비중</span>
                    </div>
                </div>

                <nav className="header__bottom" aria-label="주요 메뉴">
                    {NAV_ITEMS.map((item) => (
                        <div
                            key={item.label}
                            className={`header__nav-item${item.hasSubmenu ? " has-submenu" : ""}`}
                        >
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `header__nav-link${isActive ? " is-active" : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>

                            {item.hasSubmenu && (
                                <div className="header__submenu" aria-hidden="true">
                                    <div className="header__submenu-surface">
                                        <div className="header__submenu-placeholder" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
}
