import type { Announcement } from '../types';
import { Clock, MapPin, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface NoticeCardProps {
  notice: Announcement;
  onEdit?: (notice: Announcement) => void;
  onDelete?: (id: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function NoticeCard({ notice, onEdit, onDelete, canEdit, canDelete }: NoticeCardProps) {
  const isAlert = notice.is_alert;
  const isExpired = notice.expires_at ? new Date(notice.expires_at) < new Date() : false;

  return (
    <div className={`glass-nav rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
      isAlert ? 'border-red-500/30' : 'border-white/5'
    }`}>
      {isAlert && (
        <div className="bg-red-500/20 text-red-300 px-5 py-3 flex items-center justify-between text-sm font-medium border-b border-red-500/30">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            URGENT ALERT
          </div>
          {notice.expires_at && !isExpired && (
            <span>Expires in {formatDistanceToNow(new Date(notice.expires_at))}</span>
          )}
          {isExpired && <span>Expired</span>}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{notice.title}</h3>
          
          <div className="flex items-center gap-2">
            {canEdit && (
              <button onClick={() => onEdit?.(notice)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button onClick={() => onDelete?.(notice.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {format(new Date(notice.published_at), 'MMM d, yyyy h:mm a')}
          </div>
          
          {(notice.department_name || notice.faculty_name) && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {notice.department_name || notice.faculty_name}
            </div>
          )}
          
          {notice.category && (
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium">
              {notice.category}
            </span>
          )}
        </div>
        
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
          {notice.body}
        </div>
        
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Published by <span className="font-medium text-gray-200">{notice.author_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
