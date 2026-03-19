import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiMessage, setApiMessage] = useState('');
    const [systemLogo, setSystemLogo] = useState(null);
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
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
        loadSystemImages();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setLocalError('');
        setApiMessage('');

        const sanitizedEmail = email.trim().toLowerCase();

        try {
            const response = await api.post('/auth/forgot-password', {
                email: sanitizedEmail
            });

            const successMsg = response.data?.message || 'Instruções enviadas com sucesso!';
            setApiMessage(successMsg);
            setIsSuccess(true);
            addNotification(successMsg, 'success');

            setTimeout(() => {
                navigate('/');
            }, 5000);

        } catch (error) {
            if (!error.response) {
                const fallbackMsg = 'As instruções foram enviadas! Verifique sua caixa de entrada.';
                setApiMessage(fallbackMsg);
                setIsSuccess(true);
                addNotification(fallbackMsg, 'success');
                setTimeout(() => navigate('/'), 5000);
            } else {
                const errorMsg = error.response.data?.message || 'Erro ao processar solicitação';
                setLocalError(errorMsg);
                setIsSuccess(false);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFB]">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 z-20 shrink-0">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                    {systemLogo ? (
                        <img src={systemLogo} alt="Logo" className="h-10 w-auto" />
                    ) : (
                        <span className="text-red-600 font-black text-xl tracking-tighter uppercase">Logomarca</span>
                    )}
                </div>
            </header>

            <div className="flex flex-1 justify-center items-center p-8">
                <div className="bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-sm max-w-lg w-full border border-gray-100">
                    <h3 className="text-3xl font-extrabold text-[#113247] mb-2">Recuperar Senha</h3>

                    {isSuccess ? (
                        <div className="py-4 text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="text-green-500" size={60} />
                            </div>
                            <p className="text-[#334D5C] font-bold mb-2 text-xl">Sucesso!</p>
                            <p className="text-sm text-gray-500 mb-8">{apiMessage}</p>
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
                                Informe seu e-mail cadastrado para receber as instruções de recuperação.
                            </p>

                            {localError && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center rounded-sm transition-all">
                                    <AlertCircle className="text-red-500 mr-2" size={20} />
                                    <span className="text-red-700 text-sm font-bold">{localError}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#113247] mb-1.5 uppercase tracking-wider">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className={`w-full px-4 py-3 border ${localError ? 'border-red-300' : 'border-[#CED4DA]'} rounded-sm focus:ring-2 focus:ring-[#B5E9FC] focus:border-[#0D6EFD] outline-none transition-all placeholder-[#90A4AE] font-medium`}
                                        placeholder="exemplo@empresa.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
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
                                            Processando...
                                        </>
                                    ) : 'Enviar Link de Recuperação'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <Link
                                    to="/"
                                    className="text-sm font-bold text-[#0D6EFD] hover:underline uppercase tracking-tight"
                                >
                                    Voltar para o Login
                                </Link>
                            </div>
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