# NewHeart - 현장 프로젝트 관리 MVP

현장 프로젝트를 효율적으로 관리하는 웹 애플리케이션입니다.

## 📋 주요 기능

- ✅ **프로젝트 관리**: 여러 현장 프로젝트를 생성하고 관리
- ✅ **현장일지**: 일별 작업 내용 기록, 팔로우업 관리
- ✅ **작업내용**: 공정별 작업 관리 (칸반 보드)
- ✅ **관리업무**: Todo 및 업무 관리 (우선순위, 담당자)
- ✅ **캘린더**: 마감일 기준 작업 일정 확인
- ✅ **진행률**: 객실/공간별 공정 진행률 추적
- ✅ **현장사진**: 공간별 사진 업로드 및 관리
- ✅ **이메일 로그인**: 매직 링크 방식의 간편 인증

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **UI**: shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **배포**: Vercel

## 📦 설치 및 실행

### 1. 프로젝트 클론 또는 파일 복사

이 프로젝트의 모든 파일을 로컬 환경에 복사합니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. Supabase 프로젝트 설정

#### 3.1 Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속
2. "New Project" 클릭하여 프로젝트 생성
3. 프로젝트 이름, 비밀번호, 리전 설정

#### 3.2 데이터베이스 초기화

1. Supabase Dashboard > SQL Editor 이동
2. `supabase/init.sql` 파일 내용 전체 복사
3. SQL Editor에 붙여넣고 실행 (Run)
4. 모든 테이블과 RLS 정책이 생성됩니다

#### 3.3 Storage 설정

1. Supabase Dashboard > Storage 이동
2. "Create bucket" 클릭
   - Name: `room-photos`
   - Public: OFF (비공개)
3. `room-photos` 버킷 클릭 > Policies 탭
4. `supabase/storage-setup.md` 파일의 3개 정책을 각각 추가:
   - Users can upload own photos
   - Users can view own photos
   - Users can delete own photos

#### 3.4 환경변수 설정

1. Supabase Dashboard > Settings > API
2. Project URL과 anon public key 복사
3. 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 🚀 Vercel 배포

### 1. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com) 접속
2. "New Project" 클릭
3. GitHub 저장소 연결 또는 직접 배포

### 2. 환경변수 설정

Vercel Dashboard > Project Settings > Environment Variables에서 다음 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. 배포

```bash
npm run build  # 로컬에서 빌드 테스트
```

Vercel에서 자동으로 빌드 및 배포됩니다.

## 📖 사용 방법

### 1. 회원가입 및 로그인

1. `/login` 페이지에서 이메일 입력
2. 이메일로 전송된 매직 링크 클릭
3. 자동으로 로그인되어 `/projects` 페이지로 이동

### 2. 프로젝트 생성

1. "새 프로젝트" 버튼 클릭
2. 프로젝트 이름과 상태 입력
3. 생성된 프로젝트 대시보드로 자동 이동

### 3. 현장일지 작성

1. 프로젝트 > 현장일지 메뉴
2. 빠른 추가 폼에서 날짜, 날씨, 작업 내용 입력
3. 팔로우업이 필요한 경우 체크박스 선택
4. 저장 버튼 클릭

### 4. 작업내용 관리

1. 프로젝트 > 작업내용 메뉴
2. 작업명, 담당 팀, 마감일 등 입력
3. 칸반 보드에서 드래그 앤 드롭으로 상태 변경 (수동)
4. 대기 → 진행중 → 완료로 진행

### 5. 관리업무/Todo

1. 프로젝트 > 관리업무 메뉴
2. 업무명, 우선순위, 담당자 등 입력
3. 마감일 설정으로 캘린더에도 표시

### 6. 캘린더 확인

1. 프로젝트 > 캘린더 메뉴
2. 마감일 기준으로 모든 작업과 업무 확인
3. 지난 날짜의 미완료 항목은 빨간 테두리로 표시

### 7. 진행률 관리

1. 프로젝트 > 진행률 메뉴
2. 공간 코드 (예: 201, 로비) 입력
3. 각 공정별 진행률(0-100%) 입력
4. 전체 평균 진행률 자동 계산

## 🎨 디자인 특징

- **다크모드 기본**: 눈의 피로를 줄이는 다크 테마
- **미니멀 디자인**: 깔끔하고 정돈된 블랙&화이트 기반
- **모바일 최적화**: 현장에서도 편한 모바일 UI
- **직관적 UX**: 빠른 추가, 필터링, 정렬 기능

## 📁 프로젝트 구조

```
newheart/
├── src/
│   ├── app/                    # Next.js 페이지
│   │   ├── login/             # 로그인 페이지
│   │   ├── projects/          # 프로젝트 목록
│   │   └── p/[projectId]/     # 프로젝트 상세
│   │       ├── logs/          # 현장일지
│   │       ├── tasks/         # 작업내용
│   │       ├── todos/         # 관리업무
│   │       ├── calendar/      # 캘린더
│   │       └── progress/      # 진행률
│   ├── components/            # React 컴포넌트
│   │   ├── ui/               # shadcn/ui 컴포넌트
│   │   ├── projects/         # 프로젝트 관련
│   │   ├── logs/             # 현장일지 관련
│   │   ├── tasks/            # 작업내용 관련
│   │   ├── todos/            # Todo 관련
│   │   └── progress/         # 진행률 관련
│   ├── actions/              # Server Actions
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── logs.ts
│   │   ├── tasks.ts
│   │   ├── todos.ts
│   │   └── progress.ts
│   └── lib/                  # 유틸리티
│       ├── supabase/         # Supabase 클라이언트
│       └── types/            # TypeScript 타입
├── supabase/                 # Supabase 설정
│   ├── init.sql             # 데이터베이스 스키마
│   └── storage-setup.md     # Storage 설정 가이드
└── public/                   # 정적 파일
```

## 🔒 보안

- **RLS (Row Level Security)**: 모든 테이블에 적용
- **사용자 격리**: 각 사용자는 본인 데이터만 접근 가능
- **Storage 정책**: 파일 업로드/다운로드 권한 제어
- **Server Actions**: 모든 데이터 변경은 서버에서 처리

## 🐛 문제 해결

### 로그인이 안 됩니다

1. Supabase > Authentication > Settings에서 이메일 설정 확인
2. `.env.local` 파일의 환경변수 확인
3. Supabase 프로젝트의 이메일 템플릿 설정 확인

### 데이터가 표시되지 않습니다

1. Supabase SQL Editor에서 `init.sql` 정상 실행 확인
2. RLS 정책이 모든 테이블에 적용되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 이미지 업로드가 안 됩니다

1. Supabase Storage에서 `room-photos` 버킷 생성 확인
2. Storage 정책 3개가 모두 적용되었는지 확인
3. 파일 크기가 5MB 이하인지 확인

## 📝 추가 개발 아이디어

- [ ] PDF 보고서 자동 생성
- [ ] 엑셀 데이터 import/export
- [ ] 팀원 초대 및 권한 관리
- [ ] 실시간 알림 (Supabase Realtime)
- [ ] 작업 템플릿 저장 및 재사용
- [ ] 비용 관리 모듈
- [ ] 안전 관리 체크리스트
- [ ] 날씨 API 자동 연동

## 📄 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🙋 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.
