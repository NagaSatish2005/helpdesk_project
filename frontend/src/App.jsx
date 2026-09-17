import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import { TicketProvider } from './context/TicketContext'
import { UserProvider } from './context/UserContext'

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <TicketProvider>
            <UserProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </UserProvider>
          </TicketProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}