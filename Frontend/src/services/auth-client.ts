const TOKEN_KEY = 'skillify_access_token'
const USER_KEY = 'skillify_user'

export type SkillifyUser = {
  id: string
  name?: string
  fullName?: string
  username?: string
  email: string
  role?: string
  avatar?: string | null
  profileImage?: string | null
  authProvider?: string
  emailVerified?: boolean
  lastLogin?: string | null
  createdAt?: string
  updatedAt?: string
}

export function getAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return localStorage.getItem(TOKEN_KEY) ?? undefined
}

export function getStoredUser(): SkillifyUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SkillifyUser
  } catch {
    return null
  }
}

export function setAuthSession(accessToken: string, user: any) {
  const mappedUser = {
    ...user,
    name: user.fullName || user.name || '',
    avatar: user.profileImage || user.avatar || null,
  }
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(mappedUser))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
