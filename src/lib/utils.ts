import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('ko-KR')
  }
  return date.toLocaleDateString('ko-KR')
}

export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toLocaleString('ko-KR')
  }
  return date.toLocaleString('ko-KR')
}
