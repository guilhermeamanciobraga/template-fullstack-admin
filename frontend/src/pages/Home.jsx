import React, { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { useLoading } from '../layouts/MainLayout';

const Home = () => {
    const { showModal, showToast } = useNotification();
    const { setIsLoading } = useLoading();
    const user = JSON.parse(localStorage.getItem('@App:user'));
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                setDataReady(true);
            } catch (error) {
                showToast('error', 'Erro ao carregar dados do painel.');
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();

        return () => {
            setIsLoading(false);
        };
    }, [setIsLoading, showToast]);

    if (!dataReady) return null;

    return (
        <div className="max-w-6xl animate-in fade-in duration-500">
            <header className="mb-12">
                <h2 className="text-3xl font-extrabold text-[#113247]">
                    Home
                </h2>
                <p className="text-[#334D5C] mt-1 text-lg">
                    Olá <strong>{user?.name?.split(' ')[0] || 'Guilherme'}</strong>, bem-vindo ao painel da EBYTE Digital.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            </div>
        </div>
    );
};

export default Home;