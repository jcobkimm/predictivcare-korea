// src/app/about/page.tsx
'use client';

//import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">프리딕티브 AI</h1>
      <p className="text-xl text-gray-600 text-center mb-10">당신의 건강한 삶을 위한 디지털 동반자</p>
      
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">우리의 비전</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          프리딕티브 AI는 유전체(Genome)와 생활 습관(Nurture)의 데이터를 통합하여, 모든 사람이 더욱 행복하고 건강한 삶을 오랫동안 누릴 수 있도록 돕습니다.
        </p>
        <p className="text-gray-700 leading-relaxed">
          우리의 목표는 혁신적인 헬스케어 솔루션을 누구나 쉽게 접근하고, 합리적인 비용으로 이용하며, 명확하게 이해할 수 있도록 하는 것입니다.
        </p>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">핵심 가치: 사전 예방적 건강 관리</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          프리딕티브 AI는 질병 발생 후 치료하는 방식에서 벗어나, 데이터 기반의 건강 예측을 통해 질병을 예방하고 조기에 관리하는 사전 예방적 헬스케어를 지향합니다.
          이는 질병의 중증화를 막고 개인과 국가의 의료 부담을 줄이는 데 기여합니다.
        </p>
        <p className="text-gray-700 leading-relaxed">
          우리는 개인 맞춤형 유전 건강 상태 및 생활 습관 정보를 제공하는 DNA 기반 휴먼 디지털 트윈 플랫폼을 통해, 당신의 건강을 미리 지키는 데 집중합니다.
        </p>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">기술과 혁신</h2>
        <p className="text-gray-700 leading-relaxed">
          최첨단 유전체 분석 기술과 인공지능(AI), 머신러닝을 결합하여 정밀하고 개인화된 건강 관리 솔루션을 개발합니다.
          이 기술은 &apos;5P Medicine&apos;(개인화, 예측, 예방, 참여, 정밀) 철학을 바탕으로, 의사와 환자 모두에게 최적의 건강 관리 경험을 제공합니다.
        </p>
      </section>
      
      <section className="text-center text-gray-600 mt-8">
        <p>더 자세한 정보는 <a href="https://aipredictive.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">공식 웹사이트</a>를 방문해주세요.</p>
        <p>문의: <a href="mailto:aipredictive@aipredictive.com" className="text-blue-600 hover:underline">aipredictive@aipredictive.com</a></p>
      </section>
    </div>
  );
}