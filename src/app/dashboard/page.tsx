"use client";
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
  resetPassword,
  reactivateUser,
  deleteUser,
} from "@/actions/users";
import { getQueries, respondToQuery } from "@/actions/queries";
import { useState, useEffect } from "react";
import type { User, Query, Role } from "@/types";
import { RoleBadge } from "@/components/RoleBadge";
import RoleSelect from "../../components/RoleSelect";
import { Modal } from "@/components/Modal";
import {
  Shield,
  Users,
  Search,
  MessageSquare,
  Loader2,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import { LoadingScreen } from "@/components/LoadingScreen";

type DashboardTab = "accounts" | "queries";

const ROLES: Role[] = [
  "super_admin",
  "principal",
  "dean",
  "hod",
  "faculty",
  "student",
];

const EMPTY_USER_FORM = {
  name: "",
  email: "",
  password: "",
  role: "principal" as Role,
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("accounts");

  // --- Users state ---
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState(EMPTY_USER_FORM);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState<{
    id: number;
    name: string;
    email: string;
    role: Role;
  }>({ id: 0, name: "", email: "", role: "student" });
  const [isEditingUser, setIsEditingUser] = useState(false);

  // --- Queries state ---
  const [queries, setQueries] = useState<Query[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(true);
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [respondQuery, setRespondQuery] = useState<Query | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  // Reset password modal
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchQueries();
  }, []);

  // --- User API calls ---
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const created = await createUser(createUserForm);
      setUsers((prev) => [created, ...prev]);
      setIsCreateUserOpen(false);
      setCreateUserForm(EMPTY_USER_FORM);
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const openEditUser = (user: User) => {
    setEditUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditUserOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingUser(true);
    try {
      const { id, ...data } = editUserForm;
      const updated = await updateUser(id, data);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u)),
      );
      setIsEditUserOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    } finally {
      setIsEditingUser(false);
    }
  };

  const handleDeactivate = async (user: User) => {
    if (!window.confirm(`Are you sure you want to deactivate ${user.name}?`))
      return;
    try {
      await deactivateUser(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: false } : u)),
      );
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      alert("Failed to deactivate user");
    }
  };

  const handleReactivate = async (user: User) => {
    if (!window.confirm(`Reactivate ${user.name}?`)) return;
    try {
      await reactivateUser(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: true } : u)),
      );
    } catch (error) {
      console.error("Failed to reactivate user:", error);
      alert("Failed to reactivate user");
    }
  };

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(`Permanently delete ${user.name}? This cannot be undone.`)
    )
      return;
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const openResetModal = (user: User) => {
    setResetUserId(user.id);
    setResetPasswordValue("");
    setIsResetOpen(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUserId) return;
    setIsResetting(true);
    try {
      await resetPassword(resetUserId, resetPasswordValue);
      setIsResetOpen(false);
      alert("Password reset successfully");
    } catch (error) {
      console.error("Failed to reset password:", error);
      alert("Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  // --- Queries API calls ---
  const fetchQueries = async () => {
    try {
      const data = await getQueries();
      setQueries(data);
    } catch (error) {
      console.error("Failed to fetch queries:", error);
    } finally {
      setQueriesLoading(false);
    }
  };

  // Role availability controls (only one principal allowed)
  const hasPrincipal = users.some((u) => u.role === "principal");
  const createRoles = ROLES.filter(
    (r) =>
      r !== "student" &&
      r !== "super_admin" &&
      !(r === "principal" && hasPrincipal),
  );
  const editRoles = ROLES.filter(
    (r) =>
      r !== "student" &&
      r !== "super_admin" &&
      (r !== "principal" || editUserForm.role === "principal" || !hasPrincipal),
  );

  const openRespond = (query: Query) => {
    setRespondQuery(query);
    setResponseText(query.response || "");
    setIsRespondOpen(true);
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondQuery) return;
    setIsResponding(true);
    try {
      const updated = await respondToQuery(respondQuery.id, {
        response: responseText,
      });
      setQueries((prev) =>
        prev.map((q) => (q.id === respondQuery.id ? { ...q, ...updated } : q)),
      );
      setIsRespondOpen(false);
      setRespondQuery(null);
      setResponseText("");
    } catch (error) {
      console.error("Failed to respond to query:", error);
      alert("Failed to respond");
    } finally {
      setIsResponding(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statusColor = (status: string) => {
    if (status === "resolved")
      return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === "in_progress")
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  return (
    <div className="animate-fade-in font-display">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white flex items-center gap-4 tracking-tight">
          <Shield className="w-10 h-10 text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          Admin Dashboard
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          Manage accounts, queries, and system settings.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "accounts"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <Users className="w-4 h-4" />
          Accounts
        </button>
        <button
          onClick={() => setActiveTab("queries")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "queries"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Queries
          {queries.filter((q) => q.status === "open").length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
              {queries.filter((q) => q.status === "open").length}
            </span>
          )}
        </button>
      </div>

      {/* ===== ACCOUNTS TAB ===== */}
      {activeTab === "accounts" && (
        <div className="glass-nav rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <Users className="w-6 h-6 text-purple-400" />
              Account Manager
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full sm:w-56 pl-11 pr-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsCreateUserOpen(true)}
                className="btn-gradient flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-black/20">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16">
                      <LoadingScreen />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400 text-lg"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-white">
                            {u.name}
                          </div>
                          <div className="text-sm text-gray-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-bold tracking-wide rounded-full border ${u.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                        {format(new Date(u.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-bold">
                        <button
                          onClick={() => openEditUser(u)}
                          className="text-purple-400 hover:text-purple-300 mr-3 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {u.role === "super_admin" ? (
                          // for the single super admin, only allow edit & reset
                          <>
                            <button
                              onClick={() => openResetModal(u)}
                              className="text-yellow-300 hover:text-yellow-200 mr-3 transition-colors cursor-pointer"
                            >
                              Reset Password
                            </button>
                          </>
                        ) : u.is_active ? (
                          <>
                            <button
                              onClick={() => openResetModal(u)}
                              className="text-yellow-300 hover:text-yellow-200 mr-3 transition-colors cursor-pointer"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => handleDeactivate(u)}
                              className="text-red-400 hover:text-red-300 mr-3 transition-colors cursor-pointer"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              className="text-red-600 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReactivate(u)}
                              className="text-green-400 hover:text-green-300 mr-3 transition-colors cursor-pointer"
                            >
                              Reactivate
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              className="text-red-600 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== QUERIES TAB ===== */}
      {activeTab === "queries" && (
        <div className="space-y-6">
          {queriesLoading ? (
            <LoadingScreen />
          ) : queries.length === 0 ? (
            <div className="text-center py-16 glass-nav rounded-2xl border border-white/5">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No queries submitted yet.</p>
            </div>
          ) : (
            queries.map((q) => (
              <div
                key={q.id}
                className="glass-nav rounded-3xl p-6 border border-white/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {q.subject}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${statusColor(q.status)}`}
                      >
                        {q.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {q.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        From:{" "}
                        <span className="text-gray-400">
                          {q.student_name || `Student #${q.student_id}`}
                        </span>
                      </span>
                      <span>
                        {format(new Date(q.created_at), "MMM d, yyyy · h:mm a")}
                      </span>
                    </div>
                    {q.response && (
                      <div className="mt-4 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                        <p className="text-xs font-bold text-green-400 uppercase tracking-wide mb-1">
                          Admin Response
                        </p>
                        <p className="text-sm text-green-200">{q.response}</p>
                        {q.responded_at && (
                          <p className="text-xs text-green-500/60 mt-2">
                            {format(
                              new Date(q.responded_at),
                              "MMM d, yyyy · h:mm a",
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {q.status !== "resolved" && (
                    <button
                      onClick={() => openRespond(q)}
                      className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap self-start"
                    >
                      Respond
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===== CREATE USER MODAL ===== */}
      <Modal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              required
              type="text"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={createUserForm.name}
              onChange={(e) =>
                setCreateUserForm({ ...createUserForm, name: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              required
              type="email"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={createUserForm.email}
              onChange={(e) =>
                setCreateUserForm({ ...createUserForm, email: e.target.value })
              }
              placeholder="user@notifyhub.in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              required
              type="password"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={createUserForm.password}
              onChange={(e) =>
                setCreateUserForm({
                  ...createUserForm,
                  password: e.target.value,
                })
              }
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <RoleSelect
              value={createUserForm.role as Role}
              onChange={(r: Role) =>
                setCreateUserForm({ ...createUserForm, role: r })
              }
              roles={createRoles}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateUserOpen(false)}
              className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingUser}
              className="btn-gradient px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center"
            >
              {isCreatingUser ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isCreatingUser ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== EDIT USER MODAL ===== */}
      <Modal
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        title="Edit User"
      >
        <form onSubmit={handleEditUser} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              required
              type="text"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={editUserForm.name}
              onChange={(e) =>
                setEditUserForm({ ...editUserForm, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              required
              type="email"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={editUserForm.email}
              onChange={(e) =>
                setEditUserForm({ ...editUserForm, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <RoleSelect
              value={editUserForm.role}
              onChange={(r: Role) =>
                setEditUserForm({ ...editUserForm, role: r })
              }
              roles={editRoles}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditUserOpen(false)}
              className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEditingUser}
              className="btn-gradient px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center"
            >
              {isEditingUser ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isEditingUser ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== RESPOND TO QUERY MODAL ===== */}
      <Modal
        isOpen={isRespondOpen}
        onClose={() => {
          setIsRespondOpen(false);
          setRespondQuery(null);
        }}
        title="Respond to Query"
      >
        {respondQuery && (
          <form onSubmit={handleRespond} className="space-y-5">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                Subject
              </p>
              <p className="text-sm font-medium text-white">
                {respondQuery.subject}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-3 mb-1">
                Message
              </p>
              <p className="text-sm text-gray-300">{respondQuery.message}</p>
              <p className="text-xs text-gray-500 mt-3">
                From:{" "}
                {respondQuery.student_name ||
                  `Student #${respondQuery.student_id}`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Response
              </label>
              <textarea
                required
                rows={5}
                className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsRespondOpen(false);
                  setRespondQuery(null);
                }}
                className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isResponding}
                className="btn-gradient px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center"
              >
                {isResponding ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {isResponding ? "Sending..." : "Send Response"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ===== RESET PASSWORD MODAL ===== */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setResetUserId(null);
        }}
        title="Reset User Password"
      >
        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              required
              type="password"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={resetPasswordValue}
              onChange={(e) => setResetPasswordValue(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsResetOpen(false);
                setResetUserId(null);
              }}
              className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResetting}
              className="btn-gradient px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
