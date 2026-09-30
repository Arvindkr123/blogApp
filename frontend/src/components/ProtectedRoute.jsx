// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthApi } from "../utils/api";
import { toast } from "react-toastify";
import { useUser } from "../context/useUser";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {setUser} = useUser();

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const data = await checkAuthApi();
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data)
        setLoading(false);
      } catch (err) {
        localStorage.removeItem("user");
        console.log(err)
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    };

    verifyUserSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 text-slate-900 dark:text-slate-50">
        <p>Loading session...</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;