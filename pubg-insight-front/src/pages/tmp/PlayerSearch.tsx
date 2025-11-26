
import { useState } from "react";

const API_BASE = "https://api.pubginfohub.com/api/players";

type Platform = "steam" | "kakao";

export default function PlayerSearch() {
    const [platform, setPlatform] = useState<Platform>("steam");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

    const fetchPlayer = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const url = `${API_BASE}/${platform}/${encodeURIComponent(trimmed)}`;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>PUBG Player Lookup (tmp)</h1>

            <label style={styles.field}>
                <span style={styles.label}>Platform</span>
                <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    style={styles.select}
                >
                    <option value="steam">steam</option>
                    <option value="kakao">kakao</option>
                </select>
            </label>

            <label style={styles.field}>
                <span style={styles.label}>Name</span>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="플레이어 이름"
                    style={styles.input}
                />
            </label>

            <button
                onClick={fetchPlayer}
                disabled={loading || !name.trim()}
                style={styles.button}
            >
                {loading ? "Loading..." : "조회"}
            </button>

            {error && <div style={styles.error}>에러: {error}</div>}
      {result !== null && (
        <pre style={styles.result}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        maxWidth: 520,
        margin: "0 auto",
        padding: "24px 16px",
        display: "grid",
        gap: 12,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    title: { margin: 0 },
    field: { display: "grid", gap: 4 },
    label: { fontWeight: 600 },
    select: { padding: "8px 10px" },
    input: { padding: "8px 10px" },
    button: { padding: "10px 12px", cursor: "pointer" },
    error: { color: "#d22", fontWeight: 600 },
    result: {
        background: "#0f172a",
        color: "#cbd5f5",
        padding: 12,
        borderRadius: 8,
        overflowX: "auto",
        fontSize: 13,
    },
};
