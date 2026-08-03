import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const [FramerButton, setFramerButton] = useState<any>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/announcements');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Dynamically import the Framer smart component via URL
    const url = 'https://framer.com/m/Eye-Follow-Button-yMBK.js@UiZdcXLPs68fBczUfQ27';
    import(/* @vite-ignore */ url)
      .then((mod) => {
        setFramerButton(() => mod.default);
      })
      .catch((err) => console.error("Failed to load Framer component:", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-slide-up font-display">
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-4">
        <span className="text-white">Notify</span>
        <span className="text-gradient">Hub</span>
      </h1>
      
      <p className="text-xl sm:text-2xl text-gray-300 font-medium mb-8">
        Never miss a campus update.
      </p>
      
      <p className="max-w-2xl text-base sm:text-lg text-gray-500 mb-10 leading-relaxed">
        Your centralized digital platform for announcements, events,
        <br className="hidden sm:block" />
        alerts and important campus communications.
      </p>
      
      {FramerButton ? (
        <div onClick={() => navigate('/announcements')} className="cursor-pointer hover:scale-105 transition-transform duration-300" title="View Announcements">
          <FramerButton />
        </div>
      ) : (
        <Link 
          to="/announcements" 
          className="btn-gradient inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <Bell className="w-5 h-5 fill-current opacity-80" />
          View Announcements
        </Link>
      )}
    </div>
  );
}
