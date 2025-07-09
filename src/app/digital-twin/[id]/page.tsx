// src/app/digital-twin/[id]/page.tsx

import ClientPage from './client-page';
// ✅ 올바른 경로 별칭으로 수정합니다.
import type { Patient } from '@/types'; 

interface PageProps {
  params: { id: string };
}

async function getPatient(id: string): Promise<Patient | null> {
  try {
    // Vercel 배포 환경에서는 localhost 대신 실제 API 주소를 사용해야 합니다.
    // 우선은 로컬 테스트를 위해 그대로 둡니다.
    //const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${id}`, {
    const response = await fetch(`http://[::1]:8080/patients/${id}`, {
      cache: 'no-store', 
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

export default async function DigitalTwinDetailPage({ params }: PageProps) {
  const patient = await getPatient(params.id);

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg font-semibold">
        환자 데이터를 찾을 수 없습니다. ID: {params.id}
      </div>
    );
  }
  
  // ✅ prop 이름을 initialPatient에서 patient로 변경하여 명확하게 합니다.
  return <ClientPage patient={patient} />;
}