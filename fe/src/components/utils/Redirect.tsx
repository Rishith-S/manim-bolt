import { Navigate } from "react-router-dom";

export function RedirectToMain() {
  return <Navigate to={"/auth/login"} replace />
}