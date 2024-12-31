import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { FinanceProvider } from "@/contexts/FinanceContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <FinanceProvider>
        <AppRoutes />
        <Toaster />
      </FinanceProvider>
    </BrowserRouter>
  );
}

export default App;