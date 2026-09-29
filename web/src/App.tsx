import { useCallback, useEffect, useState } from "react";
import { ProjectHeader } from "./components/ProjectHeader";
import { ScheduleBar } from "./components/ScheduleBar";
import { StageDetail } from "./components/StageDetail";
import { StageRail } from "./components/StageRail";
import { currentStageIndex } from "./domain/progress";
import { LocalStorageRepository } from "./store/repository";
import { useProject } from "./store/useProject";

const repo = new LocalStorageRepository();
const PROJECT_ID = "example-science-1";

/** #s1 ~ #sN 으로 단계를 직접 연다 */
function stageFromHash(count: number): number | null {
  const m = /^#s(\d+)$/.exec(location.hash);
  if (!m) return null;
  const i = Number(m[1]) - 1;
  return i >= 0 && i < count ? i : null;
}

export default function App() {
  const { project, setTaskDone, reset } = useProject(repo, PROJECT_ID);
  const [selected, setSelected] = useState<number | null>(null);

  const count = project?.stages.length ?? 0;

  // 처음 불러오면 주소의 단계, 없으면 진행 중인 단계를 연다
  useEffect(() => {
    if (project && selected === null) {
      setSelected(stageFromHash(count) ?? Math.min(currentStageIndex(project), count - 1));
    }
  }, [project, selected, count]);

  const select = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(count - 1, i));
      setSelected(next);
      history.replaceState(null, "", `#s${next + 1}`);
    },
    [count],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null || (e.target as HTMLElement).matches("textarea, input:not([type=checkbox])")) return;
      if (e.key === "ArrowRight") select(selected + 1);
      if (e.key === "ArrowLeft") select(selected - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected, select]);

  const handleReset = async () => {
    await reset();
    setSelected(null);
  };

  if (!project || selected === null) return <div className="wrap loading">불러오는 중…</div>;

  return (
    <div className="wrap">
      <ProjectHeader project={project} />
      <StageRail project={project} selected={selected} onSelect={select} />
      <ScheduleBar project={project} selected={selected} onSelect={select} />
      <StageDetail project={project} index={selected} onSelect={select} onToggleTask={setTaskDone} />
      <div className="foot">
        <span>체크 상태는 이 브라우저에만 저장됩니다.</span>
        <button className="linkbtn" onClick={handleReset}>
          예시 상태로 되돌리기
        </button>
      </div>
    </div>
  );
}
