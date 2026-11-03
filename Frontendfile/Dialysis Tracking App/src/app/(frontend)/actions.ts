'use server'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser, loginAppUser, logoutAppUser } from '@/lib/app-auth'

export type AppUserView = {
  id: string
  email: string
  name: string
  dateOfBirth?: string | null
  healthcareProvider?: string | null
  notificationsEnabled?: boolean | null
}

export type PlanView = {
  recommendation: string
  reminders: { time: string; label: string; enabled: boolean }[]
}

export type MoodEntryView = {
  date: string
  energy: 'low' | 'steady' | 'good'
  id: string
  mood: 'great' | 'good' | 'okay' | 'low' | 'difficult'
  note?: string | null
}

export type EmergencyContactView = {
  automaticAfterHours: number
  automaticContact: boolean
  contactOrder: number
  firstName: string
  id: string
  lastName: string
  phone: string
}

type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

function userView(user: {
  id: string
  email: string
  name: string
  dateOfBirth?: string | null
  healthcareProvider?: string | null
  notificationsEnabled?: boolean | null
}): AppUserView {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    dateOfBirth: user.dateOfBirth,
    healthcareProvider: user.healthcareProvider,
    notificationsEnabled: user.notificationsEnabled,
  }
}

function cleanText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function loginAction(input: {
  email: string
  password: string
}): Promise<ActionResult<AppUserView>> {
  const email = cleanText(input.email, 254).toLowerCase()
  const password = cleanText(input.password, 128)
  if (!email || !password) return { ok: false, error: 'Enter your email and password.' }

  try {
    return { ok: true, data: userView(await loginAppUser(email, password)) }
  } catch {
    return { ok: false, error: 'That email or password is not correct.' }
  }
}

export async function signupAction(input: {
  email: string
  name: string
  password: string
}): Promise<ActionResult<AppUserView>> {
  const email = cleanText(input.email, 254).toLowerCase()
  const name = cleanText(input.name, 100)
  const password = cleanText(input.password, 128)
  if (!email || !name || password.length < 6) {
    return { ok: false, error: 'Complete all fields using a password of at least 6 characters.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      data: { email, name, password },
      overrideAccess: false,
    })
    return { ok: true, data: userView(await loginAppUser(email, password)) }
  } catch {
    return {
      ok: false,
      error: 'We could not create that account. The email may already be in use.',
    }
  }
}

export async function logoutAction(): Promise<ActionResult> {
  await logoutAppUser()
  return { ok: true, data: undefined }
}

export async function saveProfileAction(input: {
  dateOfBirth: string
  healthcareProvider: string
  name: string
  notificationsEnabled?: boolean
}): Promise<ActionResult<AppUserView>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const name = cleanText(input.name, 100)
  const healthcareProvider = cleanText(input.healthcareProvider, 140)
  const dateOfBirth = cleanText(input.dateOfBirth, 20)
  if (!name) return { ok: false, error: 'Name is required.' }

  const payload = await getPayloadClient()
  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      name,
      dateOfBirth: dateOfBirth || null,
      healthcareProvider: healthcareProvider || null,
      notificationsEnabled: input.notificationsEnabled,
    },
    overrideAccess: false,
    user,
  })
  return { ok: true, data: userView(updated) }
}

function reminderTimes(recommendation: string) {
  const text = recommendation.toLowerCase()
  if (text.includes('twice') || text.includes('two times')) return ['09:00', '18:00']
  if (text.includes('once') || text.includes('one time')) return ['09:00']
  if (text.includes('four')) return ['08:00', '12:00', '16:00', '20:00']
  return ['08:00', '14:00', '20:00']
}

export async function savePlanAction(recommendationInput: string): Promise<ActionResult<PlanView>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const recommendation = cleanText(recommendationInput, 2000)
  if (!recommendation) return { ok: false, error: 'Add your doctor’s recommendation first.' }

  const reminders = reminderTimes(recommendation).map((time) => ({
    enabled: true,
    label: 'Treatment',
    time,
  }))
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'treatment-plans',
    limit: 1,
    overrideAccess: false,
    user,
    where: { owner: { equals: user.id } },
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'treatment-plans',
      id: existing.docs[0].id,
      data: { recommendation, reminders },
      overrideAccess: false,
      user,
    })
  } else {
    await payload.create({
      collection: 'treatment-plans',
      data: { owner: user.id, recommendation, reminders },
      overrideAccess: false,
      user,
    })
  }

  return { ok: true, data: { recommendation, reminders } }
}

