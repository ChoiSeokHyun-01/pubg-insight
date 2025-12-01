import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform } from "../../config/playerApi";

export default function HeaderSearch() {
    const [platform, setPlatform] = useState<Platform>("steam");
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const isDisabled = useMemo(() => keyword.trim().length === 0, [keyword]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const name = keyword.trim();
        if (!name) return;

        navigate(`/profile/${platform}/${encodeURIComponent(name)}`);
    };

    return (
        <div className="header-search" role="search">
            <form className="header-search__form" onSubmit={handleSubmit}>
                <select
                    className="header-search__platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    aria-label="플랫폼 선택"
                >
                    <option value="steam">Steam</option>
                    <option value="kakao">Kakao</option>
                </select>

                <input
                    className="header-search__input"
                    type="text"
                    placeholder="플레이어 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    aria-label="플레이어 검색"
                />

                <button className="header-search__button" type="submit" disabled={isDisabled}>
                    검색
                </button>
            </form>
        </div>
    );
}
