import { describe, expect, it } from "vitest";
import { createExampleProject } from "./template";
import {
  currentStageIndex,
  stageProgress,
  stageStatus,
  toggleTask,
  totalWeeks,
  weightedProgress,
} from "./progress";

describe("progress", () => {
  it("예시 프로젝트는 4단계(디자인·조판)가 진행 중이다", () => {
    const p = createExampleProject();
    expect(currentStageIndex(p)).toBe(3);
    expect(stageStatus(p, 2)).toBe("done");
    expect(stageStatus(p, 3)).toBe("active");
    expect(stageStatus(p, 4)).toBe("waiting");
    expect(stageProgress(p.stages[3])).toBeCloseTo(0.5);
  });

  it("표준 일정은 74주다", () => {
    expect(totalWeeks(createExampleProject())).toBe(74);
  });

  it("진척률은 단계 기간으로 가중한다", () => {
    // (4 + 16 + 8 + 10×0.5) / 74
    expect(weightedProgress(createExampleProject())).toBeCloseTo(33 / 74);
  });

  it("앞 단계 작업을 되돌리면 현재 단계도 되돌아간다", () => {
    const p = toggleTask(createExampleProject(), "s2-t1", false);
    expect(currentStageIndex(p)).toBe(1);
    expect(stageStatus(p, 3)).toBe("waiting");
  });

  it("모든 작업이 끝나면 현재 단계는 stages.length다", () => {
    let p = createExampleProject();
    for (const s of p.stages) for (const t of s.tasks) p = toggleTask(p, t.id, true);
    expect(currentStageIndex(p)).toBe(p.stages.length);
    expect(weightedProgress(p)).toBe(1);
  });

  it("toggleTask는 원본을 바꾸지 않는다", () => {
    const p = createExampleProject();
    toggleTask(p, "s5-t1", true);
    expect(p.stages[4].tasks[0].done).toBe(false);
  });
});
