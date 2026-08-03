import { useState, useEffect } from 'react';
import { queriesApi } from '../api/queriesApi';
import type { Query } from '../types';
import { SLAIndicator } from '../components/SLAIndicator';
import { format } from 'date-fns';
import { LoadingScreen } from '../components/LoadingScreen';

export function QueryStatusPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const data = await queriesApi.findAll();
      setQueries(data);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in font-display">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">My Queries</h1>
        <p className="mt-2 text-gray-400 text-lg">Track the status of your submitted questions.</p>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : queries.length === 0 ? (
        <div className="text-center py-16 glass-nav rounded-2xl border border-white/5">
          <p className="text-gray-400 text-lg">You haven't submitted any queries yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {queries.map(q => (
            <div key={q.id} className="glass-nav rounded-3xl p-6 border border-white/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <h3 className="text-xl font-bold text-white">{q.subject}</h3>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                    q.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    q.status === 'in_progress' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    'bg-white/10 text-gray-300 border-white/10'
                  }`}>
                    {q.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <SLAIndicator createdAt={q.created_at} status={q.status} />
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Submitted on {format(new Date(q.created_at), 'MMM d, yyyy h:mm a')}
              </p>
              
              <div className="bg-[#151515]/50 p-5 rounded-2xl text-gray-300 whitespace-pre-wrap mb-5 border border-white/5 leading-relaxed">
                {q.message}
              </div>
              
              {q.response ? (
                <div className="border-t border-white/5 pt-5 mt-5">
                  <h4 className="text-sm font-semibold text-white mb-3">Response:</h4>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl text-purple-100 whitespace-pre-wrap leading-relaxed">
                    {q.response}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Responded on {q.responded_at ? format(new Date(q.responded_at), 'MMM d, yyyy h:mm a') : ''}
                  </p>
                </div>
              ) : (
                <div className="border-t border-white/5 pt-5 mt-5">
                  <p className="text-sm text-gray-500 italic">Waiting for response...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
