// src/app/digital-twin/[id]/page.tsx

import ClientPage from './client-page'; // 2단계에서 만들 클라이언트 페이지

// 서버 컴포넌트의 props 타입
interface PageProps {
  params: { id: string };
}

// 환자 데이터 타입 (클라이언트와 공유)
// 실제 프로젝트에서는 이 타입을 별도의 types/index.ts 파일로 빼는 것이 좋습니다.
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

export interface Patient {
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

// 서버에서 데이터를 가져오는 함수
async function getPatient(id: string): Promise<Patient | null> {
  try {
    const response = await fetch(`http://localhost:3001/patients/${id}`, {
      cache: 'no-store', // 항상 최신 데이터를 가져옵니다.
    });

    if (!response.ok) {
      console.error(`Error fetching patient ${id}: ${response.status}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch patient detail:", error);
    return null;
  }
}

// 이 페이지는 이제 비동기 서버 컴포넌트입니다.
export default async function DigitalTwinDetailPage({ params }: PageProps) {
  const patient = await getPatient(params.id);

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg font-semibold">
        환자 데이터를 찾을 수 없습니다.
      </div>
    );
  }

  // 데이터를 ClientPage 컴포넌트에 prop으로 전달합니다.
  return <ClientPage patient={patient} />;
}