// app/digital-twin/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

// 환자 데이터 인터페이스 (백엔드 및 AddPatientModal과 동일하게 유지)
interface Patient {
  id: string;
  name: string; // 성 + 이름
  firstName: string; // <-- 추가
  lastName: string;  // <-- 추가
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
}

const DUMMY_PATIENTS: Patient[] = [
  { id: 'patient-1', name: '김철수', firstName: '철수', lastName: '김', dnaStatus: 'Completed', dnaId: 'PRDV-C4M6-2E1N-G8FM', age: 45, height: '175cm', weight: '70kg', ethnicity: '아시아인', occupation: '연구원', healthSummary: '유전적으로 심혈관 질환 위험이 약간 높지만, 현재까지는 양호한 건강 상태를 유지하고 있습니다. 규칙적인 운동과 건강한 식단으로 예방적 관리가 중요합니다.', dob: '07/01/1980', biologicalSex: 'Male', phoneNumber: '010-1234-5678', address: '서울시 강남구', address2: '테헤란로 123', city: '서울', state: '서울', zipcode: '12345', country: '대한민국' },
  { id: 'patient-2', name: '이영희', firstName: '영희', lastName: '이', dnaStatus: 'DNA Analyzed', dnaId: 'PRDV-B9K0-3F7S-H2QL', age: 30, height: '160cm', weight: '55kg', ethnicity: '아시아인', occupation: '디자이너', healthSummary: '특정 약물에 대한 반응성이 낮을 수 있는 유전적 특성이 발견되었습니다. 약물 복용 시 전문가와 상담하여 용량을 조절하는 것이 좋습니다. 전반적인 건강 상태는 매우 양호합니다.', dob: '05/15/1995', biologicalSex: 'Female', phoneNumber: '010-9876-5432', address: '부산시 해운대구', address2: '센텀남대로 45', city: '부산', state: '부산', zipcode: '60000', country: '대한민국'  },
  { id: 'patient-3', name: '박민준', firstName: '민준', lastName: '박', dnaStatus: 'Building Digital Twin', dnaId: 'PRDV-A1C2-D3E4-F5G6', age: 60, height: '170cm', weight: '80kg', ethnicity: '아시아인', occupation: '교수', healthSummary: '나이에 비해 활력이 좋은 유전적 특성을 가지고 있습니다. 하지만 특정 암 질환에 대한 가족력이 있어 정기적인 검진이 필요합니다. 건강한 생활 습관을 유지하는 것이 중요합니다.', dob: '03/20/1965', biologicalSex: 'Male', phoneNumber: '010-1122-3344', address: '대구시 중구', address2: '동성로 10', city: '대구', state: '대구', zipcode: '70000', country: '대한민국'  },
  { id: 'patient-4', name: '최지아', firstName: '지아', lastName: '최', dnaStatus: 'Awaiting Genetic Counseling', dnaId: 'PRDV-X7Y8-Z9A1-B2C3', age: 25, height: '165cm', weight: '50kg', ethnicity: '아시아인', occupation: '학생', healthSummary: '드문 유전 질환 보인자 가능성이 있어 추가 상담이 필요한 상태입니다. 현재 증상은 없지만, 미래의 건강 관리를 위해 유전 상담을 받는 것이 권장됩니다.', dob: '09/01/2000', biologicalSex: 'Female', phoneNumber: '010-5566-7788', address: '광주시 동구', address2: '충장로 50', city: '광주', state: '광주', zipcode: '50000', country: '대한민국'  },
  { id: 'patient-5', name: '정우진', firstName: '우진', lastName: '정', dnaStatus: 'Sample Received', dnaId: 'PRDV-P5Q6-R7S8-T9U0', age: 50, height: '180cm', weight: '75kg', ethnicity: '아시아인', occupation: '엔지니어', healthSummary: '영양소 흡수 및 대사에 관련된 유전적 특성이 발견되었습니다. 특정 비타민 결핍에 취약할 수 있으므로, 맞춤형 영양 보충제 섭취를 고려해볼 수 있습니다. 전반적으로 건강한 편입니다.', dob: '11/10/1975', biologicalSex: 'Male', phoneNumber: '010-9988-7766', address: '대전시 서구', address2: '둔산대로 100', city: '대전', state: '대전', zipcode: '30000', country: '대한민국'  },
];


