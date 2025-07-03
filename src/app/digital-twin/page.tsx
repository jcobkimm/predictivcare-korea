// app/digital-twin/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// DNA 분석 상태 타입 정의: 가능한 모든 상태 문자열 리터럴을 정확히 나열
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

// 환자 데이터 인터페이스
interface Patient {
  id: string;
  name: string;
  dnaStatus: DNAStatusKey; // dnaStatus 속성이 DNAStatusKey 타입임을 명시
  dnaId: string;
  age?: number;
  height?: string;
  weight?: string;
  ethnicity?: string;
  occupation?: string;
  healthSummary?: string;
}

// DNA 분석 상태 매핑: Record 유틸리티 타입을 사용하여 DNAStatusKey와 string 매핑을 명시
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

// 더미 환자 데이터: Patient[] 타입으로 명시하여 타입스크립트가 정확히 검사하도록 함
const DUMMY_PATIENTS: Patient[] = [
  { id: 'patient-1', name: '김철수', dnaStatus: 'Completed', dnaId: 'PRDV-2210-8015-1797', age: 45, height: '175cm', weight: '70kg', ethnicity: '아시아인', occupation: '연구원', healthSummary: '유전적으로 심혈관 질환 위험이 약간 높지만, 현재까지는 양호한 건강 상태를 유지하고 있습니다. 규칙적인 운동과 건강한 식단으로 예방적 관리가 중요합니다.' },
  { id: 'patient-2', name: '이영희', dnaStatus: 'DNA Analyzed', dnaId: 'PRDV-2210-8015-1798', age: 30, height: '160cm', weight: '55kg', ethnicity: '아시아인', occupation: '디자이너', healthSummary: '특정 약물에 대한 반응성이 낮을 수 있는 유전적 특성이 발견되었습니다. 약물 복용 시 전문가와 상담하여 용량을 조절하는 것이 좋습니다. 전반적인 건강 상태는 매우 양호합니다.' },
  { id: 'patient-3', name: '박민준', dnaStatus: 'Building Digital Twin', dnaId: 'PRDV-2210-8015-1799', age: 60, height: '170cm', weight: '80kg', ethnicity: '아시아인', occupation: '교수', healthSummary: '나이에 비해 활력이 좋은 유전적 특성을 가지고 있습니다. 하지만 특정 암 질환에 대한 가족력이 있어 정기적인 검진이 필요합니다. 건강한 생활 습관을 유지하는 것이 중요합니다.' },
  { id: 'patient-4', name: '최지아', dnaStatus: 'Awaiting Genetic Counseling', dnaId: 'PRDV-2210-8015-1800', age: 25, height: '165cm', weight: '50kg', ethnicity: '아시아인', occupation: '학생', healthSummary: '드문 유전 질환 보인자 가능성이 있어 추가 상담이 필요한 상태입니다. 현재 증상은 없지만, 미래의 건강 관리를 위해 유전 상담을 받는 것이 권장됩니다.' },
  { id: 'patient-5', name: '정우진', dnaStatus: 'Sample Received', dnaId: 'PRDV-2210-8015-1801', age: 50, height: '180cm', weight: '75kg', ethnicity: '아시아인', occupation: '엔지니어', healthSummary: '영양소 흡수 및 대사에 관련된 유전적 특성이 발견되었습니다. 특정 비타민 결핍에 취약할 수 있으므로, 맞춤형 영양 보충제 섭취를 고려해볼 수 있습니다. 전반적으로 건강한 편입니다.' },
];


export default function DigitalTwinDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [dnaStatusFilter, setDnaStatusFilter] = useState<DNAStatusKey | 'All'>('All');
  const [showDeletedPatients, setShowDeletedPatients] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false); // 면책 조항 팝업 상태

  // 검색 버튼 클릭 시 또는 입력값이 변경될 때마다 필터링 적용
  const handleSearch = () => {
    // 필터링 로직은 useState에 의해 이미 실시간으로 적용되고 있음
    // 실제 백엔드 연동 시, 이 함수 내에서 API 호출을 트리거할 수 있습니다.
  };

  const filteredPatients = DUMMY_PATIENTS.filter(patient => {
    // 검색어 필터링
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let matchesSearch = true;

    if (searchTerm) { // 검색어가 있을 때만 필터링 적용
      if (searchField === 'name') {
        matchesSearch = patient.name.toLowerCase().includes(lowerCaseSearchTerm);
      }
      // TODO: diseases, symptoms, drugs, genes 필터링 로직 추가 (더미 데이터에 해당 필드 추가 후)
      // else if (searchField === 'diseases') { matchesSearch = patient.diseases?.toLowerCase().includes(lowerCaseSearchTerm); }
      // ...
    }
    
    // DNA 상태 필터링
    const matchesDnaStatus = dnaStatusFilter === 'All' || patient.dnaStatus === dnaStatusFilter;

    // 삭제된 환자 보기는 현재 구현하지 않음 (더미 데이터에 삭제 상태 없음)
    const matchesDeleted = !showDeletedPatients; // 항상 true로 설정하여 모든 환자 보이게 함

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
            onKeyDown={(e) => { // 엔터 키 입력 시 검색 트리거
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
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

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 ml-auto"
          onClick={handleSearch} // 검색 버튼 클릭 시 handleSearch 호출
        >
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
      <div className="fixed bottom-4 left-4 text-gray-600 text-sm cursor-pointer hover:underline z-40"
           onClick={() => setShowDisclaimer(true)}>
        *면책 조항
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