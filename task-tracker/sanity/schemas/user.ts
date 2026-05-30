import { defineField, defineType } from 'sanity'

export const userSchema = defineType({
  name: 'user',
  title: 'Пользователь',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Имя',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'passwordHash',
      title: 'Пароль (хэш)',
      type: 'string',
      validation: Rule => Rule.required(),
      hidden: ({ currentUser }) => !currentUser?.roles?.find(r => r.name === 'administrator'),
    }),
    defineField({
      name: 'role',
      title: 'Роль',
      type: 'string',
      options: {
        list: [
          { title: 'Заказчик', value: 'client' },
          { title: 'Разработчик', value: 'developer' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'email', role: 'role' },
    prepare({ title, subtitle, role }) {
      return {
        title: title || subtitle,
        subtitle: role === 'developer' ? 'Разработчик' : 'Заказчик',
      }
    },
  },
})
