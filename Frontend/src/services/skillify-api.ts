import { getAccessToken } from './auth-client'

/** Browser calls to the Skillify Express API (default http://localhost:5000). */
export function getSkillifyApiOrigin(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
  return url.replace(/\/$/, '')
}

type ApiSuccess<T> = { success: true; data: T }
type ApiErrorBody = { success?: false; message?: string; code?: string }

function getErrorMessage(json: unknown, status: number): string {
  if (json && typeof json === 'object' && 'message' in json && typeof (json as ApiErrorBody).message === 'string') {
    return (json as ApiErrorBody).message!
  }
  return `Request failed (${status})`
}

export async function skillifyPostJson<T>(path: string, body: unknown, init?: { token?: string }): Promise<T> {
  const origin = getSkillifyApiOrigin()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = init?.token || getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${origin}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const json = (await res.json().catch(() => ({}))) as ApiSuccess<T> | ApiErrorBody

  if (!res.ok || json.success === false) {
    throw new Error(getErrorMessage(json, res.status))
  }

  if (!('data' in json) || json.success !== true) {
    throw new Error(getErrorMessage(json, res.status))
  }

  return json.data
}

export async function skillifyGetJson<T>(path: string, init?: { token?: string }): Promise<T> {
  const origin = getSkillifyApiOrigin()
  const headers: Record<string, string> = {}
  const token = init?.token || getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${origin}${path}`, {
    method: 'GET',
    headers,
  })

  const json = (await res.json().catch(() => ({}))) as ApiSuccess<T> | ApiErrorBody

  if (!res.ok || json.success === false) {
    throw new Error(getErrorMessage(json, res.status))
  }

  if (!('data' in json) || json.success !== true) {
    throw new Error(getErrorMessage(json, res.status))
  }

  return json.data
}

export async function skillifyPutJson<T>(path: string, body: unknown, init?: { token?: string }): Promise<T> {
  const origin = getSkillifyApiOrigin()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = init?.token || getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${origin}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })

  const json = (await res.json().catch(() => ({}))) as ApiSuccess<T> | ApiErrorBody

  if (!res.ok || json.success === false) {
    throw new Error(getErrorMessage(json, res.status))
  }

  if (!('data' in json) || json.success !== true) {
    throw new Error(getErrorMessage(json, res.status))
  }

  return json.data
}

export async function skillifyDeleteJson<T>(path: string, init?: { token?: string }): Promise<T> {
  const origin = getSkillifyApiOrigin()
  const headers: Record<string, string> = {}
  const token = init?.token || getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${origin}${path}`, {
    method: 'DELETE',
    headers,
  })

  const json = (await res.json().catch(() => ({}))) as ApiSuccess<T> | ApiErrorBody

  if (!res.ok || json.success === false) {
    throw new Error(getErrorMessage(json, res.status))
  }

  if (!('data' in json) || json.success !== true) {
    throw new Error(getErrorMessage(json, res.status))
  }

  return json.data
}
