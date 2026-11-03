import 'server-only'

import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import type { User } from '@/payload-types'

const SESSION_COOKIE = 'app-session'

async function setSession(token: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const payload = await getPayloadClient()
  const authHeaders = new Headers({ Authorization: `JWT ${token}` })
  const { user } = await payload.auth({ headers: authHeaders })

  if (!user || user.collection !== 'users') return null
  return user
}

export async function loginAppUser(email: string, password: string) {
  const payload = await getPayloadClient()
  const result = await payload.login({
    collection: 'users',
    data: { email, password },
  })

  if (!result.token || !result.user) {
    throw new Error('Unable to create a secure session.')
  }
  await setSession(result.token)
  return result.user
}

export async function logoutAppUser() {
  ;(await cookies()).delete(SESSION_COOKIE)
}
