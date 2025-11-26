import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import HealthCheck from "./pages/HealthCheck";
import MapPage from "./pages/Map";
import Home from "./pages/Home";
import PlayerSearch from "./pages/tmp/PlayerSearch";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/map/:name" element={<MapPage />}></Route>
          <Route path="/map" element={<MapPage />}></Route>
          <Route path="/PlayerSearch" element={<PlayerSearch></PlayerSearch>}></Route>  
          <Route path="/HealthCheck" element={<HealthCheck></HealthCheck>}></Route>  
        </Routes>
      </BrowserRouter>
    </div>
  );
}
