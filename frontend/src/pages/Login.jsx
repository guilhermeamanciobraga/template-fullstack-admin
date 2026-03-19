import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useSystemSettings } from '../hooks/useSystemSettings';

const Login = () => {
    const { logoUrl } = useSystemSettings();
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

            if (response.data && response.data.token) {
                localStorage.setItem('@App:token', response.data.token);
                localStorage.setItem('@App:user', JSON.stringify(response.data.user));

                return navigate('/home', { replace: true });
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao conectar ao servidor.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFB]">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 z-20 justify-between shrink-0">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
                    ) : (
                        <span className="text-red-600 font-black text-xl tracking-tighter uppercase">Logomarca</span>
                    )}
                </div>
            </header>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <div className="hidden lg:flex lg:w-1/2 bg-[#E1F1F8] p-16 flex-col justify-center items-center relative">
                    <div className="max-w-xl text-center">
                        <h2 className="text-4xl font-extrabold text-[#113247] mb-6 leading-tight">
                            Sistema padrão - <span className="text-[#0D6EFD]">Node.js / React</span>
                        </h2>
                        <p className="text-lg text-[#334D5C] mb-12 font-medium">
                            Estrutura robusta desenvolvida com tecnologias de ponta para alta performance,
                            segurança de dados e escalabilidade em aplicações Fullstack modernas.
                        </p>
                        <div className="text-[#113247] font-bold text-lg opacity-40 uppercase tracking-widest">
                            v1.0.0
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col relative overflow-hidden bg-white lg:bg-transparent">
                    <div className="flex-1 flex flex-col p-8 md:p-16 justify-center items-center overflow-y-auto">
                        <div className="bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-sm max-w-lg w-full border border-gray-100 mb-10">
                            <h3 className="text-3xl font-extrabold text-[#113247] mb-8">Olá!</h3>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center rounded-sm transition-all">
                                    <AlertCircle className="text-red-500 mr-2" size={20} />
                                    <span className="text-red-700 text-sm font-bold">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#113247] mb-1.5 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border border-[#CED4DA] rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all placeholder-[#90A4AE] font-medium"
                                        placeholder="exemplo@empresa.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-sm font-bold text-[#113247] uppercase tracking-wider">Senha</label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs font-bold text-[#0D6EFD] hover:underline uppercase tracking-tight"
                                        >
                                            Esqueceu sua senha?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full pl-4 pr-12 py-3 border border-[#CED4DA] rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all font-medium"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90A4AE] hover:text-[#334D5C] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" id="remember" className="h-4 w-4 rounded-sm border-[#CED4DA] text-[#0D6EFD] cursor-pointer" />
                                    <label htmlFor="remember" className="ml-2 text-sm text-[#334D5C] font-medium cursor-pointer select-none">
                                        Lembrar deste dispositivo
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-4 rounded-sm transition-all flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {loading ? 'Processando...' : 'Avançar'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <footer className="w-full py-4 bg-white border-t border-gray-100 text-center shrink-0 z-10">
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium px-4">
                            © {new Date().getFullYear()} Todos os direitos reservados. Desenvolvimento: <strong>EBYTE Digital</strong>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Login;