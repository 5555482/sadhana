import { Navigate, Outlet } from "react-router-dom";

const TOKEN_KEY = "yew.token";

export function RequireAuth() {
  const token = window.localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
