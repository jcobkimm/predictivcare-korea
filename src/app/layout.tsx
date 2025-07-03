import './globals.css';
import Sidebar from '../components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </body>
    </html>
  );
}