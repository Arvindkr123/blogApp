import {
  Bell,
  FileText,
  Home,
  LogOut,
  Menu,
  Plus,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

import { useUser } from "../context/useUser";
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    try {
      // If you already have logoutApi(), call it here.
      // await logoutApi();

      localStorage.removeItem("user");

      if (setUser) {
        setUser(null);
      }

      toast.info("Logged out successfully");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  // =========================
  // Admin protection
  // =========================
  if (!user) {
    return null;
  }

  if (user.role !== "Admin") {
    navigate("/");
    return null;
  }

  // =========================
  // Dashboard statistics
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* =========================
          Mobile Overlay
      ========================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}
      <aside
        className={`
          fixed md:static
          inset-y-0 left-0
          z-50
          w-64
          bg-white
          border-r border-slate-200
          flex flex-col justify-between
          transform
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
          transition-transform duration-200
        `}
      >

        {/* Sidebar Top */}
        <div>

          {/* Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1 className="font-bold text-slate-900">
                  TechStack
                </h1>

                <p className="text-xs text-slate-500">
                  Admin Panel
                </p>
              </div>

            </div>

            {/* Mobile Close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-500"
            >
              <X className="w-6 h-6" />
            </button>

          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">

            {/* Overview */}
            <button
              onClick={() => {
                navigate("/admin");
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm font-medium
                bg-blue-50
                text-blue-600
              "
            >
              <Home className="w-5 h-5" />
              <span>Overview</span>
            </button>

            {/* All Posts */}
            <button
              onClick={() => {
                navigate("/admin/posts");
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm font-medium
                text-slate-600
                hover:bg-slate-100
                transition
              "
            >
              <FileText className="w-5 h-5" />
              <span>All Posts</span>
            </button>

            {/* Create Post */}
            <button
              onClick={() => {
                navigate("/admin/posts/create");
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm font-medium
                text-slate-600
                hover:bg-slate-100
                transition
              "
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button>

            {/* Users */}
            <button
              onClick={() => {
                navigate("/admin/users");
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm font-medium
                text-slate-600
                hover:bg-slate-100
                transition
              "
            >
              <Users className="w-5 h-5" />
              <span>All Users</span>
            </button>

            {/* Add User */}
            <button
              onClick={() => {
                navigate("/admin/users/create");
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm font-medium
                text-slate-600
                hover:bg-slate-100
                transition
              "
            >
              <UserPlus className="w-5 h-5" />
              <span>Add User</span>
            </button>

          </nav>

        </div>

        {/* =========================
            User Section
        ========================= */}
        <div className="p-4 border-t border-slate-200">

          <div className="flex items-center justify-between mb-4 px-2">

            <div className="min-w-0">

              <p className="text-sm font-semibold text-slate-900 truncate">
                {user.name}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>

            </div>

            <span className="
              ml-2
              text-xs
              font-semibold
              px-2
              py-1
              rounded
              bg-blue-100
              text-blue-700
            ">
              Admin
            </span>

          </div>

          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center justify-center gap-2
              px-3 py-2.5
              text-sm font-medium
              text-red-600
              bg-red-50
              hover:bg-red-100
              rounded-lg
              transition
            "
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =========================
          Main Content
      ========================= */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* =========================
            Top Navbar
        ========================= */}
        <header className="
          h-16
          bg-white
          border-b border-slate-200
          flex items-center justify-between
          px-4 md:px-8
        ">

          <div className="flex items-center gap-4">

            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                md:hidden
                p-2
                rounded-lg
                text-slate-600
                hover:bg-slate-100
              "
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="relative w-48 md:w-80">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-4 h-4
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Search..."
                className="
                  w-full
                  pl-9 pr-4
                  py-2
                  text-sm
                  bg-slate-100
                  rounded-lg
                  border-none
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

          </div>

          {/* Notification */}
          <button
            className="
              relative
              p-2
              rounded-full
              text-slate-600
              hover:bg-slate-100
            "
          >
            <Bell className="w-5 h-5" />

            <span className="
              absolute
              top-1.5
              right-1.5
              w-2
              h-2
              bg-blue-600
              rounded-full
            " />
          </button>

        </header>

        {/* =========================
            Dashboard Content
        ========================= */}
        <Outlet/>

      </div>

    </div>
  );
};

export default Dashboard;