import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { announcementsApi } from '../api/announcementsApi';
import type { Announcement } from '../types';
import { NoticeCard } from '../components/NoticeCard';
import { SearchFilter } from '../components/SearchFilter';
import { LoadingScreen } from '../components/LoadingScreen';
import { Modal } from '../components/Modal';
import { Plus, Loader2 } from 'lucide-react';

export function AnnouncementsPage() {
  const { hasRole, user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', category: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPublish = hasRole(['super_admin', 'principal', 'dean', 'hod', 'faculty']);
  const canDelete = hasRole(['super_admin']);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementsApi.findAll();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await announcementsApi.create(formData);
      setAnnouncements([created, ...announcements]);
      setIsModalOpen(false);
      setFormData({ title: '', body: '', category: '' });
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await announcementsApi.delete(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete announcement');
    }
  };

  const filtered = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? a.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(announcements.map(a => a.category).filter(Boolean))) as string[];

  return (
    <div className="animate-fade-in font-display">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Announcements</h1>
          <p className="mt-2 text-gray-400 text-lg">General campus updates and notices</p>
        </div>
        {canPublish && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-full font-medium"
          >
            <Plus className="w-5 h-5" />
            New Announcement
          </button>
        )}
      </div>

      <SearchFilter 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      {loading ? (
        <LoadingScreen />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-nav rounded-2xl">
          <p className="text-gray-400 text-lg">No announcements found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(notice => (
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input required type="text" className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Announcement title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category (Optional)</label>
            <input type="text" className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Academics, Sports" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message Body</label>
            <textarea required rows={5} className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none" value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} placeholder="Write the announcement..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-gradient px-6 py-2.5 rounded-xl font-medium disabled:opacity-70 flex items-center">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
