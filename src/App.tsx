import { Routes } from "./components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { BiometricNotification } from "@/components/settings/BiometricNotification";

function App() {
  return (
    <>
      <Routes />
      <Toaster />
      <SonnerToaster position="top-center" />
      <BiometricNotification />
    </>
  );
}

export default App;