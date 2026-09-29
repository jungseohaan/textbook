import { stageStatus, totalWeeks } from "../domain/progress";
import type { Project } from "../domain/types";

interface Props {
  project: Project;
  selected: number;
  onSelect: (index: number) => void;
}

const WEEKS_PER_MONTH = 4.345;

export function ScheduleBar({ project, selected, onSelect }: Props) {
  const total = totalWeeks(project);
  return (
    <section className="gantt" aria-label="표준 일정">
      <div className="gantt-head">
        <span className="label">표준 일정</span>
        <span className="mono muted-sm">
          총 {total}주 · 약 {Math.round(total / WEEKS_PER_MONTH)}개월
        </span>
      </div>
      <div className="segs">
        {project.stages.map((stage, i) => (
          <button
            key={stage.order}
            className={`seg ${stageStatus(project, i)}${i === selected ? " selected" : ""}`}
            style={{ flex: stage.plannedWeeks }}
            title={`${stage.name} ${stage.plannedWeeks}주`}
            onClick={() => onSelect(i)}
          >
            {stage.name}
          </button>
        ))}
      </div>
      <div className="ticks mono">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <span key={f}>{Math.round(total * f)}주</span>
        ))}
      </div>
    </section>
  );
}
