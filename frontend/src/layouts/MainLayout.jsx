import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LogOut, Home as HomeIcon, ChevronDown, ChevronRight,
    ShieldCheck, User as UserIcon, HelpCircle
} from 'lucide-react';
import api from '../services/api';

const LoadingContext = createContext({ setIsLoading: () => { } });
export const useLoading = () => useContext(LoadingContext);

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({ admin: false });
    const [loading, setLoading] = useState({ active: false, message: 'Carregando Dados...' });
    const [systemLogo, setSystemLogo] = useState(null);

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('@App:user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    });

    const isAdmin = user?.role === 'admin';

    const setIsLoading = useCallback((active, message = 'Carregando Dados...') => {
        setLoading({ active, message });
    }, []);

    const loadSystemImages = async () => {
        try {
            const response = await api.get('/admin/system-images');
            const logo = response.data.find(img => img.type === 'logo');
            const favicon = response.data.find(img => img.type === 'favicon');

            if (logo) setSystemLogo(logo.url);

            if (favicon) {
                const link = document.querySelector("link[rel~='icon']");
                if (link) link.href = favicon.url;
            }
        } catch (error) {
            console.error("Erro ao carregar identidade visual");
        }
    };

    useEffect(() => {
        loadSystemImages();
    }, []);

    useEffect(() => {
        const handleUpdateLogo = (event) => {
            if (event.detail.type === 'logo') {
                setSystemLogo(event.detail.url);
            }
        };

        window.addEventListener('updateSystemLogo', handleUpdateLogo);
        return () => window.removeEventListener('updateSystemLogo', handleUpdateLogo);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const saved = localStorage.getItem('@App:user');
                setUser(saved ? JSON.parse(saved) : null);
            } catch (e) { }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        setProfileMenuOpen(false);
        setIsLoading(false);
        if (location.pathname === '/users' || location.pathname === '/settings') {
            setOpenMenus({ admin: true });
        }
    }, [location, setIsLoading]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const isHomeActive = location.pathname === '/home' && !openMenus.admin;
    const isUsersActive = location.pathname === '/users';
    const isSettingsActive = location.pathname === '/settings';
    const isAdminMenuFocused = openMenus.admin && !isUsersActive && !isSettingsActive;

    return (
        <LoadingContext.Provider value={{ setIsLoading }}>
            <div className="h-screen bg-[#F8FAFB] flex flex-col overflow-hidden relative font-aptos text-[#113247]">

                {loading.active && (
                    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
                        <div className="w-12 h-12 border-4 border-[#E1F1F8] border-t-[#64E7FA] rounded-full animate-spin"></div>
                        <span className="mt-4 font-bold text-sm tracking-widest text-[#113247]">
                            {loading.message}
                        </span>
                    </div>
                )}

                <header className="h-20 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border-b border-gray-100 flex items-center px-8 z-30 justify-between shrink-0">
                    <div className="cursor-pointer" onClick={() => navigate('/home')}>
                        {systemLogo ? (
                            <img src={systemLogo} alt="Logo" className="h-10 w-auto" />
                        ) : (
                            <span className="text-red-600 font-black text-xl tracking-tighter">LOGOMARCA</span>
                        )}
                    </div>

                    <div className="relative">
                        <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm cursor-pointer transition-all">
                            <div className="flex flex-col items-end hidden md:flex text-right">
                                <span className="text-sm font-bold leading-tight">{user?.name || 'Usuário'}</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Ativo</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#E1F1F8] flex items-center justify-center border border-gray-100 text-[#113247] overflow-hidden">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={20} />
                                )}
                            </div>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {profileMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 shadow-2xl rounded-sm z-40 py-1">
                                    <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#334D5C] hover:bg-gray-50 transition-colors">
                                        <UserIcon size={16} className="text-gray-400" /> Perfil
                                    </button>
                                    <button onClick={() => navigate('/ajuda')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#334D5C] hover:bg-gray-50 transition-colors">
                                        <HelpCircle size={16} className="text-gray-400" /> Ajuda
                                    </button>
                                    <div className="border-t border-gray-50 mt-1 pt-1">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#EF4444] hover:bg-red-50 transition-colors font-bold">
                                            <LogOut size={16} /> Sair do Sistema
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-72 bg-[#113247] flex flex-col shrink-0 z-20">
                        <nav className="flex-1 mt-6 space-y-1 overflow-y-auto px-0 text-gray-400">
                            <button
                                onClick={() => {
                                    setOpenMenus({ admin: false });
                                    navigate('/home');
                                }}
                                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4 ${isHomeActive ? 'bg-white/10 text-white border-[#64E7FA]' : 'border-transparent hover:text-white hover:bg-white/5'}`}
                            >
                                <HomeIcon size={18} /> <span>Home</span>
                            </button>

                            {isAdmin && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => toggleMenu('admin')}
                                        className={`w-full flex items-center justify-between hover:text-white px-6 py-4 text-sm font-bold transition-colors border-l-4 ${isAdminMenuFocused ? 'bg-white/10 text-white border-[#64E7FA]' : 'border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck size={18} /> <span>Administração</span>
                                        </div>
                                        {openMenus.admin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenus.admin ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="bg-[#0d2738]/50">
                                            <button
                                                onClick={() => navigate('/users')}
                                                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold hover:text-white hover:bg-white/5 pl-14 text-left transition-all border-l-4 ${isUsersActive ? 'text-white border-[#64E7FA] bg-white/5' : 'border-transparent'}`}
                                            >
                                                Gerenciar Usuários
                                            </button>
                                            <button
                                                onClick={() => navigate('/settings')}
                                                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold hover:text-white hover:bg-white/5 pl-14 text-left transition-all border-l-4 ${isSettingsActive ? 'text-white border-[#64E7FA] bg-white/5' : 'border-transparent'}`}
                                            >
                                                Configurações
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </nav>

                        <div className="p-6 border-t border-white/5 bg-[#0d2738] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#E1F1F8] flex items-center justify-center text-[#113247] border border-[#64E7FA]/20 overflow-hidden">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={24} />
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden text-left">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-tight">SISTEMA ATIVO</span>
                                    <span className="text-lg font-bold text-white truncate leading-tight">{user?.name?.split(' ')[0] || 'Admin'}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        <main className="flex-1 overflow-y-auto p-8 md:p-12 pb-24">
                            <Outlet />
                        </main>
                        <footer className="w-full py-4 bg-white border-t border-gray-100 text-center shrink-0 z-10">
                            <p className="text-[10px] md:text-xs text-gray-400 font-medium px-4">
                                © {new Date().getFullYear()} Todos os direitos reservados.
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </LoadingContext.Provider>
    );
};

export default MainLayout;