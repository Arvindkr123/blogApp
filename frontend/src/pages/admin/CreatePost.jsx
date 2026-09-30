import {
  ArrowLeft,
  FileText,
  Loader2,
  Save,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPostAdminApi } from "../../utils/postApi";

const CreatePostAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    readTime: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Validation
  // =========================

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Post title is required");
      return false;
    }

    if (formData.name.trim().length < 5) {
      toast.error("Post title must be at least 5 characters");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (formData.description.trim().length < 20) {
      toast.error(
        "Description must be at least 20 characters"
      );
      return false;
    }

    if (!formData.category.trim()) {
      toast.error("Please select a category");
      return false;
    }

    if (!formData.readTime.trim()) {
      toast.error("Read time is required");
      return false;
    }

    return true;
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await createPostAdminApi({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        readTime: formData.readTime.trim(),
      });

      if (response.success) {
        toast.success("Post created successfully");

        setFormData({
          name: "",
          description: "",
          category: "",
          readTime: "",
        });

        // Go back to all posts
        setTimeout(() => {
          navigate("/admin/posts");
        }, 800);
      } else {
        toast.error(
          response.message || "Failed to create post"
        );
      }
    } catch (error) {
      console.error("CREATE ADMIN POST ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Reset
  // =========================

  const handleCancel = () => {
    navigate("/admin/posts");
  };

  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      {/* =========================
          Header
      ========================= */}

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Create Post
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and publish a new blog post.
          </p>
        </div>
      </div>

      {/* =========================
          Form Container
      ========================= */}

      <div className="max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl"
        >
          {/* Form Header */}

          <div className="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Post Information
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Add the details of your blog post.
              </p>
            </div>
          </div>

          {/* Form Fields */}

          <div className="p-5 md:p-6 space-y-6">
            {/* =========================
                Title
            ========================= */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Post Title
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter post title"
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Choose a clear and descriptive title.
              </p>
            </div>

            {/* =========================
                Description
            ========================= */}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description of your post..."
                rows={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              />

              <div className="flex justify-between mt-1.5">
                <p className="text-xs text-slate-400">
                  Briefly explain what the article is about.
                </p>

                <span className="text-xs text-slate-400">
                  {formData.description.length} characters
                </span>
              </div>
            </div>

            {/* =========================
                Category + Read Time
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Engineering">
                    Engineering
                  </option>

                  <option value="Architecture">
                    Architecture
                  </option>

                  <option value="Frontend">
                    Frontend
                  </option>

                  <option value="Database">
                    Database
                  </option>

                  <option value="DevOps">
                    DevOps
                  </option>
                </select>
              </div>

              {/* Read Time */}

              <div>
                <label
                  htmlFor="readTime"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Read Time
                </label>

                <input
                  id="readTime"
                  name="readTime"
                  type="text"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="e.g. 5 min read"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {/* =========================
              Form Footer
          ========================= */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-5 md:px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePostAdmin;