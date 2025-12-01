import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import HomePage from "./pages/Home";
import MapPage from "./pages/Map";
import MapListPage from "./pages/MapList";
import ProfilePage from "./pages/Profile";
import PinEditorPage from "./pages/PinEditor";
import './styles/app.css'

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/maps" element={<MapListPage />}></Route>
                    <Route path="/map/:name" element={<MapPage />}></Route>
                    <Route path="/profile/:platform/:name" element={<ProfilePage />}></Route>
                    <Route path="/pin-editor" element={<PinEditorPage />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
