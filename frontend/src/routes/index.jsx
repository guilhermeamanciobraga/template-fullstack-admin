import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import Login from "../pages/Login"
import MyAccount from "../pages/MyAccount"

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('@App:token');
    return token ? children : <Navigate to="/" replace />;
};

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<MyAccount />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}