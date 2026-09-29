import { currentStageIndex, weightedProgress } from "../domain/progress";
import type { Project } from "../domain/types";
import { pad2 } from "./format";

export function ProjectHeader({ project }: { project: Project }) {
  const current = currentStageIndex(project);
  const currentLabel =
    current >= project.stages.length ? "배포 완료" : `${pad2(current + 1)} ${project.stages[current].name}`;
  const { spec } = project;

  return (
    <header className="ticket">
      <div>
        {project.isExample && <span className="example">예시 프로젝트</span>}
        <h1>
          {project.grade} {project.subject} · {project.type} 교과서
        </h1>
        <div className="sub">
          {project.curriculum} · 기획부터 학교 배포까지 {project.stages.length}단계 공정
        </div>
      </div>
      <svg className="reg" viewBox="0 0 44 44" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="22" cy="22" r="11" />
        <circle cx="22" cy="22" r="5" />
        <path d="M22 2v40M2 22h40" />
      </svg>
      <dl className="specs">
        <Spec label="판형" value={spec.trimSize} mono />
        <Spec label="쪽수" value={`${spec.pages}쪽`} mono />
        <Spec label="인쇄" value={spec.colors} />
        <Spec label="제본" value={spec.binding} />
        <Spec label="현재 단계" value={currentLabel} />
        <Spec label="전체 진척" value={`${Math.round(weightedProgress(project) * 100)}% (일정 가중)`} mono />
      </dl>
    </header>
  );
}

function Spec({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className={mono ? "mono" : undefined}>{value}</dd>
    </div>
  );
}
