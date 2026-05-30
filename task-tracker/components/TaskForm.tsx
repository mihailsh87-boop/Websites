'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task, TaskPriority, TaskStatus, UserRole } from '@/lib/types'

interface TaskFormProps {
  task?: Task
  userRole: UserRole
  onSubmit: (data: TaskFormData) => Promise<{ error?: string } | void>
}

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  deadline: string
}

export function TaskForm({ task, userRole, onSubmit }: TaskFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'medium',
    status: task?.status ?? 'new',
    deadline: task?.deadline ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await onSubmit(formData)
    if (result && 'error' in result && result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Название <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Кратко опишите задачу"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Подробности, ссылки, требования..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Приоритет</label>
          <select
            value={formData.priority}
            onChange={e => setFormData(p => ({ ...p, priority: e.target.value as TaskPriority }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        {userRole === 'developer' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Статус</label>
            <select
              value={formData.status}
              onChange={e => setFormData(p => ({ ...p, status: e.target.value as TaskStatus }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="review">На проверке</option>
              <option value="done">Готово</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Дедлайн</label>
        <input
          type="date"
          value={formData.deadline}
          onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Сохраняю...' : (!task ? 'Создать задачу' : 'Сохранить')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
