// app/digital-twin/[id]/survey/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Patient 인터페이스는 백엔드 서비스와 동일하게 유지
interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dnaStatus: string; // NestJS 백엔드에서 string으로 처리
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

  // Survey Fields
  reasonForGeneticTest?: string;
  bloodType?: string;
  birthDefects?: boolean;
  birthDefectsDetails?: string;

  exerciseFrequency?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  saltIntake?: string;
  fatIntake?: string;

  diagnosedDiseases?: {
    cancer?: boolean; cancerAge?: string; diabetes?: boolean; diabetesAge?: string;
    heartDisease?: boolean; heartDiseaseAge?: string; stroke?: boolean; strokeAge?: string;
    hypertension?: boolean; hypertensionAge?: string; kidneyDisease?: boolean; kidneyDiseaseAge?: string;
    liverDisease?: boolean; liverDiseaseAge?: string; thyroidDisease?: boolean; thyroidDiseaseAge?: string;
    autoimmuneDisease?: boolean; autoimmuneDiseaseAge?: string; neurologicalDisorder?: boolean; neurologicalDisorderAge?: string;
    otherDiseases?: string;
  };

  familyHistory?: {
    cancer?: boolean; cancerRelation?: string; diabetes?: boolean; diabetesRelation?: string;
    heartDisease?: boolean; heartDiseaseRelation?: string; stroke?: boolean; strokeRelation?: string;
    hypertension?: boolean; hypertensionRelation?: string; kidneyDisease?: boolean; kidneyDiseaseRelation?: string;
    liverDisease?: boolean; liverDiseaseRelation?: string; thyroidDisease?: boolean; thyroidDiseaseRelation?: string;
    autoimmuneDisease?: boolean; autoimmuneDiseaseRelation?: string; neurologicalDisorder?: boolean; neurologicalDisorderRelation?: string;
  };

  hereditaryDiseases?: {
    cysticFibrosis?: boolean; cysticFibrosisDetails?: string; sickleCellAnemia?: boolean; sickleCellAnemiaDetails?: string;
    taySachsDisease?: boolean; taySachsDiseaseDetails?: string; otherHereditaryDiseases?: string;
  };

  currentMedications?: string;
  pastTreatments?: string;
  allergiesToMedication?: string;

  consentToGeneticCounseling?: boolean;
  consentToDataUse?: boolean;
}