export default function DigitalTwinDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const foundPatient = DUMMY_PATIENTS.find(p => p.id === id);
    setPatient(foundPatient || null);
  }, [id]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg font-semibold">
        환자 정보를 불러오는 중이거나 찾을 수 없습니다...
      </div>
    );
  }

  // 용어 한국화
  const koreanTerms = {
    actionable: '의학적 조치 필요',
    significant: '주요 변이',
    notable: '주목할 만한 변이',
    exploratory: '탐색성 변이',
    informative: '정보성 변이',
    wellness: '건강 관리',
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Image src="/predictiv_logo_small.png" alt="Predictiv Logo" width={30} height={30} className="mr-3"/>
          <h1 className="text-xl font-bold text-gray-800">
            안녕하세요, {patient.lastName}{patient.firstName}님! {/* 성 이름 (붙여쓰기) */}
            <p className="text-sm font-normal text-gray-500">
              디지털 트윈 상세 정보. 현재 상태: <span className="text-blue-600">{DNA_STATUS_MAP[patient.dnaStatus]}</span>
            </p>
          </h1>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600 text-sm">
          <span className="flex items-center font-semibold text-gray-700">
            <UserGroupIcon /> 분석된 질환: 28594
          </span>
          <span className="flex items-center font-semibold text-gray-700">
            <GeneIcon /> 발견된 변이: 17950
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">검색</button>
        </div>
      </div>

      {/* 환자 건강 요약 */}
      <section className="bg-blue-100 p-4 rounded-lg shadow-md mb-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">환자 건강 요약</h2>
        <p className="text-blue-700 text-sm leading-relaxed">
          {patient.healthSummary || '요약 정보가 없습니다.'}
        </p>
      </section>

      {/* 메인 콘텐츠 영역: 두 열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 열: 기본 정보, 생활 습관, 건강 이력 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              기본 정보 <CheckIcon />
            </h2>
            <div className="text-gray-700 space-y-2 text-sm">
              <p><strong>나이:</strong> {patient.age || 'N/A'}</p>
              <p><strong>키:</strong> {patient.height || 'N/A'}</p>
              <p><strong>체중:</strong> {patient.weight || 'N/A'}</p>
              <p><strong>인종:</strong> {patient.ethnicity || 'N/A'}</p>
              <p><strong>직업:</strong> {patient.occupation || 'N/A'}</p>
            </div>
          </section>

          {/* 생활 습관 */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              생활 습관 <CheckIcon />
            </h2>
            <div className="text-gray-700 space-y-2 text-sm">
              <p><strong>운동:</strong> N/A</p>
              <p><strong>흡연:</strong> N/A</p>
              <p><strong>소금 섭취:</strong> N/A</p>
              <p><strong>음주:</strong> N/A</p>
              <p><strong>지방 섭취:</strong> N/A</p>
            </div>
          </section>

          {/* 건강 이력 */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">건강 이력</h2>
            <div className="text-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">의료 기록</p> <span className="text-gray-500">N/A</span> <CheckIcon />
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">알레르기</p> <span className="text-gray-500">없음</span> <CheckIcon />
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">가족력</p> <span className="text-gray-500">N/A</span> <CheckIcon />
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">복용 약물</p> <span className="text-gray-500">N/A</span> <CheckIcon />
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 열: 희귀 유전 질환, 약물 반응, 건강 관리, 유전자 상담, 내 보고서 */}
        <div className="space-y-6">
          {/* 희귀 유전 질환 */}
          <section className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/dna_helix_icon.png" alt="DNA Helix" width={60} height={60} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">희귀 유전 질환</h2>
                <p className="text-gray-600 text-sm">1666가지 변이 감지됨</p>
                <div className="flex items-center text-xs mt-2 flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> {koreanTerms.actionable}: 0
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span> {koreanTerms.significant}: 0
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> {koreanTerms.notable}: 0
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span> {koreanTerms.exploratory}: 1666
                  </span>
                </div>
              </div>
            </div>
            <InfoIcon />
          </section>

          {/* 약물 반응 */}
          <section className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/pill_icon.png" alt="Pill" width={60} height={60} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">약물 반응</h2>
                <p className="text-gray-600 text-sm">총 45가지 약물 분석됨</p>
                <div className="flex items-center text-xs mt-2 flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> {koreanTerms.actionable}: 14
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span> {koreanTerms.informative}: 31
                  </span>
                </div>
              </div>
            </div>
            <InfoIcon />
          </section>

          {/* 건강 관리 (웰니스 의역) */}
          <section className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/leaf_icon.png" alt="Leaf" width={60} height={60} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{koreanTerms.wellness}</h2>
                <p className="text-gray-600 text-sm">총 54가지 유전자 테스트됨</p>
                <div className="flex items-center text-xs mt-2 space-x-3 flex-wrap gap-2">
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
              </div>
            </div>
            <InfoIcon />
          </section>

          {/* 유전자 상담 */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">유전자 상담</h2>
            <p className="text-gray-700 text-sm mb-4">
              미팅이 이미 생성되었습니다. Zoom 미팅에 참여하시려면 다음 링크를 사용하세요.
            </p>
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
          </section>

          {/* 내 보고서 */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
              내 보고서
              <button className="bg-blue-100 text-blue-600 p-1 rounded-full hover:bg-blue-200 transition-colors">
                <PlusIcon />
              </button>
            </h2>
            <p className="text-gray-600 text-sm text-center py-4">
              생성된 보고서가 없습니다.
            </p>
          </section>

          {/* 담당 매니저와 채팅 */}
          <section className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
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
    </div>
  );
}

// === 아이콘 컴포넌트들 (SVG) ===
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm-6 9a3 3 0 11-6 0 3 3 0 016 0zm11 0a3 3 0 11-6 0 3 3 0 016 0z" />
    <path fillRule="evenodd" d="M19 13A4 4 0 0115 9h-2l-1-1H7l-1 1H4a4 4 0 00-4 4v2a2 2 0 002 2h16a2 2 0 002-2v-2z" clipRule="evenodd" />
  </svg>
);

const GeneIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M11.973 2.507a.5.5 0 00-.73-.016L6.5 6.787a.5.5 0 00-.142.316l-.014.108V12a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V7.213a.5.5 0 00-.142-.316l-4.743-4.296zM10 16a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M10 18a.75.75 0 00.75-.75V15h.75a.75.75 0 000-1.5h-1.5a.75.75 0 00-.75.75v1.5c0 .414.336.75.75.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M10.75 2.25a.75.75 0 00-1.5 0v.75H8.5a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75V2.25z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-2 2a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
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