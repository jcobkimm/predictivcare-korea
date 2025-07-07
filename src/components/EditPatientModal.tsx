// components/EditPatientModal.tsx
'use client';

import { useState, useEffect } from 'react';
import type { DNAStatusKey } from '/Users/jacobkim/Desktop/predictivcare-korea/src/app/digital-twin/page'; // DNAStatusKey 임포트

// Patient 인터페이스는 백엔드와 동일하게 유지
interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dnaStatus: DNAStatusKey;
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

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient: (patientData: Patient) => Promise<void>;
  patient: Patient; // 수정할 환자 객체
}

// export default function으로 컴포넌트를 내보냄
export default function EditPatientModal({ isOpen, onClose, onUpdatePatient, patient }: EditPatientModalProps) {
  // 초기값을 patient prop에서 가져오도록 설정
  const [firstName, setFirstName] = useState(patient.firstName || '');
  const [lastName, setLastName] = useState(patient.lastName || '');
  const [biologicalSex, setBiologicalSex] = useState(patient.biologicalSex || '');
  const [dob, setDob] = useState(patient.dob || '');
  const [phoneNumber, setPhoneNumber] = useState(patient.phoneNumber || '');
  const [address, setAddress] = useState(patient.address || '');
  const [address2, setAddress2] = useState(patient.address2 || '');
  const [city, setCity] = useState(patient.city || '');
  const [state, setState] = useState(patient.state || '');
  const [zipcode, setZipcode] = useState(patient.zipcode || '');
  const [country, setCountry] = useState(patient.country || '');
  const [error, setError] = useState('');

  // patient prop이 변경될 때마다 폼 필드를 업데이트 (선택된 환자가 바뀔 경우)
  useEffect(() => {
    setFirstName(patient.firstName || '');
    setLastName(patient.lastName || '');
    setBiologicalSex(patient.biologicalSex || '');
    setDob(patient.dob || '');
    setPhoneNumber(patient.phoneNumber || '');
    setAddress(patient.address || '');
    setAddress2(patient.address2 || '');
    setCity(patient.city || '');
    setState(patient.state || '');
    setZipcode(patient.zipcode || '');
    setCountry(patient.country || '');
    setError(''); // 오류 메시지 초기화
  }, [patient]);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 수정 불가능 필드는 유효성 검사에서 제외하거나 기존 값을 사용
    // 전화번호, 주소, 도시, 주/도, 우편번호, 국가는 여전히 필수
    if (!phoneNumber || !address || !city || !state || !zipcode || !country) {
      setError('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 생년월일 형식 MM/DD/YYYY 확인 (수정 불가능하더라도 기존 값의 유효성 확인은 중요)
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
    if (patient.dob && !dobRegex.test(patient.dob)) { // patient.dob을 직접 검사
      setError('환자의 생년월일 형식이 올바르지 않습니다 (MM/DD/YYYY).');
      return;
    }

    const updatedPatient: Patient = {
      ...patient, // 기존 환자 정보 유지 (ID 등)
      // readOnly 필드는 patient의 원본 값을 사용하도록 명시적으로 할당
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: patient.dob,
      biologicalSex: patient.biologicalSex,

      // 수정 가능한 필드는 현재 상태 값을 사용
      phoneNumber,
      address,
      address2,
      city,
      state,
      zipcode,
      country,
      // 이름은 성+이름으로 다시 구성
      name: `${patient.lastName}${patient.firstName}`,
    };

    await onUpdatePatient(updatedPatient);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">환자 정보 수정</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input type="text" value={firstName} readOnly // <-- readOnly
                   className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성</label>
            <input type="text" value={lastName} readOnly // <-- readOnly
                   className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 cursor-not-allowed" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">생년월일 (MM/DD/YYYY)</label>
            <input type="text" value={dob} readOnly // <-- readOnly
                   className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 cursor-not-allowed" placeholder="MM/DD/YYYY" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">성별</label>
            <select value={biologicalSex} disabled // <-- disabled로 변경
                    className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 cursor-not-allowed" >
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
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold mr-4">
              정보 저장
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}