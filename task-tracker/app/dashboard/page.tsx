import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getSanityWriteClient } from '@/lib/sanity/client'
import { TaskCard } from '@/components/TaskCard'
import { Task, TaskStatus } from '@/lib/types'

const STATUS_GROUPS: { key: TaskStatus; label: string }[] = [
  { key: 'new', label: 'Новые' },
  { key: 'in_progress', label: 'В работе' },
  { key: 'review', label: 'На проверке' },
  { key: 'done', label: 'Готово' },
]

const TASK_FIELDS = `_id, title, description, status, priority, deadline, _createdAt, _updatedAt,
  "createdBy": createdBy->{ _id, email, fullName, role },
  "assignedTo": assignedTo->{ _id, email, fullName, role }`

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const isClient = session.user.role === 'client'
  const query = isClient
    ? `*[_type == "task" && createdBy._ref == $userId] | order(_createdAt desc) { ${TASK_FIELDS} }`
    : `*[_type == "task"] | order(_createdAt desc) { ${TASK_FIELDS} }`

  const tasks = await getSanityWriteClient().fetch<Task[]>(query, { userId: session.user.id })

  const grouped = STATUS_GROUPS
    .map(g => ({ ...g, items: tasks.filter((t: Task) => t.status === g.key) }))
    .filter(g => g.items.length > 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Задачи</h1>
        <Link
          href="/dashboard/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Новая задача
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg mb-2">Задач пока нет</p>
          <p className="text-sm">Создайте первую задачу, нажав кнопку выше</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(group => (
            <div key={group.key}>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
                {group.label} · {group.items.length}
              </h2>
              <div className="space-y-3">
                {group.items.map(task => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
