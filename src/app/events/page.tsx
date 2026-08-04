"use client";
import { getEvents, createEvent, deleteEvent } from "@/actions/events";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Event } from "@/types";
import { Calendar, MapPin, Trash2, Edit, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Modal } from "@/components/Modal";

export default function EventsPage() {
  const { hasRole, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createEvent(formData);
      setEvents([created, ...events]);
      setIsModalOpen(false);
      setFormData({ title: "", description: "", event_date: "", location: "" });
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const CATEGORIES = [
    "All",
    "Placements",
    "Sports",
    "Workshop",
    "Ceremony",
    "Fest",
    "Social",
  ];

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      category === "All" ? true : (ev.category || "General") === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in font-display">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Upcoming Events
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            Workshops, seminars, and campus activities
          </p>
        </div>
        {canPublish && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-full font-medium"
          >
            <Plus className="w-5 h-5" />
            New Event
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border ${category === cat ? "bg-blue-500 text-white border-blue-600" : "text-gray-300 border-white/10"} transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : events.length === 0 ? (
        <div className="text-center py-16 glass-nav rounded-2xl">
          <p className="text-gray-400 text-lg">No upcoming events scheduled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="glass-nav rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/5"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="bg-purple-500/10 text-purple-400 p-3 rounded-xl text-center w-20 border border-purple-500/20">
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {format(new Date(event.event_date), "MMM")}
                  </div>
                  <div className="text-2xl font-black">
                    {format(new Date(event.event_date), "d")}
                  </div>
                </div>

                <div className="flex gap-2">
                  {canPublish &&
                    (user?.role === "super_admin" ||
                      user?.id === event.author_id) && (
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {event.title}
              </h3>

              <div className="space-y-3 mb-5 text-sm text-gray-400 grow">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(event.event_date), "h:mm a")}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-sm border-t pt-4 border-white/5 leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Event"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Title
            </label>
            <input
              required
              type="text"
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Event title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date & Time
              </label>
              <input
                required
                type="datetime-local"
                className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={formData.event_date}
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Room / Link"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Event details..."
            />
          </div>
          {/* Category removed from Events */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
