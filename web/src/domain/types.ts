// README의 데이터 모델을 따른다. 1차에서는 Gate 승인·Member 배정을 쓰지 않고 역할 이름만 둔다.

export type ProjectType = "검정" | "인정" | "디지털";

export interface ProjectSpec {
  trimSize: string; // 판형, 예: 188×257mm
  pages: number;
  colors: string; // 인쇄 도수
  binding: string;
}

export interface Task {
  id: string;
  title: string;
  note: string;
  assigneeRole: string;
  done: boolean;
}

export interface Gate {
  name: string;
  criteria: string;
  /** 반려 시 되돌아갈 단계의 order. 없으면 반려 경로 없음 */
  rejectTo: number | null;
}

export interface Deliverable {
  name: string;
  format: string;
}

export interface Stage {
  order: number; // 1부터
  name: string;
  nameEn: string;
  description: string;
  plannedWeeks: number;
  roles: string[];
  tasks: Task[];
  deliverables: Deliverable[];
  gate: Gate;
}

export interface Project {
  id: string;
  subject: string;
  grade: string;
  curriculum: string;
  type: ProjectType;
  spec: ProjectSpec;
  isExample: boolean;
  stages: Stage[];
}

/** 1차에서 단계 상태는 체크리스트에서 계산한다. 2차에서 게이트 검토·반려가 추가된다. */
export type StageStatus = "done" | "active" | "waiting";
