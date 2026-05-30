import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSanityWriteClient } from '@/lib/sanity/client'
import { TaskForm, TaskFormData } from '@/components/TaskForm'
import { StatusBadge } from '@/components/StatusBadge'
import { Task } from '@/lib/types'

const TASK_FIELDS = `_id, title, description, status, priority, deadline, _createdAt, _updatedAt,
  "createdBy": createdBy->{ _id, email, fullName, role },
  "assignedTo": assignedTo->{ _id, email, fullName, role }`

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  const task = await getSanityWriteClient().fetch<Task>(
    `*[_type == "task" && _id == $id][0] { ${TASK_FIELDS} }`,
    { id }
  )

  if (!task) notFound()

  if (session.user.role === 'client' && task.createdBy?._id !== session.user.id) {
    redirect('/dashboard')
  }

  async function updateTask(formData: TaskFormData) {
    'use server'
    const session = await auth()
    if (!session) return { error: 'Не авторизован' }

    const patch: Record<string, unknown> = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      priority: formData.priority,
      deadline: formData.deadline || undefined,
    }

    if (session.user.role === 'developer') {
      patch.status = formData.status
    }

    await getSanityWriteClient().patch(id).set(patch).commit()
    redirect('/dashboard')
  }

  const createdDate = new Date(task._createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-xl font-semibold text-slate-900 flex-1">{task.title}</h1>
        <StatusBadge status={task.status} />
      </div>
      <p className="text-xs text-slate-400 mb-6">Создано: {createdDate}</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <TaskForm
          task={task}
          userRole={session.user.role as 'client' | 'developer'}
          onSubmit={updateTask}
        />
      </div>
    </div>
  )
}
