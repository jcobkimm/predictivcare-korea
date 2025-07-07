// src/app/digital-twin/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AboutTestModal from '../../../components/AboutTestModal';
import RareDisorderInfoModal from '../../../components/RareDisorderInfoModal';

// DNA 분석 상태 타입 정의
export type DNAStatusKey =
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

// DNA 분석 상태 매핑
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

// 환자 데이터 인터페이스
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
}

// 페이지 props 타입 정의
interface DigitalTwinDetailProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// ⛔️ 여기를 최종적으로 수정합니다.
// searchParams를 받되, 사용하지 않으므로 변수명 앞에 '_'를 붙입니다.
export default function DigitalTwinDetail({ params, searchParams: _searchParams }: DigitalTwinDetailProps) {
  const { id } = params;
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showAboutTestModal, setShowAboutTestModal] = useState(false);
  const [showRareDisorderInfoModal, setShowRareDisorderInfoModal] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3001/patients/${id}`);
        if (!response.ok) {
          throw new Error(`환자 상세 정보를 불러오는 데 실패했습니다: ${response.status}`);
        }
        const data: Patient = await response.json();
        setPatient(data);
      } catch (e: unknown) {
        setError(`환자 정보를 불러오는 중 오류 발생: ${(e as Error).message}`);
        console.error("Failed to fetch patient detail:", e);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg font-semibold">
        환자 상세 정보를 불러오는 중입니다...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-lg font-semibold">
        오류: {error}
      </div>
    );
  }
  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg font-semibold">
        환자 데이터를 찾을 수 없습니다.
      </div>
    );
  }

  const koreanTerms = {
    actionable: '의학적 조치 필요',
    significant: '주요 변이',
    notable: '주목할 만한 변이',
    exploratory: '탐색성 변이',
    informative: '정보성 변이',
    wellness: '건강 관리',
  };

  const handleEditClick = (sectionName: string) => {
    alert(`${sectionName} 수정 기능은 아직 구현되지 않았습니다.`);
    console.log(`${sectionName} edit clicked for patient: ${patient.id}`);
  };

  const missingInfoText = "정보 없음";
  const dataPendingText = "DNA 샘플 대기 중";
  const isNewPatientWithPendingDNA = patient.dnaStatus === 'Awaiting Sample';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-xl mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <button onClick={() => setShowAboutTestModal(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
            <Image
              src="/question_mark_icon.png"
              alt="About this test"
              width={24}
              height={24}
            />
          </button>
          <Image src="/predictiv_logo_small.png" alt="Predictiv Logo" width={30} height={30} className="mr-3"/>
          <h1 className="text-xl font-bold text-gray-800">
            안녕하세요, {patient.lastName}{patient.firstName}님!
            <p className="text-sm font-normal text-gray-500">
              디지털 트윈 상세 정보. 현재 상태: <span className="text-blue-600">{DNA_STATUS_MAP[patient.dnaStatus]}</span>
            </p>
          </h1>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600 text-sm">
          <span className="flex items-center font-semibold text-gray-700">
            분석된 질환: {isNewPatientWithPendingDNA ? missingInfoText : '28594'}
          </span>
          <span className="flex items-center font-semibold text-gray-700">
            발견된 변이: {isNewPatientWithPendingDNA ? missingInfoText : '17950'}
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">검색</button>
        </div>
      </div>

      {/* 환자 건강 요약 */}
      <section className="bg-blue-100 p-4 rounded-lg shadow-lg mb-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">환자 건강 요약</h2>
        <p className="text-blue-700 text-sm leading-relaxed">
          {patient.healthSummary || missingInfoText}
        </p>
      </section>

      {/* 메인 콘텐츠 영역: 두 열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 열: 기본 정보, 생활 습관, 건강 이력 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              <Image src="/user_info_icon.png" alt="User Info" width={30} height={30} className="mr-2" />
              기본 정보
              <span onClick={() => handleEditClick('기본 정보')} className="text-gray-400 hover:text-blue-600 cursor-pointer">
                <EditIcon />
              </span>
            </h2>
            <div className="text-gray-700 space-y-2 text-sm text-left">
              <p><strong>나이:</strong> {patient.age || missingInfoText}</p>
              <p><strong>키:</strong> {patient.height || missingInfoText}</p>
              <p><strong>체중:</strong> {patient.weight || missingInfoText}</p>
              <p><strong>인종:</strong> {patient.ethnicity || missingInfoText}</p>
              <p><strong>직업:</strong> {patient.occupation || missingInfoText}</p>
            </div>
          </section>

          {/* 생활 습관 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              <Image src="/lifestyle_icon.png" alt="Lifestyle" width={30} height={30} className="mr-2" />
              생활 습관
              <span onClick={() => handleEditClick('생활 습관')} className="text-gray-400 hover:text-blue-600 cursor-pointer">
                <EditIcon />
              </span>
            </h2>
            <div className="text-gray-700 space-y-2 text-sm text-left">
              <p><strong>운동:</strong> {missingInfoText}</p>
              <p><strong>흡연:</strong> {missingInfoText}</p>
              <p><strong>소금 섭취:</strong> {missingInfoText}</p>
              <p><strong>음주:</strong> {missingInfoText}</p>
              <p><strong>지방 섭취:</strong> {missingInfoText}</p>
            </div>
          </section>

          {/* 건강 이력 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">건강 이력</h2>
            <div className="text-gray-700 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image src="/medical_record_icon.png" alt="Medical Record" width={20} height={20} className="mr-2" />
                  <p className="font-medium">의료 기록</p>
                </div>
                <span className="text-gray-500">{missingInfoText}</span>
                <span onClick={() => handleEditClick('의료 기록')} className="text-gray-400 hover:text-blue-600 cursor-pointer">
                  <EditIcon />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image src="/allergy_icon.png" alt="Allergy" width={20} height={20} className="mr-2" />
                  <p className="font-medium">알레르기</p>
                </div>
                <span className="text-gray-500">{missingInfoText}</span>
                <span onClick={() => handleEditClick('알레르기')} className="text-gray-400 hover:text-blue-600 cursor-pointer">
                  <EditIcon />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image src="/family_history_icon.png" alt="Family History" width={20} height={20} className="mr-2" />
                  <p className="font-medium">가족력</p>
                </div>
                <span className="text-gray-500">{missingInfoText}</span>
                <span onClick={() => handleEditClick('가족력')} className="text-gray-400 hover:text-blue-600 cursor-pointer">
                  <EditIcon />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image src="/medication_icon.png" alt="Medication" width={20} height={20} className="mr-2" />
                  <p className="font-medium">복용 약물</p>
                </div>
                <span className="text-gray-500">{missingInfoText}</span>
                <span onClick={() => handleEditClick('복용 약물')} className="text-gray-400 hover:text-blue-600 cursor-pointer">
                  <EditIcon />
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 열: 희귀 유전 질환, 약물 반응, 건강 관리, 유전자 상담, 내 보고서 */}
        <div className="space-y-6">
          {/* 희귀 유전 질환 */}
          <section className="bg-white p-6 rounded-lg shadow-lg flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/dna_helix_icon.png" alt="DNA Helix" width={60} height={60} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">희귀 유전 질환</h2>
                {isNewPatientWithPendingDNA ? (
                  <p className="text-blue-600 text-sm">{dataPendingText}</p>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm">1666가지 변이 감지됨</p>
                    <div className="flex flex-col items-end text-right text-xs mt-2 space-y-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800 w-full justify-between">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> {koreanTerms.actionable}: 0
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 w-full justify-between">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span> {koreanTerms.significant}: 0
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 w-full justify-between">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> {koreanTerms.notable}: 0
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 w-full justify-between">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span> {koreanTerms.exploratory}: 1666
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* 느낌표(정보) 아이콘 추가 */}
            <button onClick={() => setShowRareDisorderInfoModal(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                <Image
                    src="/info_circle_icon.png"
                    alt="Info"
                    width={24}
                    height={24}
                />
            </button>
          </section>

          {/* 약물 반응 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <Image src="/pill_icon.png" alt="Pill" width={60} height={60} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">약물 반응</h2>
                {isNewPatientWithPendingDNA ? (
                  <p className="text-blue-600 text-sm">{dataPendingText}</p>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm">총 45가지 약물 분석됨</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-2 space-x-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> {koreanTerms.actionable}: 14
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span> {koreanTerms.informative}: 31
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 건강 관리 (웰니스 의역) */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <Image src="/leaf_icon.png" alt="Leaf" width={60} height={60} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{koreanTerms.wellness}</h2>
                {isNewPatientWithPendingDNA ? (
                  <p className="text-blue-600 text-sm">{dataPendingText}</p>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm">총 54가지 유전자 테스트됨</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-2 space-x-3">
                      <div className="flex items-center">
                        <span className="text-blue-600 font-semibold text-base mr-1">8</span>
                        <span className="text-gray-600">영양</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 font-semibold text-base mr-1">9</span>
                        <span className="text-gray-600">피트니스</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 font-semibold text-base mr-1">7</span>
                        <span className="text-gray-600">장수</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 유전자 상담 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">유전자 상담</h2>
            <p className="text-gray-700 text-sm mb-4">
              {isNewPatientWithPendingDNA ? missingInfoText : '미팅이 이미 생성되었습니다. Zoom 미팅에 참여하시려면 다음 링크를 사용하세요.'}
            </p>
            {!isNewPatientWithPendingDNA && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  미팅 시작
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  미팅 참여
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  미팅 재시작
                </button>
              </div>
            )}
          </section>

          {/* 내 보고서 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              내 보고서
              {!isNewPatientWithPendingDNA && (
                <button className="bg-blue-100 text-blue-600 p-1 rounded-full hover:bg-blue-200 transition-colors">
                  <PlusIcon />
                </button>
              )}
            </h2>
            <p className="text-gray-600 text-sm text-center py-4">
              {isNewPatientWithPendingDNA ? missingInfoText : '생성된 보고서가 없습니다.'}
            </p>
          </section>

          {/* 담당 매니저와 채팅 */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center">
              <ChatIcon />
              <span className="ml-2">담당 매니저와 채팅</span>
            </button>
          </section>
        </div>
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

      {/* AboutTestModal 렌더링 */}
      {showAboutTestModal && (
        <AboutTestModal
          isOpen={showAboutTestModal}
          onClose={() => setShowAboutTestModal(false)}
        />
      )}

      {/* RareDisorderInfoModal 렌더링 추가 */}
      {showRareDisorderInfoModal && (
        <RareDisorderInfoModal
          isOpen={showRareDisorderInfoModal}
          onClose={() => setShowRareDisorderInfoModal(false)}
        />
      )}
    </div>
  );
}

// === 아이콘 컴포넌트들 (SVG) ===
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
);

const ChatIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-4 4v-4H2a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2zM6 9H4v2h2V9zm8-2H6v2h8V7zm0 4H6v2h8v-2z" clipRule="evenodd" />
  </svg>
);