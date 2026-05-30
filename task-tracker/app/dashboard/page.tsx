import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TaskCard } from '@/components/TaskCard'
import { Task, TaskStatus } from '@/lib/types'

const STATUS_GROUPS: { key: TaskStatus; label: string }[] = [
  { key: 'new', label: 'Новые' },
  { key: 'in_progress', label: 'В работе' },
  { key: 'review', label: 'На проверке' },
  { key: 'done', label: 'Готово' },
]

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  const taskList = (tasks as Task[]) ?? []
  const grouped = STATUS_GROUPS.map(g => ({
    ...g,
    items: taskList.filter(t => t.status === g.key),
  })).filter(g => g.items.length > 0)

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

      {taskList.length === 0 ? (
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
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
