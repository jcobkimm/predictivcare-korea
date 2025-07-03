'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }, [pathname]);

  if (!token || pathname === '/login' || pathname === '/') return null;

  const isDigitalTwinDetail = pathname.startsWith('/digital-twin/') && pathname !== '/digital-twin';

  return (
    <aside className="w-64 bg-green-700 text-white p-6 space-y-6">
      <h2 className="text-xl font-bold">PredictivCare</h2>
      <nav className="flex flex-col space-y-2">
        {isDigitalTwinDetail ? (
          <>
            <Link href="/digital-twin" className="hover:underline">대쉬보드 홈</Link>
            <Link href="#" className="hover:underline">질환</Link>
            <Link href="#" className="hover:underline">약물</Link>
            <Link href="#" className="hover:underline">웰니스</Link>
            <Link href="#" className="hover:underline">유전자 변이</Link>
          </>
        ) : (
          <>
            <Link href="/digital-twin" className="hover:underline">대시보드 홈</Link>
            <Link href="/patients" className="hover:underline">환자 목록</Link>
            <Link href="/profile" className="hover:underline">내 프로필</Link>
          </>
        )}
        <Link href="/logout" className="hover:underline">로그아웃</Link>
      </nav>
    </aside>
  );
}
