// app/login/page.tsx
'use client'; // 클라이언트 컴포넌트로 지정
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // 에러 메시지 초기화

    // 가상 로그인 로직 (실제 서비스에서는 백엔드 API 호출로 대체)
    if (email === 'demo@predictivcare.com' && password === 'qweasd31d') {
      // 로그인 성공 시 더미 토큰 저장
      localStorage.setItem('token', 'dummy_auth_token_12345');
      router.push('/digital-twin'); // 환자 목록 페이지로 이동
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* PredictivAI 로고 */}
        <div className="mb-6">
          <Image
            src="/predictivai_logo.png" // 로고 이미지 경로 (public 폴더에 이미지 파일을 넣어주세요)
            alt="PredictivAI Logo"
            width={200}
            height={50}
            className="mx-auto"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">로그인</h2>

        {/* 사용자 모드 선택 */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">사용할 모드를 지정해주세요.</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200">
              NEW
            </button>
            <button className="px-6 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-400 hover:text-white transition duration-200">
              CLASSIC
            </button>
          </div>
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* 에러 메시지 표시 */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            로그인
          </button>
        </form>

        {/* 추가 링크 및 텍스트 */}
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">
            계정이 없으신가요?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              회원가입
            </a>
          </p>
          <p className="mb-2">
            <a href="#" className="text-blue-600 hover:underline">
              비밀번호 찾기
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            본 서비스는 의료 전문가를 위한 서비스입니다.
            <br />
            일반인의 오남용을 방지하기 위해 로그인 후 면책 조항에 동의하셔야 합니다.
          </p>
        </div>

        {/* 앱 스토어 링크 */}
        <div className="mt-6 flex justify-center space-x-4">
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
            <Image
              src="/app_store_badge.png" // App Store 뱃지 이미지 경로 (public 폴더에 이미지 파일을 넣어주세요)
              alt="App Store"
              width={120}
              height={40}
            />
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
            <Image
              src="/google_play_badge.png" // Google Play 뱃지 이미지 경로 (public 폴더에 이미지 파일을 넣어주세요)
              alt="Google Play"
              width={120}
              height={40}
            />
          </a>
        </div>
      </div>
    </div>
  );
}