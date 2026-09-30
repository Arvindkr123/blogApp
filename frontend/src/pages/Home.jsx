import {
  Bookmark,
  ChevronRight,
  Clock,
  LogOut,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import AdSlot from "../components/ads/AdSlot";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { getPostsApi, logoutApi } from "../utils/api";

const CATEGORIES = [
  "All",
  "Engineering",
  "Architecture",
  "Frontend",
  "Database",
  "DevOps",
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPosts, setSavedPosts] = useState({});
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await getPostsApi();

        console.log("Posts response:", response);

        if (response.success) {
          setPosts(response.posts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);

        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleBookmark = (id) => {
    setSavedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.category === selectedCategory;

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      post.name?.toLowerCase().includes(search) ||
      post.description?.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  const handleLogout = async () => {
  try {
    await logoutApi();

    setUser(null);
    localStorage.removeItem("user");

    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-7 w-7 bg-slate-900 text-white rounded font-mono font-bold text-base flex items-center justify-center">
                B
              </span>

              <span className="font-semibold text-slate-900 text-base tracking-tight">
                TechStack Journal
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-600">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-md text-slate-900 bg-slate-100 font-semibold"
              >
                Feed
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">

            {user && (
              <>
                <Link
                  to="/posts/create"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-3.5 py-1.5 rounded-md transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post
                </Link>
                <button onClick={handleLogout}  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="text-xs font-medium bg-slate-900 text-white px-3.5 py-1.5 rounded-md"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-700">
                {user.name}
              </span>
            )}

          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* TOP AD */}
        <div className="mb-6">
          <AdSlot
            label="Top Banner Ad Slot (728x90 Leaderboard)"
            minHeight="h-24"
            className="bg-white border-slate-200 shadow-2xs"
          />
        </div>

        {/* FILTER */}
        <section className="bg-white border border-slate-200 rounded-lg p-3 mb-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Categories */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto scrollbar-none py-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search by topic or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition"
            />
          </div>
        </section>

        {/* 2 COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* POSTS */}
          <main className="lg:col-span-8 space-y-4">

            {/* Loading */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse space-y-3"
                  >
                    <div className="h-3 bg-slate-100 rounded w-1/5" />
                    <div className="h-5 bg-slate-100 rounded w-4/5" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (

              /* No posts */
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <p className="text-sm text-slate-500">
                  No articles found matching your query.
                </p>
              </div>

            ) : (

              /* Posts */
              filteredPosts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 transition-all duration-150 shadow-2xs group"
                >

                  {/* Author + Category */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">

                    <div className="flex items-center space-x-2">

                      <span className="font-semibold text-slate-900">
                        {post.createdBy?.name || "Dev Author"}
                      </span>

                      <span>•</span>

                      <span className="text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>

                    </div>

                    <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200">
                      {post.category || "General"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">

                    <Link to={`/posts/${post._id}`}>
                      {post.name}
                    </Link>

                  </h2>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {post.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">

                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Clock className="w-3 h-3" />

                        <span>
                          {post.readTime || "5 min read"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">

                      {/* Bookmark */}
                      <button
                        onClick={() => toggleBookmark(post._id)}
                        className={`p-1.5 rounded hover:bg-slate-100 transition ${savedPosts[post._id]
                          ? "text-indigo-600"
                          : "text-slate-400"
                          }`}
                        title="Save article"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      {/* Read */}
                      <Link
                        to={`/posts/${post._id}`}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-900 hover:text-indigo-600 transition pl-2"
                      >
                        <span>Read</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>

                    </div>
                  </div>
                </article>
              ))
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-4">

            <div className="sticky top-20 space-y-4">

              <AdSlot
                label="Sidebar Ad Slot (300x250 Medium Rectangle)"
                minHeight="h-64"
                className="bg-white border-slate-200 shadow-2xs"
              />

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">

                <div className="flex items-center space-x-1.5 pb-3 mb-3 border-b border-slate-100 text-slate-900 font-semibold text-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Trending Discussions</span>
                </div>

                <div className="space-y-3 text-xs">

                  <a href="#" className="block group">
                    <span className="text-[10px] text-slate-400 font-mono">
                      #01
                    </span>

                    <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition leading-snug">
                      Why we migrated from REST to gRPC for microservice RPCs
                    </p>
                  </a>

                  <a
                    href="#"
                    className="block group border-t border-slate-100 pt-2"
                  >
                    <span className="text-[10px] text-slate-400 font-mono">
                      #02
                    </span>

                    <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition leading-snug">
                      Understanding Node.js Event Loop phases under strain
                    </p>
                  </a>

                  <a
                    href="#"
                    className="block group border-t border-slate-100 pt-2"
                  >
                    <span className="text-[10px] text-slate-400 font-mono">
                      #03
                    </span>

                    <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition leading-snug">
                      React Server Components vs Hydration: A practical
                      checklist
                    </p>
                  </a>

                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* BOTTOM AD */}
        <div className="mt-8">
          <AdSlot
            label="Bottom Banner Ad Slot (728x90 Leaderboard)"
            minHeight="h-24"
            className="bg-white border-slate-200 shadow-2xs"
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">
              TechStack Journal
            </span>

            <span>— Production Blogging Platform</span>
          </div>

          <div className="flex space-x-4 text-slate-500">
            <a href="#" className="hover:underline">
              Privacy
            </a>

            <a href="#" className="hover:underline">
              Terms
            </a>

            <a href="#" className="hover:underline">
              API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;