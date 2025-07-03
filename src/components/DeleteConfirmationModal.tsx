// components/DeleteConfirmationModal.tsx
'use client';

import { useState } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (password: string) => void;
  patientName: string;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirmDelete, patientName }: DeleteConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    onConfirmDelete(password); // 비밀번호를 부모 컴포넌트로 전달하여 확인 및 삭제 처리
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">환자 삭제 확인</h2>
        <p className="text-gray-700 mb-6">
          <span className="font-semibold">{patientName}</span> 환자의 정보를 삭제하시겠습니까?
          이 작업은 되돌릴 수 없습니다. 계속하려면 비밀번호를 입력하세요.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
            >
              삭제 확인
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}