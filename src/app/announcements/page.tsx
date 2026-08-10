"use client";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "@/actions/announcements";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Announcement } from "@/types";
import { NoticeCard } from "@/components/NoticeCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Plus, Loader2 } from "lucide-react";

export default function AnnouncementsPage() {
  const { hasRole, user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const ANNOUNCEMENT_CATEGORIES = [
    { label: "Exams", value: "exams" },
    { label: "Placements", value: "placements" },
    { label: "Events", value: "events" },
    { label: "General", value: "general" },
    { label: "Finance", value: "finance" },
    { label: "Holiday", value: "holiday" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    body: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPublish = hasRole([
    "super_admin",
    "principal",
    "dean",
    "hod",
    "faculty",
  ]);
  const canDelete = hasRole(["super_admin"]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createAnnouncement(formData);
      setAnnouncements([created, ...announcements]);
      setIsModalOpen(false);
      setFormData({ title: "", department: "", body: "", category: "general" });
    } catch (error) {
      console.error("Failed to create announcement:", error);
      alert("Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete announcement");
    }
  };

  const CATEGORIES = [
    "All",
    "Exams",
    "Placements",
    "Events",
    "General",
    "Finance",
    "Holiday",
  ];

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      category === "All"
        ? true
        : (a.category || "General").toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in font-display">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Announcements
          </h1>
          <p className="text-gray-400 text-lg">
            General campus updates and notices
          </p>
        </div>
        {canPublish && (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            className="tracking-tight"
          >
            <Plus className="w-5 h-5" />
            New Announcement
          </Button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
              variant={category === cat ? "primary" : "outline"}
              size="sm"
              className={category === cat ? "" : "text-gray-300"}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements..."
            className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-nav rounded-md">
          <p className="text-gray-400 text-lg">
            No announcements found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              canEdit={
                canPublish &&
                (user?.role === "super_admin" || user?.id === notice.user_id)
              }
              canDelete={canDelete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Announcement"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              required
              type="text"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Announcement title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              required
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {ANNOUNCEMENT_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department
            </label>
            <input
              type="text"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="Enter department name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message Body
            </label>
            <textarea
              required
              rows={5}
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Write the announcement..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="primary">
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
