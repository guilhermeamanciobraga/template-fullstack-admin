import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Home as HomeIcon,
    ChevronDown, ChevronRight,
    BarChart3, ShieldCheck
} from 'lucide-react';
import logoImg from '../assets/logo2.png';

const Home = () => {
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({ admin: true });
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
        <div className="min-h-screen bg-[#F8FAFB] font-sans flex flex-col">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 z-20 justify-between shrink-0">
                <img src={logoImg} alt="Logo" className="h-10 w-auto" />

                <button onClick={handleLogout} className="text-[#334D5C] hover:text-red-600 transition-colors cursor-pointer flex items-center gap-2 font-semibold text-sm">
                    <LogOut size={20} />
                    Sair
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 bg-[#113247] flex flex-col shrink-0">
                    <nav className="flex-1 mt-6 px-4 space-y-1">
                        <a href="#" className="flex items-center gap-3 text-white bg-[#0D6EFD]/10 border-l-4 border-[#0D6EFD] px-4 py-3 rounded-r-sm text-sm font-semibold">
                            <HomeIcon size={18} />
                            Home
                        </a>

                        <div className="pt-4">
                            <button
                                onClick={() => toggleMenu('admin')}
                                className="w-full flex items-center justify-between text-gray-400 hover:text-white px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} />
                                    <span>Administração</span>
                                </div>
                                {openMenus.admin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {openMenus.admin && (
                                <div className="ml-9 mt-1 space-y-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white rounded-sm transition-colors">
                                        Gerenciar Usuários
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white rounded-sm transition-colors">
                                        Configurações
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => toggleMenu('reports')}
                                className="w-full flex items-center justify-between text-gray-400 hover:text-white px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <BarChart3 size={18} />
                                    <span>Relatórios</span>
                                </div>
                                {openMenus.reports ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        </div>
                    </nav>

                    <div className="p-6 border-t border-white/10 bg-[#0d2738]">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src="https://github.com/shadcn.png"
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full border-2 border-[#E1F1F8]/20"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#113247] rounded-full"></div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">BEM-VINDO:</span>
                                <span className="text-sm font-bold text-white truncate">{user?.name || 'Guilherme A. Braga'}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Suporte</p>
                            <a href="#" className="block mt-1 text-xs text-gray-400 hover:text-white transition-colors">Central de Ajuda</a>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-5xl">
                        <header className="border-b border-gray-200 pb-6">
                            <h2 className="text-3xl font-extrabold text-[#113247]">Home</h2>
                            <p className="text-[#334D5C] mt-1 text-lg">
                                Olá <strong>{user?.name?.split(' ')[0]}</strong>, você está logado com sucesso!
                            </p>
                        </header>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;