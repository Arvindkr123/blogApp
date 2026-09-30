import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  Loader2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deletePostAdminApi, getAllPostsAdminApi } from "../../utils/postApi";


const AllPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [deletePost, setDeletePost] = useState(null);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await getAllPostsAdminApi();

        if (response.success) {
          setPosts(response.posts || []);
        } else {
          toast.error(response.message || "Failed to fetch posts");
        }
      } catch (error) {
        console.error("FETCH ADMIN POSTS ERROR:", error);

        toast.error(
          error.response?.data?.message || "Failed to load posts"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPosts()
  }, []);

  // =========================
  // Categories
  // =========================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(posts.map((post) => post.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [posts]);

  // =========================
  // Filter Posts
  // =========================

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        post.name?.toLowerCase().includes(searchText) ||
        post.description?.toLowerCase().includes(searchText) ||
        post.createdBy?.name?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || post.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, category]);

  // =========================
  // Delete Post
  // =========================

  const handleDelete = async () => {
    if (!deletePost) return;

    try {
      setDeleting(true);

      const response = await deletePostAdminApi(deletePost._id);

      if (response.success) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== deletePost._id)
        );

        toast.success("Post deleted successfully");

        setDeletePost(null);
      } else {
        toast.error(response.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("DELETE POST ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete post"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // Date Format
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* =========================
            Header
        ========================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              All Posts
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all blog posts from here.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/posts/create")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>

        {/* =========================
            Filters
        ========================= */}

        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Result count */}

          <div className="mt-3 text-xs text-slate-500">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {/* =========================
            Posts Table
        ========================= */}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />

              <p className="mt-3 text-sm text-slate-500">
                Loading posts...
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-5">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No posts found
              </h3>

              <p className="mt-1 text-sm text-slate-500 text-center">
                {search || category !== "All"
                  ? "Try changing your search or category filter."
                  : "You haven't created any posts yet."}
              </p>

              {!search && category === "All" && (
                <button
                  onClick={() => navigate("/admin/posts/create")}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Create Post
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Post
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Category
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Author
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Read Time
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Created
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition"
                    >
                      {/* Post */}

                      <td className="px-5 py-4">
                        <div className="max-w-[300px]">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {post.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500 truncate">
                            {post.description}
                          </p>
                        </div>
                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                          {post.category}
                        </span>
                      </td>

                      {/* Author */}

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {post.createdBy?.name || "Unknown"}
                          </p>

                          {post.createdBy?.handle && (
                            <p className="text-xs text-slate-400">
                              @{post.createdBy.handle}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Read Time */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          {post.readTime}
                        </span>
                      </td>

                      {/* Created */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(post.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/posts/edit/${post._id}`
                              )
                            }
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Post"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete */}

                          <button
                            onClick={() => setDeletePost(post)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* =========================
          Delete Confirmation Modal
      ========================= */}

      {deletePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Post
              </h2>

              <button
                onClick={() => setDeletePost(null)}
                disabled={deleting}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}

            <div className="px-5 py-5">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this post?
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-semibold text-slate-900">
                  {deletePost.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-200">
              <button
                onClick={() => setDeletePost(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition"
              >
                {deleting && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                {deleting ? "Deleting..." : "Delete Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllPosts;