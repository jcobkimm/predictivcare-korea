// app/digital-twin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddPatientModal from '../../components/AddPatientModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

// DNA 분석 상태 타입 정의 (이전과 동일)
export type DNAStatusKey = // <-- 'export' 키워드 확인
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

// DNA 분석 상태 매핑 (이전과 동일)
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

// 환자 데이터 인터페이스 간소화 (백엔드와 동일하게 유지)
interface Patient {
  id: string;
  name: string; // 성 + 이름
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


export default function DigitalTwinDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [dnaStatusFilter, setDnaStatusFilter] = useState<DNAStatusKey | 'All'>('All');
  const [showDeletedPatients, setShowDeletedPatients] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);


  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/patients'); // NestJS 백엔드 주소
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (e: any) {
        setError(`환자 데이터를 불러오는 데 실패했습니다: ${e.message}`);
        console.error("Failed to fetch patients:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = () => {
    // 검색 필터링은 filteredPatients에서 자동으로 처리됨
  };

  const handleAddNewPatient = async (newPatientData: Patient) => {
    try {
      const response = await fetch('http://localhost:3001/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatientData),
      });

      if (!response.ok) {
        throw new Error(`환자 추가 실패: ${response.status}`);
      }

      const addedPatient: Patient = await response.json();
      setPatients(prevPatients => [...prevPatients, addedPatient]);
      setIsAddPatientModalOpen(false);
      alert('새 환자가 성공적으로 추가되었습니다!');
    } catch (e: any) {
      alert(`환자 추가 중 오류 발생: ${e.message}`);
      console.error("Failed to add new patient:", e);
    }
  };

  const handleDeletePatient = async (password: string) => {
    const storedSimulatedPassword = localStorage.getItem('simulated_password') || 'qweasd31d';
    if (password !== storedSimulatedPassword) {
      alert('비밀번호가 일치하지 않습니다. 삭제할 수 없습니다.');
      return;
    }

    if (!patientToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/patients/${patientToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        setPatients(prevPatients => prevPatients.filter(p => p.id !== patientToDelete.id));
        alert(`${patientToDelete.name} 환자 정보가 성공적으로 삭제되었습니다.`);
      } else {
        const errorData = await response.json();
        throw new Error(`환자 삭제 실패: ${errorData.message || response.status}`);
      }
    } catch (e: any) {
      alert(`환자 삭제 중 오류 발생: ${e.message}`);
      console.error("Failed to delete patient:", e);
    } finally {
      setIsDeleteConfirmModalOpen(false);
      setPatientToDelete(null);
    }
  };


  const filteredPatients = patients.filter(patient => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let matchesSearch = true;

    if (searchTerm) {
      if (searchField === 'name') {
        const fullNameKor = (patient.lastName || '') + (patient.firstName || '');
        const fullNameEng = (patient.firstName || '') + ' ' + (patient.lastName || '');
        matchesSearch = fullNameKor.toLowerCase().includes(lowerCaseSearchTerm) ||
                        fullNameEng.toLowerCase().includes(lowerCaseSearchTerm);
      }
    }
    
    const matchesDnaStatus = dnaStatusFilter === 'All' || patient.dnaStatus === dnaStatusFilter;
    const matchesDeleted = !showDeletedPatients;

    return matchesSearch && matchesDnaStatus && matchesDeleted;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">환자 대시보드</h1>

      {/* 검색 및 필터링 섹션 */}
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
            className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[150px] text-gray-900 placeholder-gray-400"
            onKeyDown={(e) => {
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
          onClick={handleSearch}
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

      {/* 환자 목록 */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">환자 데이터를 불러오는 중입니다...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">오류: {error}</div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 flex items-center"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mr-4 flex-shrink-0">
                {patient.lastName ? patient.lastName.charAt(0) : ''}
              </div>
              <div className="flex-grow">
                <Link href={`/digital-twin/${patient.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {patient.lastName}{patient.firstName}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    DNA {DNA_STATUS_MAP[patient.dnaStatus]}
                  </p>
                  <p className="text-gray-500 text-xs">PREDICTIV ID {patient.dnaId}</p>
                  {patient.dob && (
                    <p className="text-gray-500 text-xs">DOB: {patient.dob}</p>
                  )}
                </Link>
              </div>
              <div
                className="ml-auto text-gray-500 hover:text-gray-700 cursor-pointer p-2 relative group"
                onClick={(e) => { e.stopPropagation(); setPatientToDelete({ id: patient.id, name: patient.lastName + patient.firstName }); setIsDeleteConfirmModalOpen(true); }}
              >
                &#8226;&#8226;&#8226;
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg col-span-full text-center py-10">
          해당 조건에 맞는 환자가 없습니다.
        </p>
      )}

      {/* ADD NEW PATIENT 버튼 - 환자 목록 아래로 이동 및 디자인 변경 */}
      <div className="flex justify-center mt-6">
        <button
          className="flex items-center text-green-600 border border-green-600 px-6 py-3 rounded-full hover:bg-green-50 transition-colors duration-200 text-lg font-semibold"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </span>
          새 환자 추가
        </button>
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

      {/* 새 환자 추가 모달 */}
      {isAddPatientModalOpen && (
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          onAddPatient={handleAddNewPatient}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmModalOpen && patientToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteConfirmModalOpen}
          onClose={() => setIsDeleteConfirmModalOpen(false)}
          onConfirmDelete={handleDeletePatient}
          patientName={patientToDelete.name}
        />
      )}
    </div>
  );
}

// PlusIcon (ADD NEW PATIENT 버튼용) - 더 이상 독립적으로 사용되지 않으므로 제거 또는 주석 처리 가능
// const PlusIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//   </svg>
// );