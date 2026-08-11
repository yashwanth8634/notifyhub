"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/actions/profile";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/LoadingScreen";
import { User, Mail, Lock, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, hasRole, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const canAccessProfile = hasRole(["faculty", "hod", "dean", "principal"]);

  useEffect(() => {
    if (user && !canAccessProfile) {
      router.push("/dashboard");
    } else {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const data = await getProfile();
      setFormData({
        name: data.name,
        email: data.email,
        password: "", // never show password
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
      });
      alert("Profile updated successfully!");
      setFormData(prev => ({ ...prev, password: "" }));
      // If email changed, might need to re-login depending on auth setup
      // Assuming they stay logged in for now, but a logout might be safer if email changes.
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="animate-fade-in font-display max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-purple-400" />
          My Profile
        </h1>
        <p className="mt-2 text-gray-400 text-lg">
          Manage your personal information and security settings.
        </p>
      </div>

      <div className="glass-nav p-8 rounded-md border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1 ">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full pl-12 pr-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full pl-12 pr-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">
              New Password{" "}
              <span className="text-gray-500 font-normal">
                (Leave blank to keep current)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="block w-full pl-12 pr-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <Button
              type="submit"
              disabled={isSaving}
              variant="secondary"
              size="md"
              className="w-full transform hover:scale-[1.02] "
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
