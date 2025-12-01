import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoIcon from "../icon/LogoIcon";
import HeaderSearch from "../search/HeaderSearch";
import "../../styles/header.css";

const NAV_ITEMS = [
    { label: "메인", to: "/" },
    { label: "지도", to: "/maps" },
    { label: "핀 에디터", to: "/pin-editor" },
    { label: "데이터", to: "/data" },
    // { label: "랭커", to: "/ranker" },
];

export default function Header() {
    const location = useLocation();
    const isMapRoute = location.pathname.startsWith("/map/");
    const [isVisible, setIsVisible] = useState<boolean>(!isMapRoute);

    useEffect(() => {
        if (!isMapRoute) {
            setIsVisible(true);
            return;
        }
        setIsVisible(false);

        const handleMouseMove = (e: MouseEvent) => {
            const nearTop = e.clientY < 200;
            setIsVisible(nearTop);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isMapRoute]);

    return (
        <header
            className={`header${isMapRoute ? (isVisible ? " header--shown" : " header--hidden") : ""}`}
        >
            <div className="header__container">
                <div className="header__top">
                    <NavLink to="/" className="header__logo">
                        <div className="header__logo-mark">
                            <LogoIcon />
                        </div>
                        <span className="header__logo-text">PUBG INFO HUB</span>
                    </NavLink>

                    <HeaderSearch />
                </div>

                <nav className="header__bottom" aria-label="주요 메뉴">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className="header__nav-item">
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `header__nav-link${isActive ? " is-active" : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
}
