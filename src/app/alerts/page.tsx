"use client";
import { getAlerts, createAlert, deleteAlert } from "@/actions/alerts";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Announcement } from '@/types';
import { NoticeCard } from '@/components/NoticeCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Modal } from '@/components/Modal';
import { Plus, AlertTriangle, Loader2 } from 'lucide-react';

export default function AlertsPage() {
  const { hasRole, user } = useAuth();
  const [alerts, setAlerts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', is_alert: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPublish = hasRole(['super_admin', 'principal', 'dean', 'hod', 'faculty']);
  const canDelete = hasRole(['super_admin']);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createAlert(formData);
      setAlerts([created, ...alerts]);
      setIsModalOpen(false);
      setFormData({ title: '', body: '', is_alert: true });
    } catch (error) {
      console.error('Failed to create alert:', error);
      alert('Failed to create alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    try {
      await deleteAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="animate-fade-in font-display">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-red-400 flex items-center gap-3 tracking-tight">
            <AlertTriangle className="w-8 h-8" />
            Urgent Alerts
          </h1>
          <p className="mt-2 text-gray-400 text-lg">Time-sensitive and critical campus notices</p>
        </div>
        {canPublish && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full hover:bg-red-600/30 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Alert
          </button>
        )}
      </div>

      {loading ? (
        <LoadingScreen />
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 glass-nav rounded-2xl border border-red-500/20">
          <p className="text-gray-400 text-lg">No active alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts.map(notice => (
            <NoticeCard 
              key={notice.id} 
              notice={notice}
              canEdit={canPublish && (user?.role === 'super_admin' || user?.id === notice.author_id)}
              canDelete={canDelete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Alert">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">Alert Title</label>
            <input required type="text" className="block w-full px-4 py-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-200 placeholder-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="URGENT: Title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">Message Body</label>
            <textarea required rows={5} className="block w-full px-4 py-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-200 placeholder-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none" value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} placeholder="Alert details..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center transition-colors">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Publishing...' : 'Publish Alert'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
