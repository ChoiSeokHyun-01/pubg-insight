import { Search } from "lucide-react";
import LogoIcon from "../components/icon/LogoIcon";

export default function SearchHome() {
    return (
        <div className="search-home">
            <div className="search-home__inner">
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
    );
}
