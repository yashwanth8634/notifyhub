import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0c0c0f]">
      {/* Subtle ambient glow to match dark mode aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-purple-900/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10">
        <Outlet />
      </main>
      
      <footer className="border-t border-white/5 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NotifyHub. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built for smarter campus communication.
          </p>
        </div>
      </footer>
    </div>
  );
}
