import type { Access, CollectionConfig } from 'payload'

const isOwner: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}

export const TreatmentPlans: CollectionConfig = {
  slug: 'treatment-plans',
  admin: {
    hidden: true,
    useAsTitle: 'recommendation',
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
      name: 'recommendation',
      type: 'textarea',
      required: true,
    },
    {
      name: 'reminders',
      type: 'array',
      fields: [
        {
          name: 'time',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
  versions: false,
}
