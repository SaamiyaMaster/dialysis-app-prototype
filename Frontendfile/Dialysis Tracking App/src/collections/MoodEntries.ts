import type { Access, CollectionConfig } from 'payload'

const isOwner: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}

export const MoodEntries: CollectionConfig = {
  slug: 'mood-entries',
  admin: {
    hidden: true,
    useAsTitle: 'date',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    delete: isOwner,
    read: isOwner,
    update: isOwner,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          return { ...data, owner: req.user.id }
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
      name: 'date',
      type: 'date',
      required: true,
      index: true,
    },
    {
      name: 'mood',
      type: 'select',
      required: true,
      options: ['great', 'good', 'okay', 'low', 'difficult'],
    },
    {
      name: 'energy',
      type: 'select',
      required: true,
      options: ['low', 'steady', 'good'],
    },
    {
      name: 'note',
      type: 'textarea',
    },
  ],
  versions: false,
}
