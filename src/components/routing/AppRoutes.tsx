import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/app/*" element={<ProtectedRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};