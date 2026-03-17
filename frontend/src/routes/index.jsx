import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"

export default function AppRoutes() {
    const isAuthenticated = () => {
        return !!localStorage.getItem('@App:token');
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/home"
                    element={isAuthenticated() ? <Home /> : <Navigate to="/" />}
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}