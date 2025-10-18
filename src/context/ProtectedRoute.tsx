
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext"; 

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
