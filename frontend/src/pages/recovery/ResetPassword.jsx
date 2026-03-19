import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import logoImg from '../../assets/logo2.png';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [localError, setLocalError] = useState('');

    const token = searchParams.get('token');

    async function handleSubmit(e) {
        e.preventDefault();
        setLocalError('');

        if (password.length < 6) {
            const msg = 'A senha deve ter no mínimo 6 caracteres';
            setLocalError(msg);
            addNotification(msg, 'error');
            return;
        }

        if (password !== confirmPassword) {
            const msg = 'As senhas digitadas não são iguais';
            setLocalError(msg);
            addNotification(msg, 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/reset-password', { token, password });

            setIsSuccess(true);
            addNotification(response.data.message || 'Senha alterada!', 'success');

            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            const message = error.response?.data?.message || 'Erro ao redefinir senha. O link pode ter expirado.';
            setLocalError(message);
            addNotification(message, 'error');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFB]">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 z-20 shrink-0">
                <img src={logoImg} alt="Logo" className="h-10 w-auto" />
            </header>

            <div className="flex flex-1 justify-center items-center p-8">
                <div className="bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-sm max-w-lg w-full border border-gray-100">
                    <h3 className="text-3xl font-extrabold text-[#113247] mb-2">Nova Senha</h3>

                    {isSuccess ? (
                        <div className="py-4 text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="text-green-500" size={60} />
                            </div>
                            <p className="text-[#334D5C] font-bold mb-2 text-xl">Senha Redefinida!</p>
                            <p className="text-sm text-gray-500 mb-8">
                                Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes.
                            </p>
                            <Link
                                to="/"
                                className="inline-block bg-[#113247] text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-[#0d2738] transition-all"
                            >
                                Ir para Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-[#334D5C] mb-8 font-medium">
                                Crie uma senha segura com pelo menos 6 caracteres para acessar o sistema.
                            </p>

                            {localError && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center rounded-sm">
                                    <AlertCircle className="text-red-500 mr-2" size={20} />
                                    <span className="text-red-700 text-sm font-bold">{localError}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#113247] mb-1.5 uppercase tracking-wider">
                                        Nova Senha
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 border border-[#CED4DA] rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all placeholder-[#90A4AE] font-medium"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (localError) setLocalError('');
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#113247] mb-1.5 uppercase tracking-wider">
                                        Confirmar Senha
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 border border-[#CED4DA] rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all placeholder-[#90A4AE] font-medium"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (localError) setLocalError('');
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-4 rounded-sm transition-all flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                            Salvando...
                                        </>
                                    ) : 'Redefinir Senha'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <footer className="w-full py-4 bg-white border-t border-gray-100 text-center shrink-0">
                <p className="text-[10px] md:text-xs text-gray-400 font-medium px-4">
                    © {new Date().getFullYear()} Todos os direitos reservados. Desenvolvimento: <strong>EBYTE Digital</strong>
                </p>
            </footer>
        </div>
    );
}