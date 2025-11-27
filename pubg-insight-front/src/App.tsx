import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./styles/App.css";
import HealthCheck from "./pages/HealthCheck";
import MapPage from "./pages/Map";
import Home from "./pages/Home";
import PlayerSearch from "./pages/tmp/PlayerSearch";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PlayerOverviewPage from "./pages/PlayerOverniewPage";
import SearchHome from "./pages/SearchHome";

export default function App() {
  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/map/:name" element={<MapPage />}></Route>
          <Route path="/map" element={<MapPage />}></Route>
          <Route
            path="/PlayerSearch"
            element={<PlayerSearch></PlayerSearch>}
          ></Route>
          <Route
            path="/HealthCheck"
            element={<HealthCheck></HealthCheck>}
          ></Route>
          <Route path="/search-home" element={<SearchHome />}></Route>
          <Route path="/match-history" element={<PlayerOverviewPage />}></Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}
