'use client'

import { useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadRoomPhoto, deleteRoomPhoto } from '@/actions/photos'
import Image from 'next/image'

interface Photo {
  id: string
  storage_path: string
  caption: string | null
  url: string
  created_at: string
}

interface PhotoGalleryProps {
  projectId: string
  progressId: string
  photos: Photo[]
}

export default function PhotoGallery({ projectId, progressId, photos: initialPhotos }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('project_id', projectId)
    formData.append('progress_id', progressId)

    const result = await uploadRoomPhoto(formData)

    if (result.error) {
      alert(`업로드 실패: ${result.error}`)
    } else {
      alert('사진이 업로드되었습니다.')
      setShowUploadForm(false)
      window.location.reload()
    }

    setUploading(false)
  }

  async function handleDelete(id: string, storagePath: string) {
    if (!confirm('사진을 삭제하시겠습니까?')) {
      return
    }

    const result = await deleteRoomPhoto(id, storagePath)

    if (result.error) {
      alert(`삭제 실패: ${result.error}`)
    } else {
      setPhotos(photos.filter(p => p.id !== id))
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          현장사진 ({photos.length})
        </h5>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          <Upload className="h-4 w-4 mr-2" />
          사진 업로드
        </Button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="p-4 border rounded-lg space-y-4">
          <div>
            <Label htmlFor={`file-${progressId}`}>사진 파일</Label>
            <Input
              id={`file-${progressId}`}
              name="file"
              type="file"
              accept="image/*"
              required
              disabled={uploading}
            />
          </div>
          <div>
            <Label htmlFor={`caption-${progressId}`}>설명 (선택)</Label>
            <Input
              id={`caption-${progressId}`}
              name="caption"
              type="text"
              placeholder="사진 설명을 입력하세요"
              disabled={uploading}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={uploading}>
              {uploading ? '업로드 중...' : '업로드'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUploadForm(false)}
              disabled={uploading}
            >
              취소
            </Button>
          </div>
        </form>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                <Image
                  src={photo.url}
                  alt={photo.caption || '현장사진'}
                  fill
                  className="object-cover"
                />
              </div>
              {photo.caption && (
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  {photo.caption}
                </p>
              )}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => handleDelete(photo.id, photo.storage_path)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          등록된 사진이 없습니다.
        </p>
      )}
    </div>
  )
}
