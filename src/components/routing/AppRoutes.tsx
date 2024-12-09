import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/app/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};