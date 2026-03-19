import { useEffect } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import { useSystemSettings } from './hooks/useSystemSettings';
import AppRoutes from "./routes";

function App() {
  const { faviconUrl } = useSystemSettings();

  useEffect(() => {
    if (faviconUrl) {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = faviconUrl;
      }
    }
  }, [faviconUrl]);

  return (
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  );
}

export default App;