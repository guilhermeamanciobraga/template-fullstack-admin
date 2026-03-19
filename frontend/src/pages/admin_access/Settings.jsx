import React, { useState, useEffect } from 'react';
import { Upload, Loader2, Image as ImageIcon, MousePointer2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

const Settings = () => {
    const [images, setImages] = useState({ logo: null, favicon: null });
    const [uploading, setUploading] = useState({ logo: false, favicon: false });
    const { addNotification } = useNotification();

    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await api.get('/admin/system-images');
                const logo = response.data.find(img => img.type === 'logo');
                const favicon = response.data.find(img => img.type === 'favicon');
                setImages({ logo: logo?.url, favicon: favicon?.url });
            } catch (error) {
                console.error("Erro ao carregar imagens do sistema");
            }
        };
        loadImages();
    }, []);

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/admin/system-images/${type}`, formData);
            const newUrl = response.data.url;

            setImages(prev => ({ ...prev, [type]: newUrl }));

            if (type === 'favicon') {
                const link = document.querySelector("link[rel~='icon']");
                if (link) {
                    link.href = newUrl;
                } else {
                    const newLink = document.createElement('link');
                    newLink.rel = 'icon';
                    newLink.href = newUrl;
                    document.head.appendChild(newLink);
                }
            }

            window.dispatchEvent(new CustomEvent('updateSystemLogo', { detail: { type, url: newUrl } }));

            addNotification(`${type === 'logo' ? 'Logomarca' : 'Favicon'} atualizado com sucesso!`, 'success');
        } catch (error) {
            addNotification(`Erro ao atualizar ${type}. Tente novamente.`, 'error');
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <div className="max-w-5xl font-aptos animate-in fade-in duration-700 text-[#113247]">
            <header className="mb-10 text-left">
                <h2 className="text-3xl font-extrabold tracking-tight">Configurações</h2>
                <p className="text-[#334D5C] mt-1 text-lg font-medium opacity-80">Gerencie a identidade visual e parâmetros globais do sistema.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card Logomarca */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 w-full text-left">
                        <div className="p-2 bg-[#E1F1F8] rounded-sm text-[#113247]">
                            <ImageIcon size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Logomarca</h3>
                    </div>

                    <div className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex items-center justify-center mb-8 overflow-hidden">
                        {images.logo ? (
                            <img src={images.logo} className="max-h-full max-w-full p-6 object-contain" alt="Logo" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 opacity-40">
                                <ImageIcon size={40} />
                                <span className="font-black text-xl tracking-tighter uppercase text-red-600">Logomarca</span>
                            </div>
                        )}

                        {uploading.logo && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                <Loader2 className="animate-spin text-[#64E7FA] mb-2" size={32} />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#113247]">Atualizando...</span>
                            </div>
                        )}
                    </div>

                    <label className={`w-full py-4 rounded-sm flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest transition-all shadow-sm
                        ${uploading.logo
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-[#113247] text-white hover:bg-[#0d2738] cursor-pointer active:scale-[0.98]'}`}>
                        {uploading.logo ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {uploading.logo ? 'Processando' : 'Carregar Nova Logo'}
                        <input type="file" className="hidden" disabled={uploading.logo} onChange={(e) => handleUpload(e, 'logo')} accept="image/*" />
                    </label>
                </div>

                {/* Card Favicon */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 w-full text-left">
                        <div className="p-2 bg-[#E1F1F8] rounded-sm text-[#113247]">
                            <MousePointer2 size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Favicon</h3>
                    </div>

                    <div className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex items-center justify-center mb-8 overflow-hidden">
                        <div className="bg-white p-4 shadow-sm rounded-sm border border-gray-100 relative">
                            {images.favicon ? (
                                <img src={images.favicon} className="w-12 h-12 object-contain" alt="Favicon" />
                            ) : (
                                <div className="w-12 h-12 bg-red-50 flex items-center justify-center rounded-sm">
                                    <div className="w-6 h-6 bg-red-200 rounded-full animate-pulse" />
                                </div>
                            )}
                        </div>

                        {uploading.favicon && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                <Loader2 className="animate-spin text-[#64E7FA] mb-2" size={32} />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#113247]">Atualizando...</span>
                            </div>
                        )}
                    </div>

                    <label className={`w-full py-4 rounded-sm flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest transition-all shadow-sm
                        ${uploading.favicon
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-[#113247] text-white hover:bg-[#0d2738] cursor-pointer active:scale-[0.98]'}`}>
                        {uploading.favicon ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {uploading.favicon ? 'Processando' : 'Alterar Favicon'}
                        <input type="file" className="hidden" disabled={uploading.favicon} onChange={(e) => handleUpload(e, 'favicon')} accept="image/*" />
                    </label>
                </div>
            </div>

            <div className="mt-12 p-6 bg-[#E1F1F8]/30 border border-[#B5E9FC]/50 rounded-sm text-left">
                <p className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle size={16} className="text-[#0D6EFD]" />
                    As alterações feitas aqui refletem instantaneamente em todo o sistema.
                </p>
            </div>
        </div>
    );
};

export default Settings;