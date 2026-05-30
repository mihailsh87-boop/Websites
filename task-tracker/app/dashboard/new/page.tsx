import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TaskForm, TaskFormData } from '@/components/TaskForm'

export default async function NewTaskPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  async function createTask(formData: TaskFormData) {
    'use server'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Не авторизован' }

    const { error } = await supabase.from('tasks').insert({
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      priority: formData.priority,
      status: 'new',
      deadline: formData.deadline || null,
      created_by: user.id,
    })

    if (error) return { error: error.message }
    redirect('/dashboard')
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Новая задача</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <TaskForm userRole={profile?.role ?? 'client'} onSubmit={createTask} />
      </div>
    </div>
  )
}
