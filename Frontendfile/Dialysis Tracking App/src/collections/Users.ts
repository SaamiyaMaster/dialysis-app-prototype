import type { Access, CollectionConfig } from 'payload'

const isSelf: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    hidden: true,
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    delete: isSelf,
    read: isSelf,
    update: isSelf,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
    },
    {
      name: 'healthcareProvider',
      type: 'text',
    },
    {
      name: 'notificationsEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  versions: false,
}
