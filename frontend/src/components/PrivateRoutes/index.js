import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const isLogin = Boolean(localStorage.getItem("token"));

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;