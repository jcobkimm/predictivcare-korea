// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('demo');
  const [lastName, setLastName] = useState('user');
  const [email] = useState('demo@predictivcare.com'); // 이메일은 변경 불가
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // 컴포넌트 마운트 시 현재 로그인 정보 로드 (가상)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login'); // 토큰 없으면 로그인 페이지로 리다이렉트
    }
  }, [router]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (firstName.trim() === '' || lastName.trim() === '') {
        setMessage('이름과 성을 모두 입력해주세요.');
        setMessageType('error');
        return;
    }
    setMessage('프로필 정보가 성공적으로 업데이트되었습니다.');
    setMessageType('success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    // 현재 비밀번호 확인 (localStorage에 저장된 비밀번호와 비교)
    const storedSimulatedPassword = localStorage.getItem('simulated_password') || 'qweasd31d'; // 기본 비밀번호로 폴백
    if (currentPassword !== storedSimulatedPassword) {
      setMessage('현재 비밀번호가 올바르지 않습니다.');
      setMessageType('error');
      return;
    }

    // 새 비밀번호 유효성 검사
    if (!newPassword || newPassword.length < 6) {
      setMessage('새 비밀번호는 6자 이상이어야 합니다.');
      setMessageType('error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setMessageType('error');
      return;
    }

    // 비밀번호 변경 성공 (가상)
    localStorage.setItem('simulated_password', newPassword); // localStorage에 새 비밀번호 저장
    localStorage.removeItem('token'); // 기존 토큰 제거 (자동 로그아웃 유도)
    
    setMessage('비밀번호가 성공적으로 변경되었습니다. 보안을 위해 다시 로그인해 주세요.');
    setMessageType('success');
    
    // 입력 필드 초기화
    setNewPassword('');
    setConfirmNewPassword('');
    setCurrentPassword('');
    
    // 자동 로그아웃 후 로그인 페이지로 리다이렉션
    setTimeout(() => {
      router.push('/login');
    }, 1500); // 1.5초 후 리다이렉션
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">계정 정보</h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* 이름 및 성 정보 */}
        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                id="firstName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" // 글씨색 설정
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">성</label>
              <input
                type="text"
                id="lastName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" // 글씨색 설정
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed text-gray-700" // 글씨색 설정, 읽기 전용이므로 약간 어둡게
              value={email}
              readOnly
            />
             <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            정보 저장
          </button>
        </form>

        {/* 비밀번호 변경 */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">비밀번호 변경</h2>
          <p className="text-sm text-gray-600">비밀번호를 변경하려면 아래 필드를 채워주세요.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" // 글씨색 설정
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
              <input
                type="password"
                id="confirmNewPassword"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" // 글씨색 설정
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" // 글씨색 설정
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
}