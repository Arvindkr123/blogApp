import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Loader2,
  X,
  UserPlus,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAllUsersAdminApi,
  deleteAdminUserApi,
} from "../../utils/userApi";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const [deleteUser, setDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =========================
  // Fetch Users
  // =========================



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await getAllUsersAdminApi();

        if (response.success) {
          setUsers(response.users || []);
        } else {
          toast.error(response.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("FETCH USERS ERROR:", error);

        toast.error(
          error.response?.data?.message ||
          "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // =========================
  // Roles
  // =========================

  const roles = useMemo(() => {
    const uniqueRoles = [
      ...new Set(users.map((user) => user.role)),
    ];

    return ["All", ...uniqueRoles];
  }, [users]);

  // =========================
  // Filter Users
  // =========================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.handle?.toLowerCase().includes(searchText);

      const matchesRole =
        role === "All" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  // =========================
  // Delete User
  // =========================

  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleting(true);

      const response = await deleteAdminUserApi(
        deleteUser._id
      );

      if (response.success) {
        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => user._id !== deleteUser._id
          )
        );

        toast.success("User deleted successfully");

        setDeleteUser(null);
      } else {
        toast.error(
          response.message || "Failed to delete user"
        );
      }
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete user"
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

  // =========================
  // Role Badge
  // =========================

  const getRoleStyle = (userRole) => {
    if (userRole === "Admin") {
      return "bg-purple-50 text-purple-600";
    }

    return "bg-blue-50 text-blue-600";
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
              All Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all registered users.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/users/create")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            Add User
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
                placeholder="Search by name, email or handle..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role */}

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="md:w-44 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* =========================
            Users Table
        ========================= */}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />

              <p className="mt-3 text-sm text-slate-500">
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-5">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500 text-center">
                {search || role !== "All"
                  ? "Try changing your search or role filter."
                  : "There are no users yet."}
              </p>

              {!search && role === "All" && (
                <button
                  onClick={() =>
                    navigate("/admin/users/create")
                  }
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      User
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Email
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Role
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Joined
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition"
                    >
                      {/* User */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}

                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-blue-600">
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {user.name || "Unknown"}
                            </p>

                            {user.handle && (
                              <p className="text-xs text-slate-400 truncate">
                                @{user.handle}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {user.email || "-"}
                        </span>
                      </td>

                      {/* Role */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role || "User"}
                        </span>
                      </td>

                      {/* Joined */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/users/edit/${user._id}`
                              )
                            }
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete */}

                          <button
                            onClick={() =>
                              setDeleteUser(user)
                            }
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Delete User"
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
          Delete Confirmation
      ========================= */}

      {deleteUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete User
              </h2>

              <button
                onClick={() => setDeleteUser(null)}
                disabled={deleting}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}

            <div className="px-5 py-5">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this user?
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {deleteUser.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {deleteUser.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {deleteUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-red-500">
                This action cannot be undone.
              </p>
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-200">
              <button
                onClick={() => setDeleteUser(null)}
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

                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;