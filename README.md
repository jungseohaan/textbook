# 교과서 제작 공정판

교과서 한 권이 기획부터 학교 배포까지 거치는 8단계 공정을 단계별로 보여 주고 관리하는 앱.

- 프로토타입: [index.html](index.html) (공정 플로우 + 앱 설계 명세 탭)
- 앱: [web/](web/) (React + TypeScript + Vite)
- 확정일: 2026-09-29

## 공정 (검정 교과서 템플릿)

| # | 단계 | 표준 기간 | 게이트 | 반려 시 |
|---|------|-----------|--------|---------|
| 1 | 기획 | 4주 | 기획 승인 | – |
| 2 | 집필 | 16주 | 원고 마감 | – |
| 3 | 편집·검토 | 8주 | 원고 확정 | 집필 |
| 4 | 디자인·조판 | 10주 | 오케이 교 | 편집·검토 |
| 5 | 검정 심사 | 20주 | 검정 합격 | 편집·검토 |
| 6 | 전시·선정 | 6주 | 주문 확정 | – |
| 7 | 인쇄·제본 | 6주 | 품질 검사 합격 | 인쇄·제본 |
| 8 | 공급·배포 | 4주 | 배포 완료 | – |

합계 74주(약 17개월). 인정·디지털 교과서는 별도 템플릿으로 관리한다.

## 화면

| ID | 화면 | 내용 |
|----|------|------|
| S1 | 프로젝트 목록 | 과목·학년별 카드, 현재 단계와 지연 여부 |
| S2 | 공정 보드 | 8단계 레일, 표준 일정 막대, 단계 상세 |
| S3 | 단계 상세 | 작업 체크리스트, 담당, 산출물, 게이트 조건·반려 경로 |
| S4 | 산출물 보관함 | 원고, 교정지 PDF, 심사본, 저작권 허락서 버전 관리 |
| S5 | 게이트 승인 | 승인/반려, 반려 사유를 이전 단계로 전달 |
| S6 | 공정 템플릿 관리 | 검정·인정·디지털별 단계·작업 편집 |

## 데이터 모델

- **Project**: subject, grade, curriculum, type(검정/인정/디지털), spec(판형·쪽수·도수) — Stage 1:N
- **Stage**: order, name, plannedWeeks, startDate, status — Task 1:N, Gate 1:1
- **Task**: title, note, assigneeRole, dueDate, done — Member N:1
- **Gate**: criteria, approverRole, decision, rejectTo, comment
- **Deliverable**: name, format, version, fileUrl, uploadedBy — Stage N:1
- **Member**: name, role, org — Project N:M

## 단계 상태 전이

대기 → 진행 → 게이트 검토 → 승인
게이트 검토 → 반려 → `rejectTo` 단계 재진행 (그 뒤 단계는 대기로 초기화)

모든 작업이 끝나야 게이트 검토를 요청할 수 있다.

## 기술 구성

- 프론트엔드: React + TypeScript
- 백엔드: NestJS REST API, 게이트 승인 시 알림 이벤트
- 데이터: PostgreSQL, 공정 템플릿은 JSON 컬럼으로 버전 관리
- 파일: S3 호환 스토리지
- 권한: RBAC, 게이트 승인은 편집장·제작 관리자
- 알림: 마감 3일 전, 게이트 반려, 단계 전환

## 구현 순서

1. **1차** ✅: 공정 보드(S2·S3), 고정 템플릿 1종, 체크리스트 저장(브라우저 localStorage)
2. **2차**: 프로젝트 목록(S1), 담당자 배정, 게이트 승인·반려(S5)
3. **3차**: 산출물 보관함(S4), 알림, 템플릿 관리(S6)

## 실행

```sh
cd web
npm install
npm run dev     # 개발 서버
npm test        # 진척 계산 테스트
npm run build   # 배포용 빌드 → web/dist
```

## 코드 구조 (web/src)

- `domain/` 타입, 검정 템플릿, 진척 계산(순수 함수 + 테스트)
- `store/` 저장소 인터페이스 `ProjectRepository`와 localStorage 구현. 2차에서 API 구현으로 교체
- `components/` 헤더, 공정 레일, 일정 막대, 단계 상세
