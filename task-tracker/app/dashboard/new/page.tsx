import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSanityWriteClient } from '@/lib/sanity/client'
import { TaskForm, TaskFormData } from '@/components/TaskForm'

export default async function NewTaskPage() {
  const session = await auth()
  if (!session) redirect('/login')

  async function createTask(formData: TaskFormData) {
    'use server'
    const session = await auth()
    if (!session) return { error: 'Не авторизован' }

    await getSanityWriteClient().create({
      _type: 'task',
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      priority: formData.priority,
      status: 'new',
      deadline: formData.deadline || undefined,
      createdBy: { _type: 'reference', _ref: session.user.id },
    })

    redirect('/dashboard')
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Новая задача</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <TaskForm userRole={session.user.role as 'client' | 'developer'} onSubmit={createTask} />
      </div>
    </div>
  )
}
