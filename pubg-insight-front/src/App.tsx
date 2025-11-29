import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "./pages/Map";
import './styles/app.css'

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<></>}></Route>
                    <Route path="/map/:name" element={<MapPage />}></Route>
                    <Route path="/map" element={<MapPage />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
