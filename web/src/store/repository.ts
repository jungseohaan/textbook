import { createExampleProject } from "../domain/template";
import type { Project } from "../domain/types";

/** 저장소 경계. 2차에서 REST API 구현으로 교체한다. */
export interface ProjectRepository {
  load(id: string): Promise<Project>;
  save(project: Project): Promise<void>;
  reset(id: string): Promise<Project>;
}

const KEY_PREFIX = "tb-flow/project/";

function isProject(value: unknown): value is Project {
  const p = value as Project;
  return !!p && typeof p.id === "string" && Array.isArray(p.stages);
}

/** 1차: 브라우저 localStorage. 저장이 막힌 환경에서는 예시 데이터로 동작한다. */
export class LocalStorageRepository implements ProjectRepository {
  async load(id: string): Promise<Project> {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + id);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isProject(parsed)) return parsed;
      }
    } catch {
      // 손상된 값이나 접근 불가는 예시 데이터로 대체
    }
    return createExampleProject();
  }

  async save(project: Project): Promise<void> {
    try {
      localStorage.setItem(KEY_PREFIX + project.id, JSON.stringify(project));
    } catch {
      // 저장 불가 환경: 화면 상태만 유지
    }
  }

  async reset(id: string): Promise<Project> {
    try {
      localStorage.removeItem(KEY_PREFIX + id);
    } catch {
      // 무시
    }
    return createExampleProject();
  }
}
