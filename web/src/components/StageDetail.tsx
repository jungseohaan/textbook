import { stageProgress, stageStatus } from "../domain/progress";
import type { Project } from "../domain/types";
import { pad2, STATUS_LABEL } from "./format";

interface Props {
  project: Project;
  index: number;
  onSelect: (index: number) => void;
  onToggleTask: (taskId: string, done: boolean) => void;
}

export function StageDetail({ project, index, onSelect, onToggleTask }: Props) {
  const stage = project.stages[index];
  const status = stageStatus(project, index);
  const prev = project.stages[index - 1];
  const next = project.stages[index + 1];
  const doneCount = stage.tasks.filter((t) => t.done).length;
  const passed = stageProgress(stage) === 1;
  const rejectStage = stage.gate.rejectTo ? project.stages[stage.gate.rejectTo - 1] : null;

  return (
    <article className="detail">
      <div className="detail-main">
        <div className="d-head">
          <div className="row">
            <span className="d-num">
              {pad2(stage.order)} / {pad2(project.stages.length)}
            </span>
            <span className={`chip ${status}`}>{STATUS_LABEL[status]}</span>
            <span className="label">{stage.nameEn}</span>
          </div>
          <h2>{stage.name}</h2>
          <p className="d-desc">{stage.description}</p>
        </div>

        <div className="progress-line">
          <span className="label">작업 체크리스트</span>
          <span className="mono">
            {doneCount} / {stage.tasks.length} 완료
          </span>
        </div>
        <ul className="tasks">
          {stage.tasks.map((task) => (
            <li key={task.id}>
              <label htmlFor={task.id}>
                <input
                  type="checkbox"
                  id={task.id}
                  checked={task.done}
                  onChange={(e) => onToggleTask(task.id, e.target.checked)}
                />
                <span className="tx">
                  <span className="t">{task.title}</span>
                  <span className="n">{task.note}</span>
                </span>
                <span className="who">{task.assigneeRole}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="nav">
          <button className="btn" disabled={!prev} onClick={() => onSelect(index - 1)}>
            ← {prev ? prev.name : "이전"}
          </button>
          <button className="btn primary" disabled={!next} onClick={() => onSelect(index + 1)}>
            {next ? next.name : "마지막 단계"} →
          </button>
        </div>
      </div>

      <aside className="detail-side">
        <div className="side-block">
          <span className="label">참여자</span>
          <div className="people">
            {stage.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
        </div>
        <div className="side-block">
          <span className="label">산출물</span>
          <ul className="outs">
            {stage.deliverables.map((d) => (
              <li key={d.name}>
                <span>{d.name}</span>
                <span className="fmt">{d.format}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="side-block">
          <span className="label">{next ? "다음 단계로 넘어가는 조건" : "완료 조건"}</span>
          <div className={`gatebox${passed ? " pass" : ""}`}>
            <h3>
              {stage.gate.name} · {passed ? "통과" : "미통과"}
            </h3>
            <p>{stage.gate.criteria}</p>
            <p className="loop">
              {rejectStage ? `반려 시 → ${rejectStage.name} 단계로 돌아감` : "반려 경로 없음 (내부 확인으로 종료)"}
            </p>
          </div>
        </div>
      </aside>
    </article>
  );
}
