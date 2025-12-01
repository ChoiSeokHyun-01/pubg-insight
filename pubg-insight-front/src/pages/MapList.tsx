import { Link } from "react-router-dom";
import "../styles/map-list.css";

type MapCard = {
  key: string;
  label: string;
  to: string;
};

const MAPS: MapCard[] = [
  { key: "erangel", label: "에란겔", to: "/map/erangel" },
  { key: "miramar", label: "미라마", to: "/map/miramar" },
  { key: "sanhok", label: "사녹", to: "/map/sanhok" },
  { key: "vikendi", label: "비켄디", to: "/map/vikendi" },
  { key: "taego", label: "태이고", to: "/map/taego" },
  { key: "deston", label: "데스턴", to: "/map/deston" },
  { key: "rondo", label: "론도", to: "/map/rondo" },
  { key: "paramo", label: "파라모", to: "/map/paramo" },
  { key: "karakin", label: "카라킨", to: "/map/karakin" },
];

export default function MapList() {
  return (
    <main className="map-list-page">
      <div className="map-list__container">
        <header className="map-list__header">
          <h1>맵 선택</h1>
          <p>확대해서 볼 맵을 선택하세요.</p>
        </header>
        <div className="map-list__grid">
          {MAPS.map((m) => (
            <Link key={m.key} to={m.to} className="map-card">
              <div
                className="map-card__thumb"
                style={{ backgroundImage: `url(/map/${m.key}/0/0.png)` }}
                aria-label={`${m.label} 미리보기`}
              />
              <div className="map-card__label">{m.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
