import {
    FileText,
    Plus,
    UserPlus,BarChart3,Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPostsAdminApi } from './../../utils/postApi';
import { toast } from 'react-toastify';
import { useUser } from './../../context/useUser';
const Overview = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

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

    const navigate = useNavigate();
    const recentPosts = posts.slice(0, 5);
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
    return (
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
    )
}
export default Overview