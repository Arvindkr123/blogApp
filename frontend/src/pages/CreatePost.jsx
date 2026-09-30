import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText, Send } from "lucide-react";
import { toast } from "react-toastify";
import { addPostApi } from "../utils/api";


const CATEGORIES = [
  "Engineering",
  "Architecture",
  "Frontend",
  "Database",
  "DevOps",
];

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    readTime: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const readTime = formData.readTime.trim();

    // Validation
    if (!name) {
      toast.error("Please enter post title");
      return;
    }

    if (name.length < 5) {
      toast.error("Post title must be at least 5 characters");
      return;
    }

    if (!description) {
      toast.error("Please enter post description");
      return;
    }

    if (description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!readTime) {
      toast.error("Please enter reading time");
      return;
    }

    try {
      setLoading(true);

      const response = await addPostApi({
        name,
        description,
        category,
        readTime,
      });

      console.log("Post created:", response);

      toast.success("Post created successfully!");

      setFormData({
        name: "",
        description: "",
        category: "",
        readTime: "",
      });

      // Go back to home after successful creation
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Create post error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 font-mono font-bold text-white">
              B
            </span>

            <span className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
              TechStack Journal
            </span>
          </Link>

          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>

            <span className="text-sm font-medium text-indigo-600">
              Create New Post
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Share your knowledge
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Write something useful for developers. Share your experience,
            tutorials, architecture decisions, or engineering insights.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Post Details
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Fill in the information below to publish your post.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Post Title
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Understanding Redis Caching in Node.js"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Minimum 5 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={7}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain what your post is about..."
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <div className="mt-1.5 flex justify-between">
                  <p className="text-xs text-slate-400">
                    Minimum 20 characters
                  </p>

                  <span className="text-xs text-slate-400">
                    {formData.description.length} characters
                  </span>
                </div>
              </div>

              {/* Category + Read Time */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select category</option>

                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div>
                  <label
                    htmlFor="readTime"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Reading Time
                  </label>

                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="readTime"
                      name="readTime"
                      type="text"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="e.g. 5 min read"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <Link
                to="/"
                className="text-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />

                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>

          {/* Right Sidebar */}
          <aside className="space-y-5">
            {/* Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Live Preview
              </h3>

              <div className="mt-4">
                {formData.category && (
                  <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                    {formData.category}
                  </span>
                )}

                <h4 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
                  {formData.name || "Your post title will appear here"}
                </h4>

                <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-500">
                  {formData.description ||
                    "Your post description will appear here. Write something interesting and useful for other developers."}
                </p>

                {formData.readTime && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formData.readTime}
                  </div>
                )}
              </div>
            </div>

            {/* Writing Tips */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Writing Tips
              </h3>

              <ul className="mt-4 space-y-3">
                <li className="flex gap-2.5 text-xs leading-5 text-slate-500">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  Keep your title clear and specific.
                </li>

                <li className="flex gap-2.5 text-xs leading-5 text-slate-500">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  Explain the problem before presenting the solution.
                </li>

                <li className="flex gap-2.5 text-xs leading-5 text-slate-500">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  Include practical examples wherever possible.
                </li>

                <li className="flex gap-2.5 text-xs leading-5 text-slate-500">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  Keep paragraphs short and easy to scan.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;