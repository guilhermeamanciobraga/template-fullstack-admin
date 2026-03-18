import React, { useState, useEffect } from 'react';
import { MessageCircle, FileText, ShieldCheck, Zap, Send } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useLoading } from '../layouts/MainLayout';

const Help = () => {
    const { showToast } = useNotification();
    const { setIsLoading } = useLoading();
    const user = JSON.parse(localStorage.getItem('@App:user'));
    const [message, setMessage] = useState('');

    useEffect(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    const faqs = [
        {
            icon: <Zap size={20} />,
            title: "Primeiros Passos",
            text: "Aprenda a navegar pelo dashboard e utilizar as funções básicas do painel administrativo."
        },
        {
            icon: <ShieldCheck size={20} />,
            title: "Segurança",
            text: "Dicas de como manter sua conta segura e como proceder na alteração de senhas críticas."
        },
        {
            icon: <FileText size={20} />,
            title: "Relatórios",
            text: "Entenda como exportar os dados de usuários e logs de atividades do sistema."
        }
    ];

    const handleWhatsAppSupport = (e) => {
        e.preventDefault();

        setIsLoading(true, 'Redirecionando...');

        const phoneNumber = "5500000000000";
        const text = `Olá Suporte! Me chamo ${user?.name}. \n\nAssunto: Solicitação de Ajuda\nProblema: ${message}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

        setTimeout(() => {
            window.open(url, '_blank');
            setIsLoading(false);
            showToast('success', 'Redirecionando para o WhatsApp...');
        }, 1200);
    };

    return (
        <div className="max-w-5xl font-aptos">
            <header className="mb-12">
                <h2 className="text-3xl font-extrabold text-[#113247]">Central de Ajuda</h2>
                <p className="text-[#334D5C] mt-1 text-lg">Encontre soluções rápidas ou entre em contato com nosso time.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-[#E1F1F8] text-[#113247] flex items-center justify-center rounded-sm mb-4 border border-[#64E7FA]/20">
                            {faq.icon}
                        </div>
                        <h4 className="font-bold text-[#113247] mb-2 uppercase text-xs tracking-wider">{faq.title}</h4>
                        <p className="text-sm text-[#334D5C] leading-relaxed">{faq.text}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-[#64E7FA] rounded-sm text-[#113247]">
                        <MessageCircle size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#113247] uppercase text-sm tracking-wider">Falar com Suporte</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resposta via WhatsApp</p>
                    </div>
                </div>

                <form onSubmit={handleWhatsAppSupport} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seu Nome</label>
                            <input
                                type="text"
                                disabled
                                className="w-full bg-gray-100 border border-gray-200 p-3.5 rounded-sm text-gray-400 font-semibold cursor-not-allowed"
                                value={user?.name || ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seu E-mail</label>
                            <input
                                type="text"
                                disabled
                                className="w-full bg-gray-100 border border-gray-200 p-3.5 rounded-sm text-gray-400 font-semibold cursor-not-allowed"
                                value={user?.email || ''}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Como podemos ajudar?</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-sm text-[#334D5C] font-semibold outline-none focus:border-[#64E7FA] transition-colors resize-none"
                            placeholder="Descreva brevemente sua dúvida ou problema..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-3 bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-4 px-10 rounded-sm transition-all text-xs uppercase tracking-widest shadow-lg shadow-gray-200"
                        >
                            <Send size={16} />
                            Iniciar Conversa no WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Help;