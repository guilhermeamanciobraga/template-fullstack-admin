import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
    LogOut, Home as HomeIcon, ChevronDown, ChevronRight,
    BarChart3, ShieldCheck, User as UserIcon, Star, HelpCircle
} from 'lucide-react';
import logoImg from '../assets/logo2.png';

const MainLayout = () => {
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({ admin: true });
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('@App:user'));

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleLogout = () => {
        localStorage.removeItem('@App:token');
        localStorage.removeItem('@App:user');
        navigate('/');
    };

    return (
        <div className="h-screen bg-[#F8FAFB] flex flex-col overflow-hidden">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 z-30 justify-between shrink-0">
                <Link to="/home">
                    <img src={logoImg} alt="Logo" className="h-10 w-auto cursor-pointer" />
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-sm transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-sm font-bold text-[#113247] leading-tight">
                                {user?.name || 'Guilherme A. Braga'}
                            </span>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Ativo</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#113247] border border-gray-200">
                            <UserIcon size={20} />
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 shadow-xl rounded-sm z-40 py-1">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334D5C] hover:bg-gray-50 transition-colors"
                                >
                                    <UserIcon size={16} className="text-gray-400" /> Perfil
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334D5C] hover:bg-gray-50 transition-colors">
                                    <HelpCircle size={16} className="text-gray-400" /> Ajuda
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334D5C] hover:bg-gray-50 transition-colors">
                                    <Star size={16} className="text-gray-400" /> Favoritar Tela
                                </button>
                                <div className="border-t border-gray-50 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334D5C] hover:bg-gray-50 transition-colors"
                                    >
                                        <LogOut size={16} className="text-gray-400" /> Sair
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 bg-[#113247] flex flex-col shrink-0 z-20">
                    <nav className="flex-1 mt-6 space-y-1 overflow-y-auto">
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <HomeIcon size={18} /> <span>Home</span>
                        </button>

                        <div className="pt-2">
                            <button
                                onClick={() => toggleMenu('admin')}
                                className="w-full flex items-center justify-between text-gray-400 hover:text-white px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} /> <span>Administração</span>
                                </div>
                                {openMenus.admin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            {openMenus.admin && (
                                <div className="mt-1">
                                    <button onClick={() => navigate('/users')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 pl-9">Gerenciar Usuários</button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 pl-9">Configurações</button>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className="p-6 border-t border-white/10 bg-[#0d2738] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-[#E1F1F8]/20 bg-[#E1F1F8] flex items-center justify-center text-[#113247]">
                                <UserIcon size={20} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">USUÁRIO</span>
                                <span className="text-sm font-bold text-white truncate">{user?.name || 'Guilherme A. Braga'}</span>
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
                            © {new Date().getFullYear()} Todos os direitos reservados. Desenvolvimento: <strong>EBYTE Digital</strong> | CNPJ: 52.168.219/0001-06
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;