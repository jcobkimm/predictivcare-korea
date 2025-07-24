import ClientPage from "./client-page";
import type { Patient } from "@/types";

interface PageProps {
  params: { id: string };
}

async function getPatient(id: string): Promise<Patient | null> {
  try {
    //const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${id}`, {
    const response = await fetch(
      `https://intern.api.aipredictive.com/patients/${id}`,
      {
        cache: "no-store",
      }
    );
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

  return <ClientPage patient={patient} />;
}
