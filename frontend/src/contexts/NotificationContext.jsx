import React, { createContext, useState, useContext } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [modal, setModal] = useState({ show: false, type: 'info', title: '', message: '' });
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

    const showModal = (type, title, message) => {
        setModal({ show: true, type, title, message });
    };

    const hideModal = () => setModal({ ...modal, show: false });

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type, message: '' }), 3000);
    };

    return (
        <NotificationContext.Provider value={{ showModal, showToast }}>
            {children}

            {modal.show && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-sm shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                                {modal.type === 'success' && <CheckCircle size={48} className="text-green-500" />}
                                {modal.type === 'danger' && <XCircle size={48} className="text-red-500" />}
                                {modal.type === 'warning' && <AlertTriangle size={48} className="text-yellow-500" />}
                                {modal.type === 'error' && <XCircle size={48} className="text-red-600" />}
                            </div>
                            <h3 className="text-xl font-black text-[#113247] mb-2">{modal.title}</h3>
                            <p className="text-[#334D5C] font-medium">{modal.message}</p>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-center">
                            <button
                                onClick={hideModal}
                                className="bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-2 px-8 rounded-sm transition-all text-xs uppercase tracking-widest"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div className="fixed bottom-8 right-8 z-[1000] animate-in slide-in-from-right duration-300">
                    <div className={`flex items-center gap-3 p-4 rounded-sm shadow-lg border-l-4 min-w-[300px] ${toast.type === 'success' ? 'bg-white border-green-500 text-green-800' : 'bg-white border-red-500 text-red-800'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span className="font-bold text-sm tracking-wide">{toast.message}</span>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);