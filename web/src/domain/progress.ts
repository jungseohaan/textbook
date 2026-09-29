import type { Project, Stage, StageStatus } from "./types";

export function stageProgress(stage: Stage): number {
  if (stage.tasks.length === 0) return 1;
  return stage.tasks.filter((t) => t.done).length / stage.tasks.length;
}

/** 작업이 남은 첫 단계의 index. 모두 끝났으면 stages.length */
export function currentStageIndex(project: Project): number {
  const i = project.stages.findIndex((s) => stageProgress(s) < 1);
  return i < 0 ? project.stages.length : i;
}

export function stageStatus(project: Project, index: number): StageStatus {
  const current = currentStageIndex(project);
  if (index < current) return "done";
  if (index === current) return "active";
  return "waiting";
}

export function totalWeeks(project: Project): number {
  return project.stages.reduce((sum, s) => sum + s.plannedWeeks, 0);
}

/** 단계 기간으로 가중한 전체 진척률 (0~1) */
export function weightedProgress(project: Project): number {
  const total = totalWeeks(project);
  if (total === 0) return 0;
  return project.stages.reduce((sum, s) => sum + s.plannedWeeks * stageProgress(s), 0) / total;
}

export function toggleTask(project: Project, taskId: string, done: boolean): Project {
  return {
    ...project,
    stages: project.stages.map((stage) =>
      stage.tasks.some((t) => t.id === taskId)
        ? { ...stage, tasks: stage.tasks.map((t) => (t.id === taskId ? { ...t, done } : t)) }
        : stage,
    ),
  };
}
