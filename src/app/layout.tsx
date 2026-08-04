import { AuthProvider } from '../context/AuthContext';
import { Layout as AppLayout } from '../components/Layout';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0c0c0f] text-gray-300 antialiased font-sans cursor-default min-h-screen flex flex-col">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
