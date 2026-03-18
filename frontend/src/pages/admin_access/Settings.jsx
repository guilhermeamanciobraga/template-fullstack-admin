import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-5xl font-aptos animate-in fade-in duration-500">
            <header className="mb-10">
                <h2 className="text-3xl font-extrabold text-[#113247]">Configurações</h2>
                <p className="text-[#334D5C] mt-1 text-lg">Ajustes globais e parâmetros do sistema.</p>
            </header>

            <div className="bg-white border border-gray-100 shadow-sm rounded-sm min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 bg-[#E1F1F8] rounded-full flex items-center justify-center text-[#113247] mb-4">
                    <SettingsIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#113247]">Painel de Configurações</h3>
                <p className="text-gray-400 mt-2 max-w-sm">
                    As opções de configuração do sistema estarão disponíveis em breve.
                </p>
            </div>
        </div>
    );
};

export default Settings;