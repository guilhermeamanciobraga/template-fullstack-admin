import { NotificationProvider } from './contexts/NotificationContext';
import AppRoutes from "./routes";

function App() {
  return (
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  );
}

export default App;