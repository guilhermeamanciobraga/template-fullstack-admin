import React, { createContext, useState, useContext } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [modal, setModal] = useState({ show: false, type: 'info', title: '', message: '', onConfirm: null });
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

    const showModal = (type, title, message, onConfirm = null) => {
        setModal({ show: true, type, title, message, onConfirm });
    };

    const hideModal = () => setModal({ ...modal, show: false, onConfirm: null });

    const handleConfirm = () => {
        if (modal.onConfirm) modal.onConfirm();
        hideModal();
    };

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type, message: '' }), 4000);
    };

    const getToastColors = () => {
        switch (toast.type) {
            case 'success': return { icon: <CheckCircle size={22} className="text-[#52AD5B]" />, title: 'Sucesso' };
            case 'error': return { icon: <XCircle size={22} className="text-[#EF4444]" />, title: 'Erro' };
            default: return { icon: <Info size={22} className="text-[#113247]" />, title: 'Aviso' };
        }
    };

    const toastData = getToastColors();

    return (
        <NotificationContext.Provider value={{ showModal, showToast }}>
            {children}

            {modal.show && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                    <div className="bg-white rounded-sm shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 font-aptos">
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                {modal.type === 'success' && <CheckCircle size={56} className="text-[#52AD5B]" />}
                                {(modal.type === 'danger' || modal.type === 'error') && <XCircle size={56} className="text-[#EF4444]" />}
                                {modal.type === 'warning' && <AlertTriangle size={56} className="text-[#F59E0B]" />}
                                {modal.type === 'question' && <Info size={56} className="text-[#113247]" />}
                            </div>
                            <h3 className="text-xl font-black text-[#113247] mb-2">{modal.title}</h3>
                            <p className="text-[#334D5C] font-medium leading-relaxed">{modal.message}</p>
                        </div>
                        <div className="p-4 bg-gray-50 flex gap-3 justify-center border-t border-gray-100 text-center">
                            {modal.onConfirm ? (
                                <>
                                    <button onClick={hideModal} className="text-gray-400 font-bold py-2.5 px-6 text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">Cancelar</button>
                                    <button onClick={handleConfirm} className="bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-2.5 px-8 rounded-sm transition-all text-xs uppercase tracking-widest">Confirmar</button>
                                </>
                            ) : (
                                <button onClick={hideModal} className="bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-2.5 px-10 rounded-sm transition-all text-xs uppercase tracking-widest">Entendido</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div className="fixed bottom-10 right-10 z-[1000] animate-in slide-in-from-right-full duration-300 font-aptos">
                    <div className="bg-white rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 w-[380px] overflow-hidden">
                        <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-3">
                                {toastData.icon}
                                <span className="font-bold text-[#6B7280] text-base">{toastData.title}</span>
                            </div>
                            <button onClick={() => setToast({ ...toast, show: false })} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} strokeWidth={2} />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-[#1F2937] text-[15px] font-medium leading-relaxed">{toast.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);