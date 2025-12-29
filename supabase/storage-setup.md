# Supabase Storage 설정 가이드

## 1. Storage 버킷 생성

Supabase Dashboard > Storage로 이동하여 아래 버킷을 생성하세요:

### 버킷 이름: `room-photos`
- **Public**: Yes (공개) ✅
- **File size limit**: 5MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp, image/heic

---

## 2. Storage RLS 정책 설정

Storage 버킷에 대한 RLS 정책을 설정합니다.

Supabase Dashboard > Storage > room-photos > Policies로 이동하여 아래 정책들을 추가하세요:

### 정책 1: 인증된 사용자만 업로드 가능
```sql
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'room-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 정책 2: 누구나 조회 가능 (공개)
```sql
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'room-photos');
```

### 정책 3: 소유자만 삭제 가능
```sql
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'room-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 3. 파일 경로 규칙

업로드되는 파일의 경로 구조:
```
room-photos/{user_id}/{project_id}/{room_code}/{timestamp}-{filename}
```

예시:
```
room-photos/550e8400-e29b-41d4-a716-446655440000/abc123/201/1704067200000-photo.jpg
```

이렇게 하면:
- 사용자별로 폴더가 분리됨
- RLS 정책으로 본인 폴더만 접근 가능
- 프로젝트와 객실별로 사진 정리

---

## 4. 확인 사항

1. ✅ 버킷 `room-photos` 생성 완료
2. ✅ 3개의 RLS 정책 적용 완료
3. ✅ File size limit 5MB 설정 완료
4. ✅ Public access는 ON (공개) - 누구나 사진 조회 가능

완료!
