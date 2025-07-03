// app/digital-twin/page.tsx
'use client'; // 클라이언트 컴포넌트로 지정 - 반드시 맨 위에 있어야 합니다.

import { useState } from 'react'; // useState 훅 임포트 확인
import Link from 'next/link'; // Link 컴포넌트 임포트 확인

// DNA 분석 상태 타입 정의
type DNAStatusKey =
  | 'Awaiting Sample'
  | 'Sample Received'
  | 'Sample Extracted'
  | 'DNA Sequenced'
  | 'DNA Analyzed'
  | 'Building Digital Twin'
  | 'Awaiting Genetic Counseling'
  | 'Not reachable'
  | 'Completed'
  | 'Analyzing';

// 환자 데이터 인터페이스 정의
interface Patient {
  id: string;
  name: string;
  dnaStatus: DNAStatusKey;
  dnaId: string;
}

// DNA 분석 상태 매핑 (사용자 설명서 기반)
const DNA_STATUS_MAP: Record<DNAStatusKey, string> = {
  'Awaiting Sample': '샘플 대기 중',
  'Sample Received': '샘플 수령 완료',
  'Sample Extracted': '샘플 추출 완료',
  'DNA Sequenced': 'DNA 서열 분석 완료',
  'DNA Analyzed': 'DNA 데이터 분석 완료',
  'Building Digital Twin': '디지털 트윈 생성 중',
  'Awaiting Genetic Counseling': '유전자 상담 대기 중',
  'Not reachable': '연락 불가',
  'Completed': '모든 과정 완료',
  'Analyzing': '데이터 분석 중',
};

// 더미 환자 데이터
const DUMMY_PATIENTS: Patient[] = [
  { id: 'patient-1', name: '김철수', dnaStatus: 'Completed', dnaId: 'PRDV-2210-8015-1797' },
  { id: 'patient-2', name: '이영희', dnaStatus: 'DNA Analyzed', dnaId: 'PRDV-2210-8015-1798' },
  { id: 'patient-3', name: '박민준', dnaStatus: 'Building Digital Twin', dnaId: 'PRDV-2210-8015-1799' },
  { id: 'patient-4', name: '최지아', dnaStatus: 'Awaiting Genetic Counseling', dnaId: 'PRDV-2210-8015-1800' },
  { id: 'patient-5', name: '정우진', dnaStatus: 'Sample Received', dnaId: 'PRDV-2210-8015-1801' },
];

export default function DigitalTwinDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [dnaStatusFilter, setDnaStatusFilter] = useState<DNAStatusKey | 'All'>('All');
  const [showDeletedPatients, setShowDeletedPatients] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false); // 면책 조항 팝업 상태

  const filteredPatients = DUMMY_PATIENTS.filter(patient => {
    const matchesSearch = searchTerm === '' ||
      (searchField === 'name' && patient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // TODO: diseases, symptoms, drugs, genes 필드는 더미 데이터에 없으므로, 실제 데이터 연동 시 구현 필요

    const matchesDnaStatus = dnaStatusFilter === 'All' || patient.dnaStatus === dnaStatusFilter;
    const matchesDeleted = !showDeletedPatients;

    return matchesSearch && matchesDnaStatus && matchesDeleted;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">환자 대시보드</h1>

      {/* 검색 및 필터링 섹션 - 원본 디자인에 가깝게 조정 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white"
          >
            <option value="name">이름</option>
            <option value="diseases">질병</option>
            <option value="symptoms">증상</option>
            <option value="drugs">약물</option>
            <option value="genes">유전자</option>
          </select>
          <input
            type="text"
            placeholder={`${searchField === 'name' ? '이름' : searchField === 'diseases' ? '질병' : searchField === 'symptoms' ? '증상' : searchField === 'drugs' ? '약물' : searchField === 'genes' ? '유전자' : ''} 검색...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[150px] text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={dnaStatusFilter}
            onChange={(e) => setDnaStatusFilter(e.target.value as DNAStatusKey | 'All')}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white"
          >
            <option value="All">전체 DNA 분석 상태</option>
            {Object.entries(DNA_STATUS_MAP).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 ml-auto">
          검색
        </button>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showDeleted"
            checked={showDeletedPatients}
            onChange={(e) => setShowDeletedPatients(e.target.checked)}
            className="mr-2 accent-blue-600"
          />
          <label htmlFor="showDeleted" className="text-gray-700 text-sm">삭제된 환자 보기</label>
        </div>
      </div>

      {/* 환자 목록 - 원본 디자인에 가깝게 조정 */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 flex items-center"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mr-4 flex-shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-grow">
                <Link href={`/digital-twin/${patient.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">DNA {DNA_STATUS_MAP[patient.dnaStatus]}</p>
                  <p className="text-gray-500 text-xs">PREDICTIV ID {patient.dnaId}</p>
                </Link>
              </div>
              <div className="ml-auto text-gray-500 hover:text-gray-700 cursor-pointer">
                &#8226;&#8226;&#8226;
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg col-span-full text-center py-10">
            해당 조건에 맞는 환자가 없습니다.
          </p>
        )}
      </div>

      {/* Disclaimer 텍스트 및 팝업 트리거 */}
      <div className="fixed bottom-4 left-4 text-gray-600 text-sm cursor-pointer hover:underline"
           onClick={() => setShowDisclaimer(true)}>
        *Disclaimer
      </div>

      {/* Disclaimer 팝업 모달 */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">면책 조항</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              본 웹사이트의 정보는 직접적인 진단 목적 또는 유전학 전문가의 검토 없는 의료적 의사 결정에 사용되지 않습니다. 본 검사는 모든 유전적 발견을 보고하지 않습니다. 개인은 본 웹사이트에 포함된 정보만을 근거로 건강 행동을 변경해서는 안 됩니다. 본 웹사이트의 정보에 대해 궁금한 점이 있으면 의료 전문가에게 문의하시기 바랍니다.
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              onClick={() => setShowDisclaimer(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}