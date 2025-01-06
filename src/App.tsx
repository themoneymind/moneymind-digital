import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { Routes } from "@/components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <Routes />
          <Toaster />
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;