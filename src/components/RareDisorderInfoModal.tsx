// components/RareDisorderInfoModal.tsx
'use client';

import { useState } from 'react';

interface RareDisorderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RareDisorderInfoModal({ isOpen, onClose }: RareDisorderInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">희귀 유전 질환 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-light">
            &times;
          </button>
        </div>

        <section className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            희귀 유전 질환은 한 개 또는 여러 유전자 이상으로 인해 유전되는 유전 질환입니다.
            이러한 질환은 일반적으로 전체 인구의 적은 비율, 즉 200,000명 중 1명 미만에게 영향을 미치기 때문에 희귀하다고 간주됩니다.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">보인자 스크리닝 (CARRIER SCREENING)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            이 섹션의 일부 유전 질환은 열성 질환과 관련이 있으며, 개인이 질병에 영향을 받으려면 유전된 유전자의 두 복사본에 변이가 필요합니다.
            개인이 한 유전자에만 질환 유전자를 가지고 있는 경우 '보인자'라고 합니다.
            보인자는 종종 질환 유전자를 가지고 있다는 사실을 인지하지 못하며 일반적으로 증상이 없거나 경미한 증상만 나타납니다.
          </p>
          <div className="space-y-4 mt-6">
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">ACTIONABLE</strong>
              <p className="text-gray-700 text-sm">
                ACMG(미국 의학 유전학 및 유전체학회)에 따르면, '액션 가능한 질병'은 유전 검사 결과에 기반하여
                의학적 개입, 치료 또는 예방 조치가 가능한 유전 질환입니다.
                이들은 유전자-질병 연관성이 매우 강한 질환이며, 병원성 또는 병원성 가능성 변이가 식별될 경우
                심각한, 의학적으로 조치 가능한 상태를 유발할 가능성이 높은 ACMG가 식별한 73개 유전자를 포함합니다.
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">SIGNIFICANT</strong>
              <p className="text-gray-700 text-sm">
                ClinGen 및 MedSeq가 큐레이션한 강력한 유전자-질병 연관성 변이로, 병원성 또는 병원성 가능성이 높으며,
                전문가 패널의 검토 또는 기준을 거쳤고, ClinVar에 충돌이 없으며 Varsome에서 3개 별 평가를 받았습니다.
              </p>
            </div>
             <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">NOTABLE</strong>
              <p className="text-gray-700 text-sm">
                ClinGen 및 MedSeq가 큐레이션한 강력한 유전자-질병 연관성 변이로, 병원성 또는 병원성 가능성이 높으며,
                전문가 패널의 검토 또는 기준을 거쳤고, ClinVar에 충돌이 없으며 Varsome에서 3개 별 평가를 받았습니다.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}