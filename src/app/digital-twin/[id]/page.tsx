export default function DigitalTwinDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <h1 className="text-3xl text-gray-700 font-bold mb-4">디지털 트윈 상세</h1>
      <p className="text-lg text-gray-700 mb-6">환자 ID: {id}</p>

      <div className="grid gap-4">
        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-xl text-gray-700 font-semibold mb-2">희귀 유전 질환</h2>
          <p className ="text-sm text-gray-700">변이 수: 1666</p>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            <li>✔️ ACTIONABLE: 0</li>
            <li>✔️ SIGNIFICANT: 0</li>
            <li>✔️ EXPLORATORY: 1666</li>
          </ul>
        </section>

        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-xl text-gray-700 font-semibold mb-2">약물 반응</h2>
          <p className ="text-sm text-gray-700">총 45개 약물 분석됨</p>
          <p className ="text-sm text-gray-700">🔴 민감 반응: 14 / 🟡 참고 정보: 31</p>
        </section>

        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-xl text-gray-700 font-semibold mb-2">웰니스</h2>
          <p className ="text-sm text-gray-700">총 54개 유전자 테스트됨</p>
          <p className ="text-sm text-gray-700">영양: 8 / 피트니스: 9 / 장수: 7</p>
        </section>

        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-xl text-gray-700 font-semibold mb-2">유전자 상담</h2>
          <p className="text-sm mb-2 text-gray-700">Zoom 미팅이 자동 생성되었습니다.</p>
          <div className="space-x-2">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded">Start meeting</button>
            <button className="bg-gray-300 px-4 py-2 rounded">Join meeting</button>
            <button className="bg-teal-600 text-white px-4 py-2 rounded">Restart meeting</button>
          </div>
        </section>
      </div>
    </div>
  );
}
