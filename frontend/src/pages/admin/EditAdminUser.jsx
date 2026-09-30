import  { useEffect, useState } from "react";
import {
  ArrowLeft,
  UserCog,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAdminUserByIdApi,
  updateAdminUserApi,
} from "../../utils/userApi";

const EditAdminUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    handle: "",
    password: "",
    role: "User",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ============================================
  // FETCH USER
  // ============================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await getAdminUserByIdApi(id);

        const user = response.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          handle: user.handle || "",
          password: "",
          role: user.role || "User",
        });
      } catch (error) {
        console.error("GET USER ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch user"
        );

        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

  // ============================================
  // HANDLE INPUT
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // VALIDATION
  // ============================================
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!formData.handle.trim()) {
      toast.error("Handle is required");
      return false;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }

    // Password is optional while editing
    if (
      formData.password &&
      formData.password.length < 6
    ) {
      toast.error(
        "New password must be at least 6 characters"
      );
      return false;
    }

    return true;
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        handle: formData.handle.trim(),
        role: formData.role,
      };

      // Only send password if admin entered a new password
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await updateAdminUserApi(id, updateData);

      toast.success("User updated successfully");

      navigate("/admin/users");
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="flex-1 min-h-full flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin"
          />
          <span>Loading user...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-full">
      {/* ========================================
          HEADER
      ======================================== */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit User
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Update user account information
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          FORM
      ======================================== */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            {/* Form Header */}
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <UserCog
                    size={20}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    User Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update the user's details below
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                {/* ==================================
                    NAME
                ================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* ==================================
                    EMAIL + HANDLE
                ================================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Handle */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Handle
                    </label>

                    <input
                      type="text"
                      name="handle"
                      value={formData.handle}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* ==================================
                    PASSWORD
                ================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Leave this field empty if you don't
                    want to change the password.
                  </p>
                </div>

                {/* ==================================
                    ROLE
                ================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="User">
                      User
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              {/* ==================================
                  FOOTER
              ================================== */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/users")
                  }
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdminUser;