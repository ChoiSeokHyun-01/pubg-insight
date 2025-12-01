import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform } from "../../config/playerApi";

export default function PlayerSearch() {
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
        <section className="page-home__search" aria-label="플레이어 검색">
            <form className="page-home__search-form" onSubmit={handleSubmit}>
                <div className="page-home__search-input">
                    <select
                        className="page-home__search-platform"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as Platform)}
                        aria-label="플랫폼 선택"
                    >
                        <option value="steam">Steam</option>
                        <option value="kakao">Kakao</option>
                    </select>

                    <input
                        type="text"
                        className="page-home__search-field"
                        placeholder="플레이어 이름을 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        aria-label="플레이어 이름"
                    />

                    <button type="submit" className="page-home__search-button" disabled={isDisabled}>
                        검색
                    </button>
                </div>
            </form>

            <div className="page-home__search-feedback" role="status" aria-live="polite">
                <div className="page-home__search-helper">닉네임을 입력하면 프로필 페이지로 이동합니다.</div>
            </div>
        </section>
    );
}
