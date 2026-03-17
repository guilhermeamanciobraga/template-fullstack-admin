import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../services/api';
import logoImg from '../assets/logo2.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('@App:token', response.data.token);
                localStorage.setItem('@App:user', JSON.stringify(response.data.user));
                navigate('/home');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao conectar ao servidor. Verifique sua conexão.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 md:px-16 z-10">
                <img src={logoImg} alt="Logo" className="h-10 w-auto" />
            </header>

            <div className="flex flex-1">
                <div className="hidden lg:flex lg:w-1/2 bg-[#E1F1F8] p-16 flex-col justify-center items-center">
                    <div className="max-w-xl text-center">
                        <h2 className="text-4xl font-extrabold text-[#113247] mb-6 leading-tight">
                            Sistema padrão - <span className="text-[#0D6EFD]">Node.js / React</span>
                        </h2>
                        <p className="text-lg text-[#334D5C] mb-12">
                            Estrutura robusta desenvolvida com tecnologias de ponta para alta performance,
                            segurança de dados e escalabilidade em aplicações Fullstack modernas.
                        </p>

                        <div className="mt-20 text-[#113247] font-semibold text-lg opacity-60">
                            v1.0.0
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 bg-[#F8FAFB] flex flex-col p-8 md:p-16 justify-center">
                    <div className="bg-white p-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-sm max-w-lg mx-auto w-full border border-gray-50">
                        <h3 className="text-3xl font-extrabold text-[#113247] mb-8">Olá!</h3>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center rounded-sm">
                                <AlertCircle className="text-red-500 mr-2" size={20} />
                                <span className="text-red-700 text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#334D5C] mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border border-[#CED4DA] rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all placeholder-[#90A4AE]"
                                    placeholder="exemplo@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-semibold text-[#334D5C]">Senha</label>
                                    <a href="#" className="text-sm font-semibold text-[#0D6EFD] hover:underline">
                                        Esqueceu sua senha?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-4 pr-12 py-3 border border-[#CED4DA] rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90A4AE] hover:text-[#334D5C]"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="h-4 w-4 rounded-sm border-[#CED4DA] text-[#0D6EFD] cursor-pointer" />
                                <label htmlFor="remember" className="ml-2 text-sm text-[#334D5C] cursor-pointer select-none">
                                    Lembrar deste dispositivo por 14 dias
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#113247] hover:bg-[#081b26] text-white font-bold py-3.5 rounded-sm transition-colors flex items-center justify-center disabled:bg-[#CED4DA]"
                            >
                                {loading ? 'Aguarde...' : 'Avançar'}
                            </button>
                        </form>
                    </div>

                    <footer className="mt-8 text-center text-xs text-gray-400">
                        <p>© 2026 Todos os direitos reservados.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Login;