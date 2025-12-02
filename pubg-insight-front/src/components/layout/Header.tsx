import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoIcon from "../icon/LogoIcon";
import HeaderSearch from "../search/HeaderSearch";
import "../../styles/header.css";

const NAV_ITEMS = [
    { label: "메인", to: "/" },
    { label: "지도", to: "/maps" },
    { label: "프레젠테이션", to: "/presentation" },
];

export default function Header() {
    const location = useLocation();
    const isMapRoute = location.pathname.startsWith("/map/");
    const isPresentation = location.pathname === "/presentation";
    const hideHeader = isMapRoute || isPresentation;
    const [isVisible, setIsVisible] = useState<boolean>(!hideHeader);

    useEffect(() => {
        if (!hideHeader) {
            setIsVisible(true);
            return;
        }
        setIsVisible(false);

        const handleMouseMove = (e: MouseEvent) => {
            const nearTop = e.clientY < 125;
            setIsVisible(nearTop);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [hideHeader]);

    return (
        <header
            className={`header${hideHeader ? (isVisible ? " header--shown" : " header--hidden") : ""}`}
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
