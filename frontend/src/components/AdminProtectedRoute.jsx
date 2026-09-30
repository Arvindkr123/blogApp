import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/useUser.jsx";

const AdminProtectedRoute = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;