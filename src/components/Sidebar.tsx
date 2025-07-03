// components/Sidebar.tsx
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

  // 토큰이 없거나 로그인/초기 페이지인 경우 사이드바를 숨김
  if (!token || pathname === '/login' || pathname === '/') return null;

  // 현재 경로가 디지털 트윈 상세 페이지인지 확인 (예: /digital-twin/patient-1)
  const isDigitalTwinDetail = pathname.startsWith('/digital-twin/') && pathname.split('/').length > 2;
  // 현재 환자 ID 추출 (상세 페이지일 경우에만 유효)
  const patientId = isDigitalTwinDetail ? pathname.split('/')[2] : null;

  return (
    <aside className="w-64 bg-gradient-to-b from-teal-500 to-blue-700 text-white p-6 space-y-6 shadow-lg"> {/* 원본 사이트 색상에 더 가깝게 조정 */}
      <h2 className="text-2xl font-bold mb-4 text-center">PREDICTIV</h2> {/* 로고 텍스트 중앙 정렬 */}
      <nav className="flex flex-col space-y-2"> {/* 간격 조정 */}
        {isDigitalTwinDetail && patientId ? ( // 디지털 트윈 상세 페이지일 경우
          <>
            <Link
              href={`/digital-twin/${patientId}`}
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname === `/digital-twin/${patientId}` ? 'bg-blue-800' : 'hover:bg-blue-600' // 활성/호버 색상 조정
              }`}
            >
              <HomeIcon /> {/* 홈 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">대시보드 홈</span>
            </Link>
            <Link
              href={`/digital-twin/${patientId}/diseases`}
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname.includes('/diseases') ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <DiseaseIcon /> {/* 질환 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">질환</span>
            </Link>
            <Link
              href={`/digital-twin/${patientId}/drugs`}
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname.includes('/drugs') ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <DrugIcon /> {/* 약물 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">약물</span>
            </Link>
            <Link
              href={`/digital-twin/${patientId}/wellness`}
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname.includes('/wellness') ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <WellnessIcon /> {/* 웰니스 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">웰니스</span>
            </Link>
            <Link
              href={`/digital-twin/${patientId}/variants`}
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname.includes('/variants') ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <VariantIcon /> {/* 변이 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">유전자 변이</span>
            </Link>
          </>
        ) : ( // 일반 대시보드 또는 다른 페이지일 경우
          <>
            <Link
              href="/digital-twin"
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname === '/digital-twin' ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <DashboardIcon /> {/* 대시보드 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">환자 목록</span> {/* "환자 목록"으로 대체 */}
            </Link>
            <Link
              href="/profile"
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname === '/profile' ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <ProfileIcon /> {/* 프로필 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">내 프로필</span>
            </Link>
            <Link
              href="/about"
              className={`py-2 px-3 rounded-lg transition-colors duration-200 flex items-center ${
                pathname === '/about' ? 'bg-blue-800' : 'hover:bg-blue-600'
              }`}
            >
              <AboutIcon /> {/* 회사 소개 아이콘 추가 (아래에 정의) */}
              <span className="font-semibold ml-3">회사 소개</span> {/* "회사 소개" 버튼 추가 */}
            </Link>
          </>
        )}
        <div className="pt-4 border-t border-blue-600"> {/* 구분선 색상 조정 */}
          <Link
            href="/logout"
            className="py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
          >
            <LogoutIcon /> {/* 로그아웃 아이콘 추가 (아래에 정의) */}
            <span className="font-semibold ml-3">로그아웃</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}

// 아이콘 컴포넌트 (간단한 SVG 아이콘 예시, 필요에 따라 교체 또는 라이브러리 사용)
// 원본 사이드바 이미지에서 보이는 아이콘을 참고하여 유사하게 구성했습니다.
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 11a1 1 0 011-1h14a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM2 7a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 00-2-2H4a2 2 0 00-2 2V7z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const AboutIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9.293 9.293a1 1 0 001.414 1.414L10 10.414V15a1 1 0 11-2 0v-4.586l-.293.293a1 1 0 00-1.414 1.414l-1 1a1 1 0 000 1.414l.707.707a1 1 0 001.414 0L10 12.414V15a1 1 0 001 1h2a1 1 0 100-2h-1V9.414l.293.293a1 1 0 001.414 0l.707-.707a1 1 0 000-1.414l-1-1z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
  </svg>
);

// 임시 아이콘 (원본 사이트 아이콘과 유사하게 변경 필요)
const DiseaseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.882a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.121 3H8.879a2 2 0 00-1.414.586L6.586 4.707A1 1 0 015.882 5H4zm.912 11.606A3.003 3.003 0 017 15a3 3 0 013-3c.83 0 1.5.398 2 .997V11h-4a1 1 0 00-1 1v3.586z" clipRule="evenodd" />
  </svg>
);

const DrugIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    <path d="M10 11a1 1 0 100-2 1 1 0 000 2zM10 12a1 1 0 100-2 1 1 0 000 2zM10 13a1 1 0 100-2 1 1 0 000 2zM10 14a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

const WellnessIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17.885 9.071a1 1 0 00-1.414-1.414L14 10.172l-1.474-1.474a1 1 0 00-1.414 1.414l1.475 1.475-1.475 1.475a1 1 0 001.414 1.414L14 13.828l1.475 1.475a1 1 0 001.414-1.414L15.828 12l1.475-1.475zM12.5 15a.5.5 0 000 1h5a.5.5 0 000-1h-5z" />
    <path fillRule="evenodd" d="M4 10a4 4 0 014-4h2a4 4 0 014 4v2H4v-2zm0 6a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const VariantIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);