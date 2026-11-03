import LogPDApp from './LogPDApp'
import { getCurrentUser } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

export default async function HomePage() {
  const user = await getCurrentUser()
  let initialEmergencyContacts: {
    automaticAfterHours: number
    automaticContact: boolean
    contactOrder: number
    firstName: string
    id: string
    lastName: string
    phone: string
  }[] = []
  let initialMoodEntries: {
    date: string
    energy: 'low' | 'steady' | 'good'
    id: string
    mood: 'great' | 'good' | 'okay' | 'low' | 'difficult'
    note?: string | null
  }[] = []
  let initialPlan = null

  if (user) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'treatment-plans',
      limit: 1,
      overrideAccess: false,
      user,
      where: { owner: { equals: user.id } },
    })
    const plan = result.docs[0]
    if (plan) {
      initialPlan = {
        recommendation: plan.recommendation,
        reminders: (plan.reminders ?? []).map((item) => ({
          enabled: item.enabled ?? true,
          label: item.label,
          time: item.time,
        })),
      }
    }

    const moodResult = await payload.find({
      collection: 'mood-entries',
      limit: 14,
      overrideAccess: false,
      sort: '-date',
      user,
      where: { owner: { equals: user.id } },
    })
    initialMoodEntries = moodResult.docs.map((entry) => ({
      date: entry.date,
      energy: entry.energy,
      id: entry.id,
      mood: entry.mood,
      note: entry.note,
    }))

    const contactResult = await payload.find({
      collection: 'emergency-contacts',
      limit: 50,
      overrideAccess: false,
      sort: 'contactOrder',
      user,
      where: { owner: { equals: user.id } },
    })
    initialEmergencyContacts = contactResult.docs.map((contact) => ({
      automaticAfterHours: contact.automaticAfterHours,
      automaticContact: contact.automaticContact ?? true,
      contactOrder: contact.contactOrder,
      firstName: contact.firstName,
      id: contact.id,
      lastName: contact.lastName,
      phone: contact.phone,
    }))
  }

  return (
    <LogPDApp
      initialEmergencyContacts={initialEmergencyContacts}
      initialMoodEntries={initialMoodEntries}
      initialPlan={initialPlan}
      initialUser={
        user
          ? {
              dateOfBirth: user.dateOfBirth,
              email: user.email,
              healthcareProvider: user.healthcareProvider,
              id: user.id,
              name: user.name,
              notificationsEnabled: user.notificationsEnabled,
            }
          : null
      }
    />
  )
}
