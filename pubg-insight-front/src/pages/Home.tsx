import LogoIcon from "../components/icon/LogoIcon";
import PlayerSearch from "../components/search/PlayerSearch";
import "../styles/home.css";

export default function Home() {
    return (
        <main className="page page-home">
            <div className="page-home__hero">
                <div className="page-home__logo">
                    <LogoIcon />
                    <div className="page-home__brand">
                        <span className="page-home__brand-main">PUBG</span>
                        <span className="page-home__brand-sub">INFO HUB</span>
                    </div>
                </div>

                <PlayerSearch />
            </div>
        </main>
    );
}
