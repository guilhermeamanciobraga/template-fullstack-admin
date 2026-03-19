import { useState, useEffect } from 'react';
import api from '../services/api';

export function useSystemSettings() {
    const [logoUrl, setLogoUrl] = useState(null);
    const [faviconUrl, setFaviconUrl] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await api.get('/admin/system-images');

                const logoData = response.data.find(img => img.type === 'logo');
                const faviconData = response.data.find(img => img.type === 'favicon');

                if (logoData && logoData.path) {
                    setLogoUrl(`${apiUrl}/files/logo-favicon/${logoData.path}`);
                }

                if (faviconData && faviconData.path) {
                    const fUrl = `${apiUrl}/files/logo-favicon/${faviconData.path}`;
                    setFaviconUrl(fUrl);

                    const link = document.querySelector("link[rel~='icon']");
                    if (link) {
                        link.href = fUrl;
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar configurações:", error);
            }
        }
        loadSettings();
    }, [apiUrl]);

    return { logoUrl, faviconUrl };
}