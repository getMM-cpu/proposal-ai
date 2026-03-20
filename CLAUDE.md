# ProposalAI — 프로젝트 컨텍스트

## 개요
URL을 입력하면 웹사이트를 크롤링·분석하여 비즈니스/프로젝트 제안서를 자동 생성하는 웹앱.
회원가입 없이 누구나 사용 가능하며 Vercel로 배포되어 있다.

## 배포 정보
- **Production URL**: https://test-phi-ten-75.vercel.app
- **GitHub**: https://github.com/getMM-cpu/proposal-ai
- **Vercel 프로젝트명**: test (happyrimrim-3669s-projects)
- **Supabase 프로젝트**: jkmpxobsgrddmcsqcjdy

## 기술 스택
- **Framework**: Next.js 16 (App Router, TypeScript)
- **스타일**: Tailwind CSS v4 (CSS 기반 설정, tailwind.config.ts 없음)
- **AI**: OpenRouter API — 모델 `anthropic/claude-opus-4-5`
- **URL 크롤링**: Jina AI Reader (`https://r.jina.ai/{url}`) — 별도 크롤러 불필요
- **DB**: Supabase (proposals, prompt_templates 테이블)
- **마크다운 렌더링**: react-markdown + remark-gfm
- **배포**: Vercel (CLI 배포, GitHub 자동배포 미연결)

## 디자인 컨셉
- **테마**: Glassmorphism + Monochrome 다크
- **배경**: `#0a0a0a` (거의 순수 검정)
- **글래스 패널**: `rgba(255,255,255,0.05)` + `backdrop-filter: blur(12px)`
- **강조색**: 흰색만 사용 (컬러 없음)
- **CSS 유틸리티**: `glass-card`, `glass-input`, `glass-btn-primary`, `glass-btn-ghost`, `prose-glass` → globals.css에 정의

## 프로젝트 구조
```
src/
  app/
    page.tsx                  # 메인 페이지 (3단 레이아웃: 히스토리 | 상태 | 결과)
    layout.tsx                # 루트 레이아웃
    globals.css               # Glassmorphism 유틸리티 클래스 정의
    api/generate/route.ts     # SSE 스트리밍 API (크롤링 + AI 생성)
  components/
    layout/Header.tsx
    proposal/
      UrlInputForm.tsx        # URL 입력 폼
      ProposalResult.tsx      # 제안서 결과 (마크다운 렌더링)
      HistoryPanel.tsx        # 히스토리 목록 (즐겨찾기, 삭제)
    ui/
      Button.tsx
      LoadingSpinner.tsx
  hooks/
    useProposalGeneration.ts  # SSE 소비 + 상태관리 + 완료 후 Supabase 저장
    useHistory.ts             # 히스토리 조회/삭제/즐겨찾기
  lib/
    jina.ts                   # Jina AI Reader 래퍼 (URL 크롤링)
    openrouter.ts             # OpenRouter 클라이언트 + 기본 시스템 프롬프트
    proposals.ts              # Supabase CRUD (proposals 테이블)
    session.ts                # localStorage 기반 익명 세션 ID 관리
    supabase.ts               # Supabase 클라이언트 + 타입 정의
  types/index.ts              # GenerationStatus, SSEEvent 타입
supabase/
  migrations/                 # DB 스키마 (proposals, prompt_templates)
```

## 핵심 동작 흐름
```
URL 입력
  → POST /api/generate { url }
  → Jina API 크롤링 (최대 8000자)
  → OpenRouter 스트리밍 (SSE)
  → 클라이언트 실시간 렌더링
  → 완료 시 Supabase에 자동 저장
  → 히스토리 패널 갱신
```

## SSE 이벤트 포맷
```json
{ "type": "status", "status": "crawling" | "generating" }
{ "type": "chunk", "content": "..." }
{ "type": "done" }
{ "type": "error", "message": "..." }
```

## Supabase DB 스키마
```sql
proposals (id, session_id, url, url_title, content, prompt_used, created_at, is_starred)
prompt_templates (id, session_id, name, content, is_default, created_at)
```
- 회원가입 없음. `session_id`는 첫 방문 시 `crypto.randomUUID()` → localStorage 저장
- RLS 활성화 (정책: allow all — session_id 필터링은 앱 레벨에서 처리)

## 환경변수 (.env.local)
```
OPENROUTER_API_KEY=       # openrouter.ai
NEXT_PUBLIC_APP_URL=      # 배포 URL
NEXT_PUBLIC_SUPABASE_URL= # supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # supabase anon key
```

## 완료된 Phase
- **Phase 1**: Glassmorphism UI + 레이아웃
- **Phase 2**: URL 크롤링 + AI 스트리밍 생성 (MVP)
- **Phase 3**: Supabase 히스토리 저장 + 즐겨찾기/삭제

## 미완료 Phase (다음 작업)
- **Phase 4**: 프롬프트 커스터마이징 페이지 (`/prompts`)
  - 시스템 프롬프트 직접 수정
  - 여러 템플릿 저장/선택
  - 기본 프롬프트 복원 버튼
- **Phase 5**: GitHub ↔ Vercel 자동 배포 연결 (현재는 CLI 수동 배포)

## 알려진 제약
- OpenRouter 크레딧 부족 시 `max_tokens`를 낮춰야 함 (현재 1500)
- Vercel 프로젝트명이 "test"로 되어 있음 (변경 가능)
- GitHub-Vercel 자동배포 미연결 (수동 `vercel --prod` 필요)

## 배포 명령어
```bash
git add . && git commit -m "메시지" && git push origin main
npx vercel --token <vercel_token> --prod --yes
```
