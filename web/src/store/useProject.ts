import { useCallback, useEffect, useState } from "react";
import { toggleTask } from "../domain/progress";
import type { Project } from "../domain/types";
import type { ProjectRepository } from "./repository";

export function useProject(repo: ProjectRepository, id: string) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    let alive = true;
    repo.load(id).then((p) => alive && setProject(p));
    return () => {
      alive = false;
    };
  }, [repo, id]);

  const setTaskDone = useCallback(
    (taskId: string, done: boolean) => {
      if (!project) return;
      const next = toggleTask(project, taskId, done);
      setProject(next);
      void repo.save(next);
    },
    [repo, project],
  );

  const reset = useCallback(async () => {
    setProject(await repo.reset(id));
  }, [repo, id]);

  return { project, setTaskDone, reset };
}
