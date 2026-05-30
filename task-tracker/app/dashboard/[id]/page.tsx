import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TaskForm, TaskFormData } from '@/components/TaskForm'
import { StatusBadge } from '@/components/StatusBadge'
import { Task } from '@/lib/types'

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: taskData }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user!.id).single(),
    supabase.from('tasks').select('*').eq('id', params.id).single(),
  ])

  if (!taskData) notFound()
  const task = taskData as Task

  async function updateTask(formData: TaskFormData) {
    'use server'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Не авторизован' }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    const update: Record<string, unknown> = {
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      priority: formData.priority,
      deadline: formData.deadline || null,
      updated_at: new Date().toISOString(),
    }

    if (profile?.role === 'developer') {
      update.status = formData.status
    }

    const { error } = await supabase.from('tasks').update(update).eq('id', params.id)
    if (error) return { error: error.message }
    redirect('/dashboard')
  }

  const createdDate = new Date(task.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-slate-900 flex-1">{task.title}</h1>
        <StatusBadge status={task.status} />
      </div>

      <p className="text-xs text-slate-400 mb-6">Создано: {createdDate}</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <TaskForm task={task} userRole={profile?.role ?? 'client'} onSubmit={updateTask} />
      </div>
    </div>
  )
}
