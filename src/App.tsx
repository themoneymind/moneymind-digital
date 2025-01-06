import { Routes } from "./components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { BiometricNotification } from "@/components/settings/BiometricNotification";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
        <Toaster />
        <SonnerToaster position="top-center" />
        <BiometricNotification />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;