import type { Deliverable, Gate, Project, Stage } from "./types";

type TaskDef = [title: string, note: string, assigneeRole: string];

interface StageDef {
  name: string;
  nameEn: string;
  description: string;
  plannedWeeks: number;
  roles: string[];
  tasks: TaskDef[];
  deliverables: Deliverable[];
  gate: Gate;
}

/** 검정 교과서 표준 공정. 기간과 역할은 일반적인 값이며 사내 기준에 맞게 조정한다. */
export const AUTHORIZED_TEMPLATE: StageDef[] = [
  {
    name: "기획", nameEn: "Planning", plannedWeeks: 4,
    description: "교육과정 성취기준을 분석해 교과서의 방향과 단원 구성을 정하고, 집필진과 일정을 꾸립니다.",
    roles: ["편집장", "기획 편집자", "대표 저자", "제작 관리자"],
    tasks: [
      ["교육과정 성취기준 분석", "단원별 성취기준 매핑표 작성", "기획 편집자"],
      ["기존 교과서·경쟁본 분석", "차별화 포인트 도출", "기획 편집자"],
      ["편찬 계획서 작성", "집필 방향, 단원 구성안(목차), 분량 배분", "편집장"],
      ["집필진·검토진 구성", "대표 저자와 교사 집필진 계약", "편집장"],
      ["일정·예산 수립", "단계별 마감일과 제작비 산정", "제작 관리자"],
    ],
    deliverables: [
      { name: "편찬 계획서", format: "DOCX" },
      { name: "단원 구성안(목차)", format: "XLSX" },
      { name: "집필 세칙", format: "PDF" },
    ],
    gate: { name: "기획 승인", criteria: "성취기준이 빠짐없이 단원에 배정되고 편찬 계획서가 확정됨", rejectTo: null },
  },
  {
    name: "집필", nameEn: "Writing", plannedWeeks: 16,
    description: "집필진이 단원별 원고와 활동·평가 문항을 쓰고, 필요한 삽화와 사진을 요청합니다.",
    roles: ["집필진", "대표 저자", "기획 편집자"],
    tasks: [
      ["단원별 원고 집필", "집필 세칙에 따른 본문 작성", "집필진"],
      ["탐구 활동·평가 문항 개발", "단원 마무리 문항 포함", "집필진"],
      ["삽화·사진 요청서 작성", "위치, 내용, 참고 자료 첨부", "집필진"],
      ["인용 자료 출처 목록화", "저작권 확인 대상 표시", "기획 편집자"],
      ["집필 협의회 운영", "격주 진도 점검과 용어 통일", "대표 저자"],
    ],
    deliverables: [
      { name: "초고 원고", format: "HWP" },
      { name: "삽화·사진 요청서", format: "XLSX" },
      { name: "출처 목록", format: "XLSX" },
    ],
    gate: { name: "원고 마감", criteria: "전 단원 초고가 입고되고 분량이 계획 대비 ±10% 이내", rejectTo: null },
  },
  {
    name: "편집·검토", nameEn: "Editorial review", plannedWeeks: 8,
    description: "원고의 내용 오류와 표기를 바로잡고, 외부 검토와 저작권 이용 허락을 마칩니다.",
    roles: ["교과 편집자", "외부 검토위원", "교정자"],
    tasks: [
      ["내용 감수", "사실 오류, 개념 설명의 정확성", "외부 검토위원"],
      ["교정·교열", "맞춤법, 외래어 표기, 과학 용어 통일", "교정자"],
      ["성취기준 대조", "누락·중복 성취기준 확인", "교과 편집자"],
      ["인권·성평등·편향 검토", "삽화 인물 구성과 표현 점검", "외부 검토위원"],
      ["저작권 이용 허락 확보", "사진·인용문 허락서 수령", "기획 편집자"],
    ],
    deliverables: [
      { name: "검토 의견서", format: "PDF" },
      { name: "수정 원고", format: "HWP" },
      { name: "저작권 허락서", format: "PDF" },
    ],
    gate: { name: "원고 확정", criteria: "검토 의견이 모두 반영되고 저작권 허락서가 100% 확보됨", rejectTo: 2 },
  },
  {
    name: "디자인·조판", nameEn: "Design & layout", plannedWeeks: 10,
    description: "판형과 그리드를 정하고, 삽화·도표를 만들어 본문을 조판한 뒤 여러 차례 교정합니다.",
    roles: ["아트디렉터", "편집 디자이너", "일러스트레이터", "조판자", "교과 편집자"],
    tasks: [
      ["판형·그리드·서체 결정", "188×257mm, 본문 11pt 기준", "아트디렉터"],
      ["표지·본문 디자인 시안", "시안 2종 중 선택", "편집 디자이너"],
      ["삽화·사진·도표 제작", "요청서 기준 제작, 과학 도해 감수", "일러스트레이터"],
      ["본문 조판", "InDesign, 단원별 파일 분리", "조판자"],
      ["1·2·3교 교정", "교정지 PDF에 주석으로 수정 지시", "교과 편집자"],
      ["색교정", "CMYK 프루프로 사진·도표 색 확인", "아트디렉터"],
    ],
    deliverables: [
      { name: "디자인 가이드", format: "PDF" },
      { name: "조판 파일", format: "INDD" },
      { name: "교정지", format: "PDF" },
    ],
    gate: { name: "오케이 교", criteria: "3교 수정 사항이 모두 반영되고 편집장이 최종 교정지에 서명", rejectTo: 3 },
  },
  {
    name: "검정 심사", nameEn: "Authorization", plannedWeeks: 20,
    description: "심사본을 제출해 기초 조사와 본심사를 받고, 수정·보완 지시를 반영해 합격을 확정합니다.",
    roles: ["편집장", "교과 편집자", "심사 기관", "교육부"],
    tasks: [
      ["심사본 제출", "저자·발행사 정보 익명 처리", "편집장"],
      ["기초 조사 대응", "표기·표현 오류 지적 사항 확인", "교과 편집자"],
      ["본심사 대응", "내용 적합성 심사 결과 확인", "편집장"],
      ["수정·보완 지시 이행", "수정 대조표 작성 후 재제출", "교과 편집자"],
      ["최종 합격 확인", "합격 공고와 합격본 확정", "편집장"],
    ],
    deliverables: [
      { name: "심사본", format: "PDF" },
      { name: "수정·보완 대조표", format: "HWP" },
      { name: "합격 통지서", format: "PDF" },
    ],
    gate: { name: "검정 합격", criteria: "수정·보완 이행이 확인되고 최종 합격 공고가 나옴", rejectTo: 3 },
  },
  {
    name: "전시·선정", nameEn: "Adoption", plannedWeeks: 6,
    description: "합격본으로 전시본을 만들어 학교에 소개하고, 학교별 선정 결과에 따라 주문 수량을 모읍니다.",
    roles: ["영업·마케팅", "제작 관리자", "학교", "교육청"],
    tasks: [
      ["전시본 제작", "합격본 기준 소량 인쇄", "제작 관리자"],
      ["교과서 전시·설명회", "교육청 전시장과 온라인 전시", "영업·마케팅"],
      ["학교 선정 지원", "교과협의회용 비교 자료 제공", "영업·마케팅"],
      ["주문 수량 집계", "학교별 주문을 지역별로 합산", "영업·마케팅"],
    ],
    deliverables: [
      { name: "전시본", format: "인쇄본" },
      { name: "홍보 자료", format: "PDF" },
      { name: "주문 집계표", format: "XLSX" },
    ],
    gate: { name: "주문 확정", criteria: "주문 마감 후 인쇄 부수가 확정됨", rejectTo: null },
  },
  {
    name: "인쇄·제본", nameEn: "Printing", plannedWeeks: 6,
    description: "인쇄용 파일을 출력해 본문과 표지를 인쇄하고, 제본 후 품질을 검사합니다.",
    roles: ["제작 관리자", "인쇄소", "제본소"],
    tasks: [
      ["인쇄용 PDF 출력", "PDF/X-4, 재단 여유 3mm", "조판자"],
      ["CTP 출력·교정쇄 확인", "인쇄 전 최종 대지 확인", "제작 관리자"],
      ["본문·표지 인쇄", "본문 4도, 표지 4도 + 코팅", "인쇄소"],
      ["제본", "무선철, 책등 두께 확인", "제본소"],
      ["품질 검사", "샘플링으로 파본·색 편차 확인", "제작 관리자"],
    ],
    deliverables: [
      { name: "인쇄 사양서", format: "PDF" },
      { name: "교정쇄", format: "인쇄본" },
      { name: "완제품", format: "부수" },
    ],
    gate: { name: "품질 검사 합격", criteria: "파본율이 기준 이하이고 색 편차가 허용 범위 안", rejectTo: 7 },
  },
  {
    name: "공급·배포", nameEn: "Distribution", plannedWeeks: 4,
    description: "지역 총판을 거쳐 학교에 교과서를 보내고, 파본 교환과 정오표를 관리합니다.",
    roles: ["물류", "지역 총판", "학교", "교과 편집자"],
    tasks: [
      ["지역 총판 배송", "지역별 수량대로 출고", "물류"],
      ["학교 입고 확인", "개학 전 입고 완료 여부 점검", "물류"],
      ["파본·결손 교환", "학교 요청 접수 후 교체", "물류"],
      ["디지털 자료 탑재", "PDF·교사용 자료 업로드", "교과 편집자"],
      ["정오표 관리", "발견된 오류를 차기 쇄에 반영", "교과 편집자"],
    ],
    deliverables: [
      { name: "배송 확인서", format: "PDF" },
      { name: "정오표", format: "HWP" },
    ],
    gate: { name: "배포 완료", criteria: "모든 주문 학교에 개학 전 입고 완료", rejectTo: null },
  },
];

export function buildStages(template: StageDef[]): Stage[] {
  return template.map((def, i) => ({
    order: i + 1,
    name: def.name,
    nameEn: def.nameEn,
    description: def.description,
    plannedWeeks: def.plannedWeeks,
    roles: def.roles,
    deliverables: def.deliverables,
    gate: def.gate,
    tasks: def.tasks.map(([title, note, assigneeRole], j) => ({
      id: `s${i + 1}-t${j + 1}`,
      title,
      note,
      assigneeRole,
      done: false,
    })),
  }));
}

/** 예시 프로젝트: 1~3단계 완료, 4단계 작업 3개 완료 */
export function createExampleProject(): Project {
  const stages = buildStages(AUTHORIZED_TEMPLATE);
  stages.forEach((stage, i) =>
    stage.tasks.forEach((task, j) => {
      task.done = i < 3 || (i === 3 && j < 3);
    }),
  );
  return {
    id: "example-science-1",
    subject: "과학 1",
    grade: "중학교",
    curriculum: "2022 개정 교육과정",
    type: "검정",
    spec: { trimSize: "188×257mm", pages: 264, colors: "4도 · CMYK", binding: "무선철" },
    isExample: true,
    stages,
  };
}
