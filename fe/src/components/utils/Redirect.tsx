import { Navigate } from "react-router-dom";

export function RedirectToMain() {
  return <Navigate to={"/"} replace />
}