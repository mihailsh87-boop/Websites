import Link from 'next/link'
import { Task, TaskPriority } from '@/lib/types'
import { StatusBadge } from './StatusBadge'

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'text-slate-500',
  medium: 'text-amber-600',
  high: 'text-red-600',
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/dashboard/${task.id}`}>
      <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-medium text-slate-900 leading-snug">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>

        {task.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{task.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className={`font-medium ${PRIORITY_COLORS[task.priority]}`}>
            ↑ {PRIORITY_LABELS[task.priority]}
          </span>
          {task.deadline && (
            <span>До: {new Date(task.deadline).toLocaleDateString('ru-RU')}</span>
          )}
          <span>
            {new Date(task.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </Link>
  )
}