export async function setNotificationsAction(enabled: boolean): Promise<ActionResult<boolean>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const payload = await getPayloadClient()
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { notificationsEnabled: enabled },
    overrideAccess: false,
    user,
  })
  return { ok: true, data: enabled }
}

export async function saveMoodAction(input: {
  date: string
  energy: string
  mood: string
  note: string
}): Promise<ActionResult<MoodEntryView>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const moods = ['great', 'good', 'okay', 'low', 'difficult'] as const
  const energies = ['low', 'steady', 'good'] as const
  const mood = moods.find((value) => value === input.mood)
  const energy = energies.find((value) => value === input.energy)
  const datePart = cleanText(input.date, 10)
  const date = new Date(`${datePart}T12:00:00.000Z`)
  const note = cleanText(input.note, 600)

  if (!mood || !energy || Number.isNaN(date.getTime())) {
    return { ok: false, error: 'Choose your mood and energy level.' }
  }

  const payload = await getPayloadClient()
  const storedDate = date.toISOString()
  const existing = await payload.find({
    collection: 'mood-entries',
    limit: 1,
    overrideAccess: false,
    user,
    where: {
      and: [{ owner: { equals: user.id } }, { date: { equals: storedDate } }],
    },
  })

  const entry = existing.docs[0]
    ? await payload.update({
        collection: 'mood-entries',
        id: existing.docs[0].id,
        data: { date: storedDate, energy, mood, note: note || null },
        overrideAccess: false,
        user,
      })
    : await payload.create({
        collection: 'mood-entries',
        data: { owner: user.id, date: storedDate, energy, mood, note: note || null },
        overrideAccess: false,
        user,
      })

  return {
    ok: true,
    data: {
      date: entry.date,
      energy: entry.energy,
      id: entry.id,
      mood: entry.mood,
      note: entry.note,
    },
  }
}

export async function addEmergencyContactAction(input: {
  automaticAfterHours: number
  firstName: string
  lastName: string
  phone: string
}): Promise<ActionResult<EmergencyContactView>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const firstName = cleanText(input.firstName, 80)
  const lastName = cleanText(input.lastName, 80)
  const phone = cleanText(input.phone, 40)
  const automaticAfterHours = Math.min(168, Math.max(1, Math.round(input.automaticAfterHours)))
  if (!firstName || !lastName || phone.length < 7) {
    return { ok: false, error: 'Add a first name, last name, and valid phone number.' }
  }

  const payload = await getPayloadClient()
  const current = await payload.find({
    collection: 'emergency-contacts',
    limit: 1,
    overrideAccess: false,
    sort: '-contactOrder',
    user,
    where: { owner: { equals: user.id } },
  })
  const contactOrder = (current.docs[0]?.contactOrder ?? 0) + 1
  const contact = await payload.create({
    collection: 'emergency-contacts',
    data: {
      automaticAfterHours,
      automaticContact: true,
      contactOrder,
      firstName,
      lastName,
      owner: user.id,
      phone,
    },
    overrideAccess: false,
    user,
  })

  return {
    ok: true,
    data: {
      automaticAfterHours: contact.automaticAfterHours,
      automaticContact: contact.automaticContact ?? true,
      contactOrder: contact.contactOrder,
      firstName: contact.firstName,
      id: contact.id,
      lastName: contact.lastName,
      phone: contact.phone,
    },
  }
}

export async function toggleEmergencyContactAction(
  id: string,
  enabled: boolean,
): Promise<ActionResult<boolean>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const payload = await getPayloadClient()
  await payload.update({
    collection: 'emergency-contacts',
    id,
    data: { automaticContact: enabled },
    overrideAccess: false,
    user,
  })
  return { ok: true, data: enabled }
}

export async function clearAllDataAction(): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please sign in again.' }

  const payload = await getPayloadClient()
  await Promise.all([
    payload.delete({
      collection: 'mood-entries',
      overrideAccess: false,
      user,
      where: { owner: { equals: user.id } },
    }),
    payload.delete({
      collection: 'treatment-plans',
      overrideAccess: false,
      user,
      where: { owner: { equals: user.id } },
    }),
    payload.delete({
      collection: 'emergency-contacts',
      overrideAccess: false,
      user,
      where: { owner: { equals: user.id } },
    }),
  ])
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      dateOfBirth: null,
      healthcareProvider: null,
      notificationsEnabled: false,
    },
    overrideAccess: false,
    user,
  })

  return { ok: true, data: undefined }
}
