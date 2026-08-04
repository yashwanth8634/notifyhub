"use client";
import { createQuery } from "@/actions/queries";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Query } from "@/types";
import { MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const { isAuthenticated, hasRole } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const isStudent = hasRole(['student']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStudent) return;
    
    setStatus('submitting');
    try {
      await createQuery({ subject, message });
      setStatus('success');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Failed to submit query:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in font-display">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">Contact & Queries</h1>
        <p className="mt-3 text-gray-400 text-lg">Reach out to the administration with your questions or concerns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Directory */}
        <div className="glass-nav p-8 rounded-3xl border border-white/5 flex flex-col">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Administrative Directory
          </h2>
          
          <div className="space-y-8 flex-1">
            <div className="group">
              <h3 className="font-semibold text-gray-200 mb-1 group-hover:text-purple-300 transition-colors">General Enquiries</h3>
              <p className="text-gray-400">admin@notifyhub.in</p>
              <p className="text-gray-400"></p>
            </div>
            
            <div className="group">
              <h3 className="font-semibold text-gray-200 mb-1 group-hover:text-purple-300 transition-colors">IT Support</h3>
              <p className="text-gray-400">it@notifyhub.in</p>
            </div>
            
            
          </div>
        </div>

        {/* Query Form (Students Only) */}
        <div className="glass-nav p-8 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold mb-6 text-white">Ask a Question</h2>
          
          {!isAuthenticated ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-gray-400 mb-6 text-lg">Please log in to submit a query.</p>
              <Link href="/login" className="btn-gradient inline-flex items-center px-8 py-3 rounded-full font-medium">
                Log in
              </Link>
            </div>
          ) : !isStudent ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-gray-300 text-lg">The query submission system is for students only.</p>
              <p className="text-gray-500 mt-2">Staff should use internal communication channels.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'success' && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm leading-relaxed">
                  Your query has been submitted successfully. You will receive a response within 6 hours.
                  <div className="mt-3">
                    <Link href="/queries" className="font-semibold underline hover:text-green-300 transition-colors">Track your queries</Link>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                  Failed to submit query. Please try again.
                </div>
              )}

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is your question about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="block w-full px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details..."
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 btn-gradient rounded-xl font-semibold disabled:opacity-70 mt-2 transition-all transform hover:scale-[1.02]"
              >
                <Send className="w-5 h-5" />
                {status === 'submitting' ? 'Submitting...' : 'Submit Query'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