export default function SurveyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 설문 데이터 상태 (부분 업데이트를 위해 기존 데이터와 병합)
  const [surveyFormData, setSurveyFormData] = useState<Partial<Patient>>({});

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/patients/${id}`);
        if (!response.ok) {
          throw new Error(`환자 정보를 불러오는 데 실패했습니다: ${response.status}`);
        }
        const data: Patient = await response.json();
        setPatientData(data);
        setSurveyFormData(data); // 기존 데이터를 폼 데이터로 초기화
      } catch (e: any) {
        setError(`환자 정보를 불러오는 중 오류 발생: ${e.message}`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFormChange = (field: string, value: any) => {
    setSurveyFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedFormChange = (section: keyof Patient, field: string, value: any) => {
    setSurveyFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object || {}), // 기존 중첩 객체 유지 또는 초기화
        [field]: value
      }
    }));
  };

  const handleSubmitSurvey = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3001/patients/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyFormData),
      });

      if (!response.ok) {
        throw new Error(`설문 데이터 업데이트 실패: ${response.status}`);
      }
      alert('설문 데이터가 성공적으로 업데이트되었습니다!');
      router.push(`/digital-twin/${id}`); // 업데이트 후 상세 페이지로 이동
    } catch (e: any) {
      setError(`설문 데이터 업데이트 중 오류 발생: ${e.message}`);
      console.error(e);
      alert(`설문 데이터 업데이트 중 오류 발생: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="text-center py-10">환자 설문 데이터를 불러오는 중입니다...</div>;
  if (error) return <div className="text-center py-10 text-red-600">오류: {error}</div>;
  if (!patientData) return <div className="text-center py-10">환자 데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          종합 유전 건강 설문조사
        </h1>
        <div className="flex justify-between items-center mb-6">
          <span className="text-blue-600 font-semibold">단계 {currentStep} / 7</span>
          <div className="text-gray-600 text-sm">
            {patientData.lastName}{patientData.firstName} ({patientData.id})
          </div>
        </div>

        {/* 설문조사 단계별 내용 */}
        {currentStep === 1 && (
          <Page1BasicInfo
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}
        {currentStep === 2 && (
          <Page2Lifestyle
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}
        {currentStep === 3 && (
          <Page3PersonalMedicalHistory
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}
        {currentStep === 4 && (
          <Page4FamilyMedicalHistory
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}
        {currentStep === 5 && (
          <Page5HereditaryDiseaseHistory
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}
        {currentStep === 6 && (
          <Page6TreatmentsMedication
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}
        {currentStep === 7 && (
          <Page7ConsentForm
            patientId={id}
            data={surveyFormData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
          />
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              이전
            </button>
          )}
          {currentStep < 7 ? (
            <button
              onClick={handleNextStep}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${currentStep === 1 ? 'ml-auto' : ''}`}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmitSurvey}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              설문 제출
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 각 설문조사 페이지 컴포넌트 ---
// 각 페이지는 data, onChange, onNestedChange props를 받습니다.

interface SurveyPageProps {
    patientId: string;
    data: Partial<Patient>;
    onChange: (field: string, value: any) => void;
    onNestedChange: (section: keyof Patient, field: string, value: any) => void;
}

const Page1BasicInfo = ({ data, onChange }: SurveyPageProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">1. 기본 정보</h2>
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">유전자 검사 주된 이유</label>
            <select
                value={data.reasonForGeneticTest || ''}
                onChange={(e) => onChange('reasonForGeneticTest', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
            >
                <option value="">선택하세요</option>
                <option value="Family History">가족력</option>
                <option value="Proactive Health & Wellness">사전 예방적 건강 & 웰니스</option>
                <option value="Unexplained Persistent Physical Symptoms">원인 불명의 지속적인 신체 증상</option>
                <option value="Other">기타</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">혈액형</label>
            <input
                type="text"
                value={data.bloodType || ''}
                onChange={(e) => onChange('bloodType', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            />
        </div>
        <div className="flex items-center">
            <input
                type="checkbox"
                id="birthDefects"
                checked={data.birthDefects || false}
                onChange={(e) => onChange('birthDefects', e.target.checked)}
                className="mr-2 accent-blue-600"
            />
            <label htmlFor="birthDefects" className="text-sm font-medium text-gray-700">선천적 결함이 있습니까?</label>
        </div>
        {data.birthDefects && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상세 내용</label>
                <textarea
                    value={data.birthDefectsDetails || ''}
                    onChange={(e) => onChange('birthDefectsDetails', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                ></textarea>
            </div>
        )}
    </div>
  </div>
);

const Page2Lifestyle = ({ data, onChange }: SurveyPageProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">2. 생활 습관</h2>
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">운동 빈도</label>
            <select
                value={data.exerciseFrequency || ''}
                onChange={(e) => onChange('exerciseFrequency', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
            >
                <option value="">선택하세요</option>
                <option value="Daily">매일</option>
                <option value="3-4 Times/Week">주 3-4회</option>
                <option value="1-2 Times/Week">주 1-2회</option>
                <option value="Rarely">거의 안함</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">흡연 여부</label>
            <select
                value={data.smokingStatus || ''}
                onChange={(e) => onChange('smokingStatus', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
            >
                <option value="">선택하세요</option>
                <option value="Non-smoker">비흡연</option>
                <option value="Former Smoker">과거 흡연</option>
                <option value="Current Smoker">현재 흡연</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">음주량</label>
            <input
                type="text"
                value={data.alcoholConsumption || ''}
                onChange={(e) => onChange('alcoholConsumption', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소금 섭취</label>
            <select
                value={data.saltIntake || ''}
                onChange={(e) => onChange('saltIntake', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
            >
                <option value="">선택하세요</option>
                <option value="Low">낮음</option>
                <option value="Medium">보통</option>
                <option value="High">높음</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">지방 섭취</label>
            <select
                value={data.fatIntake || ''}
                onChange={(e) => onChange('fatIntake', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
            >
                <option value="">선택하세요</option>
                <option value="Low">낮음</option>
                <option value="Medium">보통</option>
                <option value="High">높음</option>
            </select>
        </div>
    </div>
  </div>
);

const Page3PersonalMedicalHistory = ({ data, onNestedChange }: SurveyPageProps) => {
    // diagnosedDiseases 객체 초기화 (존재하지 않을 경우)
    const diseases = data.diagnosedDiseases || {};

    const handleDiseaseChange = (disease: string, checked: boolean) => {
        onNestedChange('diagnosedDiseases', disease, checked);
        if (!checked) {
            onNestedChange('diagnosedDiseases', `${disease}Age`, undefined); // 체크 해제 시 나이 필드 초기화
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">3. 개인 병력</h2>
            <p className="text-sm text-gray-600 mb-4">진단된 질병에 체크하고 진단받은 연령을 입력하세요. 정확한 연령을 모르면 근사치를 입력하세요.</p>
            <div className="space-y-3">
                {[
                    { key: 'cancer', label: '암' },
                    { key: 'diabetes', label: '당뇨병' },
                    { key: 'heartDisease', label: '심장 질환' },
                    { key: 'stroke', label: '뇌졸중' },
                    { key: 'hypertension', label: '고혈압' },
                    { key: 'kidneyDisease', label: '신장 질환' },
                    { key: 'liverDisease', label: '간 질환' },
                    { key: 'thyroidDisease', label: '갑상선 질환' },
                    { key: 'autoimmuneDisease', label: '자가면역 질환' },
                    { key: 'neurologicalDisorder', label: '신경학적 질환' },
                ].map((disease) => (
                    <div key={disease.key} className="flex items-center justify-between py-1 border-b border-gray-100">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`diag-${disease.key}`}
                                checked={diseases[disease.key as keyof typeof diseases] || false}
                                onChange={(e) => handleDiseaseChange(disease.key, e.target.checked)}
                                className="mr-2 accent-blue-600"
                            />
                            <label htmlFor={`diag-${disease.key}`} className="text-sm font-medium text-gray-700">{disease.label}</label>
                        </div>
                        {diseases[disease.key as keyof typeof diseases] && (
                            <input
                                type="text"
                                placeholder="진단 연령 (예: 50대 초반)"
                                value={diseases[`${disease.key}Age` as keyof typeof diseases] || ''}
                                onChange={(e) => onNestedChange('diagnosedDiseases', `${disease.key}Age`, e.target.value)}
                                className="ml-4 p-1 border border-gray-300 rounded-md text-sm w-48 text-gray-900"
                            />
                        )}
                    </div>
                ))}
                <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">기타 질병 (상세 내용)</label>
                    <textarea
                        value={diseases.otherDiseases || ''}
                        onChange={(e) => onNestedChange('diagnosedDiseases', 'otherDiseases', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

const Page4FamilyMedicalHistory = ({ data, onNestedChange }: SurveyPageProps) => {
    const familyDiseases = data.familyHistory || {};

    const handleFamilyDiseaseChange = (disease: string, checked: boolean) => {
        onNestedChange('familyHistory', disease, checked);
        if (!checked) {
            onNestedChange('familyHistory', `${disease}Relation`, undefined); // 체크 해제 시 관계 필드 초기화
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">4. 가족 병력</h2>
            <p className="text-sm text-gray-600 mb-4">가족 중에 진단된 질병에 체크하고 가족 관계를 입력하세요. (생물학적 가족만 해당)</p>
            <div className="space-y-3">
                {[
                    { key: 'cancer', label: '암' },
                    { key: 'diabetes', label: '당뇨병' },
                    { key: 'heartDisease', label: '심장 질환' },
                    { key: 'stroke', label: '뇌졸중' },
                    { key: 'hypertension', label: '고혈압' },
                    { key: 'kidneyDisease', label: '신장 질환' },
                    { key: 'liverDisease', label: '간 질환' },
                    { key: 'thyroidDisease', label: '갑상선 질환' },
                    { key: 'autoimmuneDisease', label: '자가면역 질환' },
                    { key: 'neurologicalDisorder', label: '신경학적 질환' },
                ].map((disease) => (
                    <div key={disease.key} className="flex items-center justify-between py-1 border-b border-gray-100">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`fam-${disease.key}`}
                                checked={familyDiseases[disease.key as keyof typeof familyDiseases] || false}
                                onChange={(e) => handleFamilyDiseaseChange(disease.key, e.target.checked)}
                                className="mr-2 accent-blue-600"
                            />
                            <label htmlFor={`fam-${disease.key}`} className="text-sm font-medium text-gray-700">{disease.label}</label>
                        </div>
                        {familyDiseases[disease.key as keyof typeof familyDiseases] && (
                            <input
                                type="text"
                                placeholder="가족 관계 (예: 어머니, 삼촌)"
                                value={familyDiseases[`${disease.key}Relation` as keyof typeof familyDiseases] || ''}
                                onChange={(e) => onNestedChange('familyHistory', `${disease.key}Relation`, e.target.value)}
                                className="ml-4 p-1 border border-gray-300 rounded-md text-sm w-48 text-gray-900"
                            />
                        )}
                    </div>
                ))}
                {/* 기타 질병 (otherDiseases) 필드는 요청에 따라 제거됨 */}
            </div>
        </div>
    );
};


const Page5HereditaryDiseaseHistory = ({ data, onNestedChange }: SurveyPageProps) => {
    const hereditaryDiseases = data.hereditaryDiseases || {};

    const handleHereditaryDiseaseChange = (disease: string, checked: boolean) => {
        onNestedChange('hereditaryDiseases', disease, checked);
        if (!checked) {
            onNestedChange('hereditaryDiseases', `${disease}Details`, undefined);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">5. 유전 질환 병력</h2>
            <p className="text-sm text-gray-600 mb-4">아래 유전 질환에 해당하거나 가족력이 있다면 체크하고 상세 내용을 입력하세요.</p>
            <div className="space-y-3">
                {[
                    { key: 'cysticFibrosis', label: '낭포성 섬유증 (Cystic Fibrosis)' },
                    { key: 'sickleCellAnemia', label: '겸상 적혈구 빈혈증 (Sickle Cell Anemia)' },
                    { key: 'taySachsDisease', label: '테이-삭스병 (Tay-Sachs Disease)' },
                    // 추가 유전 질환은 스크린샷 기반으로 추가 가능
                ].map((disease) => (
                    <div key={disease.key} className="flex items-center justify-between py-1 border-b border-gray-100">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`hered-${disease.key}`}
                                checked={hereditaryDiseases[disease.key as keyof typeof hereditaryDiseases] || false}
                                onChange={(e) => handleHereditaryDiseaseChange(disease.key, e.target.checked)}
                                className="mr-2 accent-blue-600"
                            />
                            <label htmlFor={`hered-${disease.key}`} className="text-sm font-medium text-gray-700">{disease.label}</label>
                        </div>
                        {hereditaryDiseases[disease.key as keyof typeof hereditaryDiseases] && (
                            <input
                                type="text"
                                placeholder="상세 내용 (예: 진단 연령, 가족 관계)"
                                value={hereditaryDiseases[`${disease.key}Details` as keyof typeof hereditaryDiseases] || ''}
                                onChange={(e) => onNestedChange('hereditaryDiseases', `${disease.key}Details`, e.target.value)}
                                className="ml-4 p-1 border border-gray-300 rounded-md text-sm w-64 text-gray-900"
                            />
                        )}
                    </div>
                ))}
                <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">기타 유전 질환 (상세 내용)</label>
                    <textarea
                        value={hereditaryDiseases.otherHereditaryDiseases || ''}
                        onChange={(e) => onNestedChange('hereditaryDiseases', 'otherHereditaryDiseases', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

const Page6TreatmentsMedication = ({ data, onChange }: SurveyPageProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">6. 치료 및 약물</h2>
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 복용 중인 약물</label>
            <textarea
                value={data.currentMedications || ''}
                onChange={(e) => onChange('currentMedications', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            ></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">과거 치료 이력</label>
            <textarea
                value={data.pastTreatments || ''}
                onChange={(e) => onChange('pastTreatments', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            ></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">약물 알레르기</label>
            <textarea
                value={data.allergiesToMedication || ''}
                onChange={(e) => onChange('allergiesToMedication', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            ></textarea>
        </div>
    </div>
  </div>
);

const Page7ConsentForm = ({ data, onChange }: SurveyPageProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">7. 동의서</h2>
    <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
            본 설문조사에 참여함으로써, 저는 프리딕티브 AI가 제공하는 유전자 기반 건강 관리 서비스를 이용하는 데 동의합니다.
            제공된 정보는 유전자 분석 및 개인 맞춤형 건강 관리 계획 수립에 활용될 수 있음을 이해합니다.
            개인 정보 보호 및 데이터 활용에 대한 자세한 내용은 개인 정보 처리 방침을 확인했습니다.
        </p>
        <div className="flex items-center">
            <input
                type="checkbox"
                id="consentToGeneticCounseling"
                checked={data.consentToGeneticCounseling || false}
                onChange={(e) => onChange('consentToGeneticCounseling', e.target.checked)}
                className="mr-2 accent-blue-600"
            />
            <label htmlFor="consentToGeneticCounseling" className="text-sm font-medium text-gray-700">유전자 상담 동의</label>
        </div>
        <div className="flex items-center">
            <input
                type="checkbox"
                id="consentToDataUse"
                checked={data.consentToDataUse || false}
                onChange={(e) => onChange('consentToDataUse', e.target.checked)}
                className="mr-2 accent-blue-600"
            />
            <label htmlFor="consentToDataUse" className="text-sm font-medium text-gray-700">데이터 활용 동의</label>
        </div>
        <p className="text-red-500 text-xs mt-4">
            **주의:** 이 동의서는 서비스 이용을 위한 기본 동의이며, 실제 법적 효력을 가지는 동의서는 별도로 제공될 수 있습니다.
        </p>
    </div>
  </div>
);