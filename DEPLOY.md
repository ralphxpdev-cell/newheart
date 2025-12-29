# Vercel 재배포 가이드

## 현재 상황
- 로컬 프로덕션 빌드: ✅ 정상 작동
- Vercel 배포: ❌ 에러 (Digest: 2897199109)

## 해결 방법

### 1단계: Build Cache 삭제 후 재배포
1. Vercel Dashboard → newheart 프로젝트
2. Deployments 탭
3. 최신 배포의 ... 메뉴 → Redeploy
4. **"Use existing Build Cache" 체크 해제**
5. Redeploy 클릭

### 2단계: 환경 변수 재확인
Settings → Environment Variables에 다음이 있는지 확인:

```
NEXT_PUBLIC_SUPABASE_URL=https://ahlnjjqmuoewsxuzppzt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobG5qanFtdW9ld3N4dXpwcHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjAxMzAsImV4cCI6MjA4MjU5NjEzMH0.1szO39-I4VyiPZM195NsY74bgmqEKcuL856A7vpr-xY
```

Production, Preview, Development 모두 체크되어 있어야 함!

### 3단계: 배포 로그 확인
Deployments → 최신 배포 클릭 → Building 로그 확인

에러가 있으면 스크린샷 찍어서 확인

## 참고
- 로컬 테스트: `npm run build && npm run start`로 정상 작동 확인됨
- Vercel 캐시 문제일 가능성 높음
