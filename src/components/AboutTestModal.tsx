// components/AboutTestModal.tsx
'use client';

//import { useState } from 'react';

interface AboutTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutTestModal({ isOpen, onClose }: AboutTestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">검사 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-light">
            &times;
          </button>
        </div>

        <section className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">검사 개요 (ABOUT THIS TEST)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            전장 엑솜 시퀀싱(WES)은 Illumina의 NovaSeq-6000 플랫폼에서 차세대 시퀀싱(NGS) 기술을 사용하여 수행됩니다.
            엑솜은 엑솜 영역에서 최소 50배의 평균 커버리지로 시퀀싱됩니다.
            150bp 페어드-엔드 리드는 Burrows-Wheeler Aligner(BWA)를 사용하여 NCBI 참조 시퀀스(GRCh38)에 정렬되며,
            변이 호출은 생식계 단일 염기 다형성(SNP) 및 인델(Indels) 발견을 위한 Genomic Analysis Tool Kit(GATK) 모범 사례 워크플로우에 따라 수행됩니다.
            모든 비동의성 SNP가 보고됩니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            유전자 변이는 ClinVar(NIH/NCBI) 및 기타 공개 데이터베이스의 최신 정보와
            American College of Medical Genetics and Genomics(ACMG), Clinical Genome Resource(ClinGen),
            MedSeq Project, Genomics England PanelApp과 같은 전문가 큐레이션 목록을 활용하여 라벨링됩니다.
            Predictiv는 또한 보인자 빈도가 200명 중 1명 이상인 질환에 대해 ACMG 권장 Tier-3 보인자 스크리닝(Tier-1 및 Tier-2 포함)을 제공합니다.
            ACMG Tier-3 스크리닝 패널은 97개의 상염색체 열성 유전자와 16개의 X-연관 유전자를 포함합니다.
            이 113개 유전자에서 병원성 또는 병원성 가능성 변이가 발견되면 &apos;보인자 상태&apos;로 플래그가 지정됩니다.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">제한 사항 (LIMITATIONS)</h3>
          <p className="text-gray-700 leading-relaxed mb-2">
            모든 변이가 식별되지는 않았습니다. 본 검사는 반복 확장, 긴 단일 뉴클레오타이드 반복, 전위, 대규모 복사수 변이, 단일 엑손 결실/중복, 미토콘드리아 변이 및 비코딩 변이를 감지하지 못합니다.
            ClinVar 데이터베이스는 모든 임상적으로 관련된 변이에 대해 포괄적이지 않으며, 모든 질병 관련 변이가 식별되거나 분류된 것은 아닙니다.
            또한, 많은 유전자에서 변이의 임상적 유의성 및 임상적 해석/분류에서 변이의 변화가 제대로 이해되지 않고 시간이 지남에 따라 변경될 수 있음을 유의하십시오.
            본 검사는 U.S. Food and Drug Administration(FDA)에 의해 승인되거나 허가되지 않았습니다.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">변이 분류 정의</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <strong className="text-gray-800 mr-2">P: 병원성 (Pathogenic)</strong>
              <span className="text-gray-600">질병을 유발하는 것으로 알려진 변이입니다.</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <strong className="text-gray-800 mr-2">LP: 병원성 가능성 (Likely Pathogenic)</strong>
              <span className="text-gray-600">질병을 유발할 가능성이 매우 높은 변이입니다.</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <strong className="text-gray-800 mr-2">VUS: 불확실한 유의성 변이 (Variants of Unknown Significance)</strong>
              <span className="text-gray-600">임상적 의미가 아직 불확실한 변이입니다.</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <strong className="text-gray-800 mr-2">LB: 양성 가능성 (Likely Benign)</strong>
              <span className="text-gray-600">질병을 유발하지 않을 가능성이 높은 변이입니다.</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <strong className="block text-gray-800 mr-2">B: 양성 (Benign)</strong>
              <span className="text-gray-600">질병을 유발하지 않는 것으로 알려진 변이입니다.</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">ACTIONABLE</strong>
              <p className="text-gray-700 text-sm">
                ACMG가 큐레이션한 매우 강력한 유전자-질병 연관성 변이로, 의학적 개입, 치료 또는 예방 조치가 가능합니다.
                (ACMG가 식별한 73개 유전자 포함)
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">SIGNIFICANT</strong>
              <p className="text-gray-700 text-sm">
                ClinGen 및 MedSeq가 큐레이션한 강력한 유전자-질병 연관성 변이로, 병원성 또는 병원성 가능성이 높으며,
                ClinVar에서 3개 이상의 별 평가를 받고 전문가 패널의 검토 또는 기준을 통과했습니다.
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">NOTABLE</strong>
              <p className="text-gray-700 text-sm">
                의료 또는 가족력과 관련된 변이로, 병원성/병원성 가능성 또는 VUS, LB, B로 분류됩니다.
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">EXPERT CURATED</strong>
              <p className="text-gray-700 text-sm">
                병원성/병원성 가능성 변이 + ClinVar에서 3/4개 별 평가를 받고 전문가 패널의 검토 또는 기준을 통과했습니다.
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">MEDICAL HISTORY</strong>
              <p className="text-gray-700 text-sm">
                ClinVar의 임상적 유의성 순서로 남아있는 모든 가족력 또는 의료 기록 관련 변이입니다.
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">FAMILY HISTORY</strong>
              <p className="text-gray-700 text-sm">
                ClinVar의 임상적 유의성 순서로 남아있는 모든 가족력 또는 의료 기록 관련 변이입니다. (제한된 큐레이션) VUS, B/LB, 위험 요인 등 최저 임상 유의성 기준에 따름.
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <strong className="block text-gray-800 mb-1">EXPLORATORY</strong>
              <p className="text-gray-700 text-sm">
                모든 나머지 변이 - P, P/LP, LP (제한된 큐레이션) VUS, B/LB. ClinVar에서 0/1개 별 평가를 받은 변이. 위험 요소 등 최저 임상 유의성 기준에 따름.
              </p>
            </div>
          </div>
        </section>

        <p className="text-sm text-gray-600 mt-6 text-center">
          본 정보는 보충 건강 정보로 제공됩니다. 결과는 직접적인 진단 목적으로 사용되지 않습니다.
          개인은 본 웹사이트의 정보만을 근거로 건강 행동을 변경해서는 안 됩니다.
          결과에 대해 우려사항이 있거나 이 상태가 가족력이 있다면 의료 전문가와 상담해 주십시오.
        </p>

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