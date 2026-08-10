"use client";
import { getStats } from "@/actions/stats";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const [FramerButton, setFramerButton] = useState<any>(null);
  const navigate = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate.push('/announcements');
    }
  }, [isAuthenticated, navigate]);

  
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

      <Link
        href="/announcements"
        className="bg-emerald-600 hover:bg-emerald-900 inline-flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 tracking-tight"
      >
        <Bell className="w-5 h-5 fill-current opacity-80 font-display tracking-tight " />
        View Announcements
      </Link>
    </div>
  );
}
