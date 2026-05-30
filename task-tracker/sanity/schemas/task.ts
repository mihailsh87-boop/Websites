import { defineField, defineType } from 'sanity'

export const taskSchema = defineType({
  name: 'task',
  title: 'Задача',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          { title: 'Новая', value: 'new' },
          { title: 'В работе', value: 'in_progress' },
          { title: 'На проверке', value: 'review' },
          { title: 'Готово', value: 'done' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'priority',
      title: 'Приоритет',
      type: 'string',
      options: {
        list: [
          { title: 'Низкий', value: 'low' },
          { title: 'Средний', value: 'medium' },
          { title: 'Высокий', value: 'high' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'deadline',
      title: 'Дедлайн',
      type: 'date',
    }),
    defineField({
      name: 'createdBy',
      title: 'Создал',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'assignedTo',
      title: 'Назначено',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', priority: 'priority' },
    prepare({ title, status, priority }) {
      const statusMap: Record<string, string> = { new: 'Новая', in_progress: 'В работе', review: 'На проверке', done: 'Готово' }
      return { title, subtitle: statusMap[status] || status }
    },
  },
  orderings: [
    { title: 'Дата создания (новые)', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Статус', name: 'statusAsc', by: [{ field: 'status', direction: 'asc' }] },
  ],
})
