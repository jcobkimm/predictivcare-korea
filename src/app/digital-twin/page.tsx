// app/digital-twin/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link'; // Link 컴포넌트 import 추가

// DNA 분석 상태 타입 정의 (DNA_STATUS_MAP의 모든 키를 포함)
type DNAStatus =
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
  dnaStatus: DNAStatus; // dnaStatus를 위에 정의한 DNAStatus 타입으로 지정
  dnaId: string;
}

// DNA 분석 상태 매핑 (사용자 설명서 기반)
// Record 유틸리티 타입을 사용하여 DNAStatus 키와 string 값의 매핑을 명시
const DNA_STATUS_MAP: Record<DNAStatus, string> = {
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

// 더미 환자 데이터 (Patient 인터페이스를 따르도록 수정)
const DUMMY_PATIENTS: Patient[] = [
  { id: 'patient-1', name: '김철수', dnaStatus: 'Completed', dnaId: 'PRDV-2210-8015-1797' },
  { id: 'patient-2', name: '이영희', dnaStatus: 'DNA Analyzed', dnaId: 'PRDV-2210-8015-1798' },
  { id: 'patient-3', name: '박민준', dnaStatus: 'Building Digital Twin', dnaId: 'PRDV-2210-8015-1799' },
  { id: 'patient-4', name: '최지아', dnaStatus: 'Awaiting Genetic Counseling', dnaId: 'PRDV-2210-8015-1800' },
  { id: 'patient-5', name: '정우진', dnaStatus: 'Sample Received', dnaId: 'PRDV-2210-8015-1801' },
];

export default function DigitalTwinDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name'); // name, diseases, symptoms, drugs, genes
  const [dnaStatusFilter, setDnaStatusFilter] = useState<DNAStatus | 'All'>('All'); // 타입 지정
  const [showDeletedPatients, setShowDeletedPatients] = useState(false);

  const filteredPatients = DUMMY_PATIENTS.filter(patient => {
    // 검색어 필터링
    const matchesSearch = searchTerm === '' ||
      (searchField === 'name' && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false; // TODO: diseases, symptoms, drugs, genes 필드는 더미 데이터에 없으므로, 실제 데이터 연동 시 구현 필요

    // DNA 상태 필터링
    const matchesDnaStatus = dnaStatusFilter === 'All' || patient.dnaStatus === dnaStatusFilter;

    // 삭제된 환자 보기는 현재 구현하지 않음 (더미 데이터에 삭제 상태 없음)
    const matchesDeleted = !showDeletedPatients; // 항상 true로 설정하여 모든 환자 보이게 함

    return matchesSearch && matchesDnaStatus && matchesDeleted;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">환자 대시보드</h1>

      {/* 검색 및 필터링 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center gap-4">
        {/* 항목별 검색 */}
        <div className="flex items-center space-x-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
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
            className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[150px]"
          />
        </div>

        {/* DNA 분석 상태별 검색 */}
        <div className="flex items-center space-x-2">
          <select
            value={dnaStatusFilter}
            onChange={(e) => setDnaStatusFilter(e.target.value as DNAStatus | 'All')} // 타입 단언 추가
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="All">전체 DNA 분석 상태</option>
            {Object.entries(DNA_STATUS_MAP).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* 삭제된 환자 보기 체크박스 (현재 기능 없음) */}
        <div className="flex items-center ml-auto">
          <input
            type="checkbox"
            id="showDeleted"
            checked={showDeletedPatients}
            onChange={(e) => setShowDeletedPatients(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showDeleted" className="text-gray-700">삭제된 환자 보기</label>
        </div>
      </div>

      {/* 환자 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              // Link 컴포넌트를 사용하여 페이지 전환 시 전체 새로고침 방지
            >
              <Link href={`/digital-twin/${patient.id}`} className="block">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{patient.name}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">DNA ID:</span> {patient.dnaId}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">DNA 분석 상태:</span> {DNA_STATUS_MAP[patient.dnaStatus]}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg col-span-full text-center">
            해당 조건에 맞는 환자가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}