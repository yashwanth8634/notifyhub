"use client";

import { createQuery, getQueryById } from "@/actions/queries";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Send, Search, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/Button";

export default function ContactPage() {
  const { isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [trackingId, setTrackingId] = useState<string | null>(null);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [ticketId, setTicketId] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [trackedQuery, setTrackedQuery] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("submitting");

    try {
      const created = await createQuery({
        name,
        roll_no: rollNo,
        email,
        subject,
        message,
      });

      const id = created?.id ?? created?.query_id ?? created?.ticket_id;

      setTrackingId(String(id));

      setStatus("success");

      setName("");
      setRollNo("");
      setEmail("");
      setSubject("");
      setMessage("");

      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Failed to submit query:", error);
      setStatus("error");
    }
  };

  const handleTrackQuery = async () => {
    if (!ticketId.trim()) return;

    setTrackingLoading(true);
    setTrackingError("");
    setTrackedQuery(null);

    try {
      const query = await getQueryById(ticketId.trim());

      if (!query) {
        setTrackingError("Query not found.");
        return;
      }

      setTrackedQuery(query);
    } catch (error) {
      console.error("Failed to track query:", error);
      setTrackingError("Query not found.");
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in font-display">
      <div className="text-center mb-12 relative">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Contact & Support
        </h1>

        <p className="mt-3 text-gray-400 text-lg">
          Submit a query, reach the administration, or get help.
        </p>

        {/* Track Query Button */}
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowTrackModal(true);
              setTrackingError("");
              setTrackedQuery(null);
            }}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Track Query
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-nav p-8 rounded-md border border-white/5">
          <h2 className="text-2xl font-bold mb-6 text-white">Submit a Query</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {status === "success" && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-md text-sm">
                Your query was submitted successfully.
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md text-sm">
                Failed to submit query. Please try again.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label
                  htmlFor="rollNo"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Roll No
                </label>

                <input
                  type="text"
                  id="rollNo"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="Your Roll Number"
                  className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Subject
              </label>

              <input
                type="text"
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is your question about?"
                className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Message
              </label>

              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details..."
                className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={status === "submitting"}
              variant="secondary"
              size="lg"
              className="w-full mt-2"
            >
              <Send className="w-5 h-5" />

              {status === "submitting" ? "Submitting..." : "Submit Query"}
            </Button>
          </form>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md glass-nav rounded-2xl border border-white/10 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Track Query</h2>

                <p className="text-sm text-gray-400 mt-1">
                  Enter your query tracking ID.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTrackModal(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter Query ID"
                className="w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              />

              <Button
                type="button"
                onClick={handleTrackQuery}
                disabled={trackingLoading || !ticketId.trim()}
                variant="primary"
                className="w-full"
              >
                <Search className="w-4 h-4" />

                {trackingLoading ? "Checking..." : "Track Query"}
              </Button>

              {trackingError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 text-sm text-red-400">
                  {trackingError}
                </div>
              )}

              {trackedQuery && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Status</span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        trackedQuery.status === "closed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {trackedQuery.status}
                    </span>
                  </div>

                  {trackedQuery.status === "closed" ? (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Response</p>

                      <p className="text-gray-200 leading-relaxed">
                        {trackedQuery.response || "No response was added."}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-yellow-400">
                      Your query has not been responded to yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tracking ID Popup */}
      {showSuccessPopup && trackingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md glass-nav rounded-2xl border border-white/10 p-7 text-center animate-fade-in">
            <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-white">Query Submitted</h2>

            <p className="text-gray-400 mt-2">
              Save this tracking ID for later.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Tracking ID
              </p>

              <p className="text-2xl font-bold text-emerald-400 break-all">
                {trackingId}
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full mt-6"
              onClick={() => setShowSuccessPopup(false)}
            >
              Got It
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
