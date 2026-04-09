import React, { useState, useEffect, useCallback } from 'react';
import {
    Users as UsersIcon, UserPlus, Search, Key,
    Trash2, UserCheck, UserX, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { useLoading } from '../../layouts/MainLayout';
import { useNotification } from '../../contexts/NotificationContext';

const Users = () => {
    const { setIsLoading } = useLoading();
    const { showToast, showModal } = useNotification();
    const currentUser = JSON.parse(localStorage.getItem('@SIG:user'));

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'common_user'
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const fetchUsers = useCallback(async () => {
        try {
            if (users.length === 0) setIsLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            showToast('error', 'Erro ao buscar usuários do servidor.');
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, showToast, users.length]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            return showToast('error', 'A senha deve conter no mínimo 6 caracteres.');
        }
        try {
            setIsLoading(true, 'Cadastrando...');
            await api.post('/admin/users', formData);
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'common_user' });
            showToast('success', 'Usuário cadastrado com sucesso!');
            fetchUsers();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Erro ao cadastrar novo usuário.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword.length < 6) {
            return showToast('error', 'A nova senha deve conter no mínimo 6 caracteres.');
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return showToast('error', 'As senhas digitadas não são iguais.');
        }
        try {
            setIsLoading(true, 'Atualizando senha...');
            await api.patch(`/admin/users/${selectedUser.id}/password`, {
                password: passwordData.newPassword
            });
            showToast('success', 'Senha atualizada com sucesso!');
            setIsPasswordModalOpen(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            showToast('error', error.response?.data?.error || "Erro ao atualizar senha.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRole = async (user, newRole) => {
        try {
            setIsLoading(true, 'Atualizando cargo...');
            await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
            showToast('success', 'Nível de acesso atualizado!');
            fetchUsers();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Erro ao atualizar cargo.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUserStatus = (user) => {
        const action = user.active ? 'desativar' : 'ativar';
        showModal(
            'warning',
            'Confirmar alteração',
            `Deseja realmente ${action} este usuário?`,
            async () => {
                try {
                    setIsLoading(true, 'Processando...');
                    await api.patch(`/admin/users/${user.id}/status`, { active: !user.active });
                    showToast('success', `Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso.`);
                    fetchUsers();
                } catch (error) {
                    showToast('error', error.response?.data?.error || "Erro ao alterar status.");
                } finally {
                    setIsLoading(false);
                }
            }
        );
    };

    const deleteUser = (id) => {
        showModal(
            'danger',
            'Excluir Usuário',
            'Esta ação é irreversível. Deseja continuar com a exclusão?',
            async () => {
                try {
                    setIsLoading(true, 'Excluindo...');
                    await api.delete(`/admin/users/${id}`);
                    showToast('success', 'Usuário removido com sucesso.');
                    fetchUsers();
                } catch (error) {
                    showToast('error', error.response?.data?.error || "Erro ao excluir usuário.");
                } finally {
                    setIsLoading(false);
                }
            }
        );
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length
    };

    return (
        <div className="max-w-6xl font-aptos animate-in fade-in duration-500">
            <header className="mb-8">
                <h2 className="text-3xl font-extrabold text-[#113247]">Gerenciar Usuários</h2>
                <p className="text-[#334D5C] mt-1 text-lg">Administre as contas, permissões e acessos do sistema.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E1F1F8] text-[#113247] rounded-full flex items-center justify-center">
                        <UsersIcon size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-black text-[#113247]">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Ativos</p>
                        <p className="text-2xl font-black text-green-600">{stats.active}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <UserX size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Inativos</p>
                        <p className="text-2xl font-black text-red-600">{stats.inactive}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Buscar usuário por nome ou e-mail..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#64E7FA] transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#113247] hover:bg-[#1a4a69] text-white px-6 py-2.5 rounded-sm font-bold text-sm transition-all"
                    >
                        <UserPlus size={18} /> Novo Usuário
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[#113247] text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4 w-16 text-center">ID</th>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Função</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.map(user => {
                                const isSelf = user.id === currentUser?.id;
                                const isMaster = user.id === 1;

                                return (
                                    <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors text-sm ${isSelf ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-6 py-4 text-center font-mono text-gray-400 text-xs">#{user.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#E1F1F8] flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL}/files/${user.avatar}`}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[#113247] font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#113247]">
                                                        {user.name}
                                                        {isSelf && <span className="ml-2 text-[9px] bg-[#113247] text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Você</span>}
                                                    </span>
                                                    <span className="text-gray-400 text-[11px] italic leading-tight">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-[#334D5C]">
                                                <Shield size={14} className={user.role === 'admin' ? "text-[#64E7FA]" : "text-gray-300"} />
                                                <select
                                                    value={user.role}
                                                    disabled={isMaster}
                                                    onChange={(e) => handleUpdateRole(user, e.target.value)}
                                                    className="bg-transparent font-medium border-none focus:ring-0 p-0 text-sm cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    <option value="common_user">Usuário Comum</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedUser(user); setIsPasswordModalOpen(true); }}
                                                    title={isMaster && !isSelf ? "Bloqueado" : "Trocar Senha"}
                                                    disabled={isMaster && !isSelf}
                                                    className={`p-2 rounded-sm transition-all ${isMaster && !isSelf ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-[#113247] hover:bg-gray-100'}`}
                                                >
                                                    <Key size={16} />
                                                </button>

                                                <button
                                                    onClick={() => toggleUserStatus(user)}
                                                    disabled={isMaster}
                                                    title={isMaster ? "Bloqueado" : (user.active ? "Desativar" : "Ativar")}
                                                    className={`p-2 rounded-sm transition-all ${isMaster ? 'text-gray-200 cursor-not-allowed' : (user.active ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50')}`}
                                                >
                                                    {user.active ? <UserCheck size={18} /> : <UserX size={18} />}
                                                </button>

                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    disabled={isMaster}
                                                    title={isMaster ? "Bloqueado" : "Excluir"}
                                                    className={`p-2 rounded-sm transition-all ${isMaster ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Exibir:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-white border border-gray-200 text-[#113247] text-xs font-bold rounded-sm px-2 py-1 cursor-pointer"
                        >
                            {[10, 25, 50, 100].map(val => <option key={val} value={val}>{val} registros</option>)}
                        </select>
                        <span className="text-[11px] text-gray-400 font-medium italic">
                            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredUsers.length)} de {filteredUsers.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 disabled:opacity-30">
                            <ChevronLeft size={18} className="text-[#113247]" />
                        </button>
                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs font-bold rounded-sm ${currentPage === i + 1 ? 'bg-[#113247] text-white' : 'text-gray-400 hover:bg-white'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 disabled:opacity-30">
                            <ChevronRight size={18} className="text-[#113247]" />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#113247]/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <form onSubmit={handleCreateUser} className="bg-white w-full max-w-lg rounded-sm shadow-2xl z-10 border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#113247]">Novo Usuário</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome Completo</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#64E7FA]" placeholder="Ex: João Silva" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">E-mail de Acesso</label>
                                <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#64E7FA]" placeholder="email@exemplo.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Senha Inicial</label>
                                    <input required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} type="password" underline="none" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#64E7FA]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nível de Acesso</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#64E7FA]">
                                        <option value="common_user">Usuário Comum</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-sm">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 text-sm font-bold bg-[#113247] text-white rounded-sm hover:bg-[#1a4a69] shadow-md">Cadastrar Usuário</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#113247]/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
                    <form onSubmit={handleUpdatePassword} className="bg-white w-full max-w-md rounded-sm shadow-2xl z-10 border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-[#113247]">Trocar Senha</h3>
                                <p className="text-xs text-gray-400 font-medium">Usuário: {selectedUser?.name}</p>
                            </div>
                            <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nova Senha</label>
                                <input required value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} type="password" underline="none" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#64E7FA]" placeholder="Mínimo 6 caracteres" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Confirmar Nova Senha</label>
                                <input required value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} type="password" underline="none" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-[#64E7FA]" placeholder="Repita a senha" />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-sm">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 text-sm font-bold bg-[#113247] text-white rounded-sm hover:bg-[#1a4a69] shadow-md transition-all">Atualizar Senha</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Users;