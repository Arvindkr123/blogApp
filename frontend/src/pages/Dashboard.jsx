import {
  BarChart3,
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useUser } from "../context/useUser";
import { getAllPostsAdminApi } from "../utils/postApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch posts
  // =========================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await getAllPostsAdminApi();

        if (response.success) {
          setPosts(response.posts || []);
        }
      } catch (error) {
        console.error("Dashboard posts error:", error);

        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
  const stats = [
    {
      title: "Total Posts",
      value: posts.length,
      description: "All blog posts",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: "—",
      description: "Registered users",
      icon: Users,
      color: "bg-emerald-500",
    },
    {
      title: "Published Posts",
      value: posts.length,
      description: "Currently published",
      icon: BarChart3,
      color: "bg-purple-500",
    },
    {
      title: "Categories",
      value: new Set(posts.map((post) => post.category)).size,
      description: "Post categories",
      icon: FileText,
      color: "bg-amber-500",
    },
  ];

  // =========================
  // Latest posts
  // =========================
  const recentPosts = posts.slice(0, 5);

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
        <main className="flex-1 overflow-y-auto p-4 md:p-8">

          {/* Welcome */}
          <div className="mb-8">

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back, {user.name}!
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your blog, posts and users from here.
            </p>

          </div>

          {/* =========================
              Quick Actions
          ========================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            <button
              onClick={() => navigate("/admin/posts/create")}
              className="
                p-5
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-xl
                flex items-center justify-between
                transition
              "
            >

              <div className="text-left">

                <p className="font-semibold">
                  Create New Post
                </p>

                <p className="text-sm text-blue-100 mt-1">
                  Write and publish a new article
                </p>

              </div>

              <Plus className="w-7 h-7" />

            </button>

            <button
              onClick={() => navigate("/admin/users/create")}
              className="
                p-5
                bg-white
                hover:bg-slate-50
                border border-slate-200
                rounded-xl
                flex items-center justify-between
                transition
              "
            >

              <div className="text-left">

                <p className="font-semibold text-slate-900">
                  Add New User
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Create a new user account
                </p>

              </div>

              <UserPlus className="w-7 h-7 text-blue-600" />

            </button>

          </div>

          {/* =========================
              Stats
          ========================= */}
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-8
          ">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="
                    p-5
                    bg-white
                    rounded-xl
                    border border-slate-200
                    shadow-sm
                    flex items-center justify-between
                  "
                >

                  <div>

                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {loading ? "..." : stat.value}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {stat.description}
                    </p>

                  </div>

                  <div
                    className={`
                      ${stat.color}
                      p-3
                      rounded-lg
                      text-white
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                </div>
              );

            })}

          </div>

          {/* =========================
              Recent Posts
          ========================= */}
          <div className="
            bg-white
            rounded-xl
            border border-slate-200
            overflow-hidden
          ">

            <div className="
              p-5
              border-b border-slate-200
              flex items-center justify-between
            ">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Recent Posts
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Latest articles published on your blog
                </p>

              </div>

              <button
                onClick={() => navigate("/admin/posts")}
                className="
                  text-sm
                  font-medium
                  text-blue-600
                  hover:text-blue-700
                "
              >
                View All
              </button>

            </div>

            {loading ? (

              <div className="p-8 text-center text-slate-500">
                Loading posts...
              </div>

            ) : recentPosts.length === 0 ? (

              <div className="p-8 text-center">

                <FileText className="w-10 h-10 mx-auto text-slate-300" />

                <p className="mt-3 text-slate-500">
                  No posts found
                </p>

                <button
                  onClick={() => navigate("/admin/posts/create")}
                  className="
                    mt-4
                    px-4 py-2
                    bg-blue-600
                    text-white
                    rounded-lg
                    text-sm
                  "
                >
                  Create First Post
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Post
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Category
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Author
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Read Time
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-200">

                    {recentPosts.map((post) => (

                      <tr
                        key={post._id}
                        className="hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-4">

                          <p className="font-medium text-slate-900">
                            {post.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 max-w-md truncate">
                            {post.description}
                          </p>

                        </td>

                        <td className="px-6 py-4">

                          <span className="
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            rounded-full
                            bg-blue-50
                            text-blue-700
                          ">
                            {post.category}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {post.createdBy?.name || "Unknown"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {post.readTime}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;