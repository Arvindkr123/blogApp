import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getPostByIdApi } from "../utils/api.js";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // =====================================
  // Fetch single post
  // =====================================
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await getPostByIdApi(id);

        if (response.success) {
          setPost(response.post);
        } else {
          toast.error("Post not found");
        }
      } catch (error) {
        console.error("GET SINGLE POST ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load post"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // =====================================
  // Loading
  // =====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="max-w-4xl mx-auto px-4 py-10">

          <div className="animate-pulse">

            <div className="h-5 w-24 bg-slate-200 rounded mb-8" />

            <div className="h-8 w-32 bg-slate-200 rounded mb-6" />

            <div className="h-12 w-full bg-slate-200 rounded mb-4" />

            <div className="h-12 w-3/4 bg-slate-200 rounded mb-8" />

            <div className="h-5 w-48 bg-slate-200 rounded mb-10" />

            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 w-4/5 bg-slate-200 rounded" />
            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================
  // Post not found
  // =====================================
  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-slate-900">
            Post Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            The post you're looking for doesn't exist.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
              mt-6
              px-5 py-2.5
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-lg
              transition
            "
          >
            Back to Home
          </button>

        </div>

      </div>
    );
  }

  // =====================================
  // Save post
  // =====================================
  const handleSave = () => {
    setSaved((prev) => !prev);

    toast.success(
      saved
        ? "Post removed from bookmarks"
        : "Post saved to bookmarks"
    );
  };

  // =====================================
  // Date formatting
  // =====================================
  const formattedDate = new Date(
    post.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================
          Header
      ================================= */}
      <header className="bg-white border-b border-slate-200">

        <div className="
          max-w-5xl
          mx-auto
          px-4
          py-4
          flex
          items-center
          justify-between
        ">

          <Link
            to="/"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-600
              hover:text-blue-600
              transition
            "
          >
            <ArrowLeft className="w-4 h-4" />

            Back to articles
          </Link>

          <button
            onClick={handleSave}
            className={`
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              text-sm
              font-medium
              transition
              ${
                saved
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >
            <Bookmark
              className="w-4 h-4"
              fill={saved ? "currentColor" : "none"}
            />

            {saved ? "Saved" : "Save"}
          </button>

        </div>

      </header>

      {/* =================================
          Main Article
      ================================= */}
      <main className="max-w-4xl mx-auto px-4 py-10 md:py-14">

        {/* Category */}
        <div className="mb-5">

          <span className="
            inline-flex
            px-3
            py-1.5
            rounded-full
            bg-blue-50
            text-blue-700
            text-sm
            font-semibold
          ">
            {post.category}
          </span>

        </div>

        {/* Title */}
        <h1 className="
          text-3xl
          md:text-5xl
          font-bold
          leading-tight
          text-slate-900
        ">
          {post.name}
        </h1>

        {/* Description */}
        <p className="
          mt-6
          text-lg
          md:text-xl
          leading-relaxed
          text-slate-600
        ">
          {post.description}
        </p>

        {/* =================================
            Author information
        ================================= */}
        <div className="
          mt-8
          pt-6
          border-t
          border-b
          border-slate-200
          py-6
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-5
        ">

          {/* Author */}
          <div className="flex items-center gap-3">

            <div className="
              w-11
              h-11
              rounded-full
              bg-blue-100
              flex
              items-center
              justify-center
            ">
              <User className="w-5 h-5 text-blue-600" />
            </div>

            <div>

              <p className="
                font-semibold
                text-slate-900
              ">
                {post.createdBy?.name || "Unknown Author"}
              </p>

              {post.createdBy?.handle && (
                <p className="text-sm text-slate-500">
                  @{post.createdBy.handle}
                </p>
              )}

            </div>

          </div>

          {/* Meta */}
          <div className="
            flex
            flex-wrap
            items-center
            gap-5
            text-sm
            text-slate-500
          ">

            <div className="flex items-center gap-2">

              <Calendar className="w-4 h-4" />

              <span>
                {formattedDate}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <Clock className="w-4 h-4" />

              <span>
                {post.readTime}
              </span>

            </div>

          </div>

        </div>

        {/* =================================
            Article Content
        ================================= */}
        <article className="
          mt-10
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
          md:p-10
        ">

          <div className="
            prose
            prose-slate
            max-w-none
          ">

            <p className="
              text-base
              md:text-lg
              leading-8
              text-slate-700
              whitespace-pre-line
            ">
              {post.description}
            </p>

          </div>

        </article>

        {/* =================================
            Bottom navigation
        ================================= */}
        <div className="
          mt-8
          flex
          justify-between
          items-center
        ">

          <button
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              border
              border-slate-300
              rounded-lg
              text-sm
              font-medium
              text-slate-600
              hover:bg-white
              transition
            "
          >
            <ArrowLeft className="w-4 h-4" />

            Previous
          </button>

          <button
            onClick={() => navigate("/")}
            className="
              px-4
              py-2.5
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-lg
              text-sm
              font-medium
              transition
            "
          >
            More Articles
          </button>

        </div>

      </main>

    </div>
  );
};

export default SinglePost;