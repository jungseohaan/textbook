import { stageProgress, stageStatus } from "../domain/progress";
import type { Project } from "../domain/types";
import { pad2 } from "./format";

interface Props {
  project: Project;
  selected: number;
  onSelect: (index: number) => void;
}

export function StageRail({ project, selected, onSelect }: Props) {
  return (
    <div className="rail-box">
      <div className="rail-scroll">
        <ol className="rail" style={{ gridTemplateColumns: `repeat(${project.stages.length}, minmax(112px, 1fr))` }}>
          {project.stages.map((stage, i) => {
            const status = stageStatus(project, i);
            return (
              <li key={stage.order} className={`node ${status}${i === selected ? " selected" : ""}`}>
                <button
                  className="dot"
                  onClick={() => onSelect(i)}
                  aria-label={`${stage.order}단계 ${stage.name}`}
                  aria-current={i === selected ? "step" : undefined}
                >
                  {status === "done" ? "✓" : pad2(stage.order)}
                </button>
                <span className="gate" title={stage.gate.name} />
                <button className="nm" onClick={() => onSelect(i)} tabIndex={-1}>
                  {stage.name}
                </button>
                <span className="bar">
                  <i style={{ width: `${Math.round(stageProgress(stage) * 100)}%` }} />
                </span>
                <span className="meta mono">{stage.plannedWeeks}주</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="legend">
        <span><i className="lg d" />완료</span>
        <span><i className="lg a" />진행 중</span>
        <span><i className="lg" />대기</span>
        <span><i className="lg g" />단계 사이 승인 게이트</span>
        <span>← → 키로 단계 이동</span>
      </div>
    </div>
  );
}
