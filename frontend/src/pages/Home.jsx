import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const Home = () => {
    const { showModal, showToast } = useNotification();
    const user = JSON.parse(localStorage.getItem('@App:user'));

    return (
        <div className="max-w-6xl">
            <header className="mb-12">
                <h2 className="text-3xl font-extrabold text-[#113247]">
                    Dashboard
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