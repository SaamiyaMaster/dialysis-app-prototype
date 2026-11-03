import type { Access, CollectionConfig } from 'payload'

const isOwner: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}

export const EmergencyContacts: CollectionConfig = {
  slug: 'emergency-contacts',
  admin: {
    hidden: true,
    useAsTitle: 'firstName',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    delete: isOwner,
    read: isOwner,
    update: isOwner,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          const existing = await req.payload.find({
            collection: 'emergency-contacts',
            limit: 1,
            overrideAccess: false,
            sort: '-contactOrder',
            user: req.user,
            where: { owner: { equals: req.user.id } },
          })
          return {
            ...data,
            contactOrder: (existing.docs[0]?.contactOrder ?? 0) + 1,
            owner: req.user.id,
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'contactOrder',
      type: 'number',
      required: true,
      min: 1,
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'automaticAfterHours',
      type: 'number',
      required: true,
      min: 1,
      max: 168,
    },
    {
      name: 'automaticContact',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  versions: false,
}
