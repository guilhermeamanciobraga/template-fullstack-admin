import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Lock } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useLoading } from '../layouts/MainLayout';
import api from '../services/api';

const MyAccount = () => {
    const { showModal, showToast } = useNotification();
    const { setIsLoading } = useLoading();
    const fileInputRef = useRef(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/auth/profile');
                setName(response.data.name);
                setEmail(response.data.email);
                setDataReady(true);
            } catch (err) {
                showModal('error', 'Erro de Conexão', 'Não foi possível carregar seus dados do servidor.');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();

        return () => {
            setIsLoading(false);
        };
    }, [setIsLoading, showModal]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                showToast('success', 'Pré-visualização da foto carregada!');
            };
            reader.readAsDataURL(file);
        }
    };

    const executeSaveProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.put('/auth/profile', { name });
            const localUser = JSON.parse(localStorage.getItem('@App:user'));
            localStorage.setItem('@App:user', JSON.stringify({ ...localUser, name: response.data.user.name }));
            showToast('success', 'Nome atualizado com sucesso!');
        } catch (err) {
            showModal('error', 'Erro', 'Não foi possível atualizar o nome no servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return showModal('error', 'Campo Vazio', 'O nome completo não pode estar em branco.');
        }

        showModal(
            'question',
            'Confirmar Alteração',
            `Deseja realmente alterar seu nome para "${name}"?`,
            executeSaveProfile
        );
    };

    const executeUpdatePassword = async () => {
        setIsLoading(true);
        try {
            await api.put('/auth/profile', {
                currentPassword: passwords.current,
                newPassword: passwords.next
            });
            showToast('success', 'Senha alterada com sucesso!');
            setPasswords({ current: '', next: '', confirm: '' });
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao atualizar senha.';
            showModal('error', 'Falha na Segurança', message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();

        if (!passwords.current || !passwords.next || !passwords.confirm) {
            return showModal('warning', 'Atenção', 'Preencha todos os campos de senha para continuar.');
        }

        if (passwords.next !== passwords.confirm) {
            return showModal('danger', 'Erro de Validação', 'A nova senha e a confirmação não coincidem.');
        }

        showModal(
            'warning',
            'Alterar Senha',
            'Tem certeza que deseja alterar sua senha de acesso?',
            executeUpdatePassword
        );
    };

    if (!dataReady) return null;

    return (
        <div className="max-w-5xl font-aptos animate-in fade-in duration-500">
            <header className="mb-10">
                <h2 className="text-3xl font-extrabold text-[#113247]">Minha Conta</h2>
                <p className="text-[#334D5C] mt-1 text-lg">Atualize suas informações e mantenha sua conta segura.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-8 flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-[#E1F1F8] overflow-hidden bg-gray-50 flex items-center justify-center">
                                {profileImage ? (
                                    <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-[#113247]" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-[#64E7FA] hover:bg-[#B5E9FC] text-[#113247] p-2.5 rounded-full shadow-lg transition-all transform group-hover:scale-110"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <h3 className="mt-6 text-xl font-bold text-[#113247]">{name}</h3>
                        <p className="text-sm text-gray-400 font-medium lowercase italic">{email}</p>

                        <div className="mt-6 w-full pt-6 border-t border-gray-50">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-4">
                                <span className="text-gray-400">Status</span>
                                <span className="text-green-600 font-black">Ativo</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-gray-400">Acesso</span>
                                <span className="text-[#113247]">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSaveProfile} className="bg-white border border-gray-100 shadow-sm rounded-sm">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                            <div className="p-2 bg-[#E1F1F8] rounded-sm text-[#113247]">
                                <User size={18} />
                            </div>
                            <h4 className="font-bold text-[#113247] uppercase text-sm tracking-wider">Informações Pessoais</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome Completo</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-sm text-[#334D5C] font-semibold outline-none focus:border-[#64E7FA] transition-colors"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-50">E-mail (Não editável)</label>
                                <div className="w-full bg-gray-100 border border-gray-200 p-3.5 rounded-sm text-gray-400 font-semibold cursor-not-allowed">
                                    {email}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-[#113247] hover:bg-[#0d2738] text-white font-bold py-3 px-8 rounded-sm transition-all text-xs uppercase tracking-widest">
                                    Salvar Nome
                                </button>
                            </div>
                        </div>
                    </form>

                    <form onSubmit={handleUpdatePassword} className="bg-white border border-gray-100 shadow-sm rounded-sm">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                            <div className="p-2 bg-[#E1F1F8] rounded-sm text-[#113247]">
                                <Lock size={18} />
                            </div>
                            <h4 className="font-bold text-[#113247] uppercase text-sm tracking-wider">Segurança da Conta</h4>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Senha Atual</label>
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-sm text-[#334D5C] font-semibold outline-none focus:border-[#64E7FA]"
                                    placeholder="••••••••"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nova Senha</label>
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-sm text-[#334D5C] font-semibold outline-none focus:border-[#64E7FA]"
                                    value={passwords.next}
                                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-sm text-[#334D5C] font-semibold outline-none focus:border-[#64E7FA]"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end pt-4">
                                <button type="submit" className="bg-[#64E7FA] hover:bg-[#B5E9FC] text-[#113247] font-bold py-3 px-8 rounded-sm transition-all text-xs uppercase tracking-widest">
                                    Atualizar Senha
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;