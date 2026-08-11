"use client";

import { getStats } from "@/actions/stats";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  AlertCircle,
  CalendarDays,
  Search,
  Smartphone,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const navigate = useRouter();
  const { isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    notices: 0,
    events: 0,
    alerts: 0,
    departments: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate.push("/announcements");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();

        setStats({
          notices: data.totalNotices ?? 0,
          events: data.upcomingEvents ?? 0,
          alerts: data.urgentAlerts ?? 0,
          departments: data.departments ?? 0,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, []);

  const features = [
    {
      icon: Bell,
      title: "Instant Announcements",
      description: "Get every college notice when it gets posted.",
    },
    {
      icon: AlertCircle,
      title: "Urgent Alert System",
      description: "Important deadlines and drives get priority alerts.",
    },
    {
      icon: CalendarDays,
      title: "Live Event Tracker",
      description: "Track upcoming events and never miss registrations.",
    },
    {
      icon: Search,
      title: "Smart Search & Filter",
      description: "Find notices using departments, categories, or dates.",
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: "Access NotifyHub across mobile, tablet, and desktop.",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Stay updated without checking multiple platforms.",
    },
  ];

  return (
    <div className="min-h-screen font-display">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-slide-up">
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
          className="bg-emerald-600 hover:bg-emerald-900 inline-flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:scale-105"
        >
          <Bell className="w-5 h-5 fill-current opacity-80" />
          View Announcements
        </Link>
      </section>

      {/* BY THE NUMBERS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-[0.2em] text-emerald-400 mb-3">
            BY THE NUMBERS
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Real impact, every day
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={stats.notices} label="Total Notices" />

          <StatCard value={stats.events} label="Upcoming Events" />

          <StatCard value={stats.alerts} label="Urgent Alerts" />

          <StatCard value={`${stats.departments}+`} label="Departments" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-[0.2em] text-emerald-400 mb-3">
            WHY NOTIFYHUB
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything your campus needs
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="glass-nav rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="glass-nav rounded-3xl border border-white/10 p-10 sm:p-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5">
            Stay ahead. Stay informed.
          </h2>

          <p className="text-gray-400 text-base sm:text-lg mb-8">
            All your college updates in one place — right now.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/announcements"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Browse Notices
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/urgent"
              className="inline-flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/20 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              View Urgent
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="glass-nav rounded-2xl p-6 text-center border border-white/5">
      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
        {value}
      </div>

      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
