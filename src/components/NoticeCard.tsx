import type { Announcement } from "../types";
import { Clock, AlertCircle, Edit, Trash2, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface NoticeCardProps {
  notice: Announcement;
  onEdit?: (notice: Announcement) => void;
  onDelete?: (id: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function NoticeCard({
  notice,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: NoticeCardProps) {
  const isAlert = notice.is_alert;

  return (
    <div
      className={`glass-nav rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
        isAlert ? "border-red-500/30" : "border-white/5"
      }`}
    >
      {isAlert && (
        <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border-b border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400" />

          <span className="text-sm font-semibold text-red-400">
            URGENT ALERT
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {notice.title}
          </h3>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => onEdit?.(notice)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => onDelete?.(notice.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />

            {format(new Date(notice.published_at), "MMM d, yyyy h:mm a")}
          </div>



          {notice.department && (
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium">
              {notice.department}
            </span>
          )}

          
          <div className="text-gray-400">
            Published by{" "}
            <span className="font-medium text-gray-200">
              {notice.author_name || "Unknown"}
            </span>
          </div>
        </div>

        <details className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-200 hover:bg-white/5 transition-colors">
            <span>View message</span>

            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="border-t border-white/10 px-4 py-4 text-gray-300 whitespace-pre-wrap leading-relaxed">
            {notice.body}
          </div>
        </details>
      </div>
    </div>
  );
}
