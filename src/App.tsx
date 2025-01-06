import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { PublicRoutes } from "@/components/routing/PublicRoutes";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <PublicRoutes />
          <Toaster />
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;