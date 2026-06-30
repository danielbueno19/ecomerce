const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const resolveImageUrl = (image?: string | null): string | undefined => {
  if (!image) return undefined

  const value = image.trim()
  if (!value) return undefined

  if (/^https?:\/\//i.test(value)) {
    return value.replace('http://localhost:5173', BACKEND_URL).replace('http://127.0.0.1:5173', BACKEND_URL)
  }

  const normalized = value.replace(/^\/+/, '')
  if (normalized.startsWith('images/')) {
    return `${BACKEND_URL}/${normalized}`
  }

  return `${BACKEND_URL}/images/${normalized}`
}
