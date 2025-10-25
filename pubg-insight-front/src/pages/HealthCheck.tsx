import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/App.css";

type LogLine = { t: string; ok: boolean; msg: string };

const HEALTH_URL = "https://api.pubginfohub.com/healthcheck";
const INTERVAL_MS = 10_000;

export default function HealthCheck() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const timer = useRef<number | null>(null);
  const started = useRef(false); // StrictMode 중복 방지

  const check = useCallback(async () => {
    try {
      const r = await fetch(HEALTH_URL, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const ctype = r.headers.get("content-type") || "";
      const body = ctype.includes("application/json") ? JSON.stringify(await r.json()) : await r.text();
      const t = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, { t, ok: true, msg: `OK (${body})` }]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      const t = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, { t, ok: false, msg: `FAIL (${message})` }]);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    check();
    timer.current = window.setInterval(check, INTERVAL_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [check]);

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Server Health Monitor ({INTERVAL_MS / 1000}s)</h1>
      <div style={styles.toolbar}>
        <span>Target: <code>{HEALTH_URL}</code></span>
        <button style={styles.btn} onClick={check}>Run now</button>
        <button style={styles.btn} onClick={() => setLogs([])}>Clear</button>
      </div>
      <div style={styles.log} aria-live="polite">
        {logs.map((l, i) => (
          <div key={i}>
            <span style={styles.time}>[{l.t}] </span>
            <span style={l.ok ? styles.ok : styles.fail}>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", background: "#0b0b0b", color: "#0f0", height: "100dvh", width: "100%", boxSizing: "border-box", padding: "12px 16px", display: "flex", flexDirection: "column", overflow: "hidden" },
  h1: { color: "#0f0", fontSize: 20, margin: "0 0 12px" },
  toolbar: { display: "flex", gap: 12, alignItems: "center", margin: "0 0 12px", flexWrap: "wrap" },
  btn: { background: "#111", color: "#0f0", border: "1px solid #333", padding: "6px 10px", cursor: "pointer" },
  log: { border: "1px solid #333", background: "#111", padding: 10, overflowY: "auto", flex: 1, minHeight: 0 },
  time: { color: "#888" },
  ok: { color: "#0f0" },
  fail: { color: "#f33" },
};
