import { useEffect, useRef } from "react";

declare global {
    interface Window {
        mermaid?: {
            initialize: (config: Record<string, unknown>) => void;
            init: (config: unknown, nodes: Element | Element[]) => void;
        };
    }
}

let mermaidLoadPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
    if (window.mermaid) return Promise.resolve();
    if (mermaidLoadPromise) return mermaidLoadPromise;

    mermaidLoadPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
        script.async = true;
        script.onload = () => {
            try {
                window.mermaid?.initialize({ startOnLoad: false, theme: "dark" });
                resolve();
            } catch (err) {
                reject(err);
            }
        };
        script.onerror = reject;
        document.body.appendChild(script);
    });
    return mermaidLoadPromise;
}

export default function MermaidDiagram({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let cancelled = false;
        loadMermaid()
            .then(() => {
                if (cancelled || !ref.current || !window.mermaid) return;
                ref.current.innerHTML = chart.trim();
                window.mermaid.init(undefined, ref.current);
            })
            .catch((err) => {
                console.error("Mermaid load/render error", err);
            });
        return () => {
            cancelled = true;
        };
    }, [chart]);

    return (
        <div className="mermaid-diagram">
            <div ref={ref} className="mermaid" />
        </div>
    );
}
