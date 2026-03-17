import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, User as UserIcon, Home as HomeIcon,
    Settings, Users, ChevronDown, ChevronRight,
    BarChart3, ShieldCheck
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({ admin: true }); // Controle dos submenus
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
            {/* Header Padrão */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 z-20 justify-between shrink-0">
                <span className="text-2xl font-bold text-black tracking-tight">Sua Logo</span>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[#113247]">{user?.name}</p>
                            <p className="text-[10px] text-[#0D6EFD] font-bold uppercase tracking-widest">{user?.role}</p>
                        </div>
                        <div className="bg-[#E1F1F8] p-2 rounded-sm text-[#113247]">
                            <UserIcon size={20} />
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-[#334D5C] hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Profissional */}
                <aside className="w-72 bg-[#113247] flex flex-col shrink-0">
                    <nav className="flex-1 mt-6 px-4 space-y-1">

                        {/* Item Simples: Home */}
                        <a href="#" className="flex items-center gap-3 text-white bg-[#0D6EFD]/10 border-l-4 border-[#0D6EFD] px-4 py-3 rounded-r-sm text-sm font-semibold">
                            <HomeIcon size={18} />
                            Home
                        </a>

                        {/* Menu com Cascata: Administração */}
                        <div className="pt-4">
                            <button
                                onClick={() => toggleMenu('admin')}
                                className="w-full flex items-center justify-between text-gray-400 hover:text-white px-4 py-3 text-sm font-medium transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} />
                                    <span>Administração</span>
                                </div>
                                {openMenus.admin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {/* Submenus */}
                            {openMenus.admin && (
                                <div className="ml-9 mt-1 space-y-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white rounded-sm transition-colors">
                                        Gerenciar Usuários
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white rounded-sm transition-colors">
                                        Configurações
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white rounded-sm transition-colors">
                                        Logs do Sistema
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Outra Categoria */}
                        <div className="pt-2">
                            <button
                                onClick={() => toggleMenu('reports')}
                                className="w-full flex items-center justify-between text-gray-400 hover:text-white px-4 py-3 text-sm font-medium transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <BarChart3 size={18} />
                                    <span>Relatórios</span>
                                </div>
                                {openMenus.reports ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        </div>
                    </nav>

                    <div className="p-6 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Suporte</p>
                        <a href="#" className="block mt-2 text-xs text-gray-400 hover:text-white transition-colors">Central de Ajuda</a>
                    </div>
                </aside>

                {/* Área de Conteúdo */}
                <main className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-5xl">
                        <header className="mb-8 border-b border-gray-200 pb-6">
                            <h2 className="text-3xl font-extrabold text-[#113247]">Home</h2>
                            <p className="text-[#334D5C] mt-1">Visão geral do sistema e atividades recentes.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Cards de métricas discretos */}
                            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usuários Ativos</p>
                                <p className="text-2xl font-bold text-[#113247] mt-1">1,240</p>
                            </div>
                            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sessões Hoje</p>
                                <p className="text-2xl font-bold text-[#113247] mt-1">482</p>
                            </div>
                            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status do Server</p>
                                <p className="text-2xl font-bold text-green-500 mt-1 italic">Online</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 shadow-sm rounded-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-[#113247] mb-4">Bem-vindo de volta!</h3>
                            <p className="text-[#334D5C] leading-relaxed">
                                Você está no ambiente administrativo do seu template. Use o menu lateral para navegar entre as seções.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;