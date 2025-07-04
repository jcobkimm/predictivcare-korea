// components/AddPatientModal.tsx
'use client';

import { useState } from 'react';
import type { DNAStatusKey } from '/Users/jacobkim/Desktop/predictivcare-korea/src/app/digital-twin/page'; // DNAStatusKey 임포트 경로 확인

// 환자 ID 생성을 위한 헬퍼 함수
const generatePredictivId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PRDV-';
  for (let i = 0; i < 3; i++) { // 3자리 숫자-문자 조합
    result += Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    if (i < 2) result += '-';
  }
  return result;
};

// 이 모달에서 사용할 환자 데이터 인터페이스 (백엔드의 Patient와 동일하게 간소화)
interface Patient {
  id: string;
  name: string; // 성 + 이름 (자동 생성)
  firstName: string;
  lastName: string;
  dnaStatus: DNAStatusKey; // DNAStatusKey 타입 사용
  dnaId: string;
  age?: number;
  height?: string;
  weight?: string;
  ethnicity?: string;
  occupation?: string;
  healthSummary?: string;
  dob?: string;
  biologicalSex?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  // survey 관련 필드들은 모두 제거합니다.
}

// 모달 컴포넌트 Props 타입 정의
interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patientData: Patient) => Promise<void>; // <-- 반환 타입을 Promise<void>로 정확히 명시
}

export default function AddPatientModal({ isOpen, onClose, onAddPatient }: AddPatientModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biologicalSex, setBiologicalSex] = useState('');
  const [dob, setDob] = useState(''); // MM/DD/YYYY
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => { // <-- handleSubmit도 async로 변경
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !biologicalSex || !dob || !phoneNumber || !address || !city || !state || !zipcode || !country) {
      setError('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 생년월일 형식 MM/DD/YYYY 확인
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
    if (!dobRegex.test(dob)) {
      setError('생년월일 형식이 올바르지 않습니다 (MM/DD/YYYY).');
      return;
    }

    const newPatient: Patient = {
      id: `temp-${Date.now()}`,
      name: `${lastName}${firstName}`, // 성 이름 (붙여쓰기)
      firstName,
      lastName,
      dnaStatus: 'Awaiting Sample', // DNAStatusKey에 포함된 정확한 문자열 사용
      dnaId: generatePredictivId(),
      dob,
      biologicalSex,
      phoneNumber,
      address,
      address2,
      city,
      state,
      zipcode,
      country,
    };

    await onAddPatient(newPatient); // <-- await 추가
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">새 환자 추가</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">생년월일 (MM/DD/YYYY)</label>
            <input type="text" value={dob} onChange={(e) => setDob(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" placeholder="MM/DD/YYYY" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성별</label>
            <select value={biologicalSex} onChange={(e) => setBiologicalSex(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white" required>
              <option value="">선택하세요</option>
              <option value="Male">남성</option>
              <option value="Female">여성</option>
              <option value="Other">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">전화번호</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">주소</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">상세 주소 (선택 사항)</label>
            <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">도시</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">주/도</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">우편번호</label>
            <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">국가</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white" required>
              <option value="">선택하세요</option>
              <option value="South Korea">대한민국</option>
              <option value="USA">미국</option>
              <option value="Canada">캐나다</option>
              {/* 필요한 다른 국가 추가 */}
            </select>
          </div>

          <div className="md:col-span-2 text-center mt-6">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold mr-4">
              환자 등록
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}