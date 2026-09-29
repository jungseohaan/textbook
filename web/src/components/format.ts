import type { StageStatus } from "../domain/types";

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const STATUS_LABEL: Record<StageStatus, string> = {
  done: "완료",
  active: "진행 중",
  waiting: "대기",
};
