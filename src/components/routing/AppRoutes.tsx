import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/*" element={user ? <ProtectedRoutes /> : <PublicRoutes />} />
    </Routes>
  );
};