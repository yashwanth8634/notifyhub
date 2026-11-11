import { AuthProvider } from '../context/AuthContext';
import { Layout as AppLayout } from '../components/Layout';
import { NotificationPermission } from '../components/NotificationPermission';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NotifyHub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0c0c0f] text-gray-300 antialiased font-sans cursor-default min-h-screen flex flex-col">
        <AuthProvider>
          <AppLayout>
            {children}
            <NotificationPermission />
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
