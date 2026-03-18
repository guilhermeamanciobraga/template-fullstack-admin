import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import Login from "../pages/Login"
import MyAccount from "../pages/MyAccount"
import Help from "../pages/Help"
import Users from "../pages/admin_access/Users"
import Settings from "../pages/admin_access/Settings"

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('@App:token');
    return token ? children : <Navigate to="/" replace />;
};

const AdminRoute = () => {
    const user = JSON.parse(localStorage.getItem('@App:user') || '{}');
    return user.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />;
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
                    <Route path="/ajuda" element={<Help />} />

                    <Route element={<AdminRoute />}>
                        <Route path="/users" element={<Users />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}