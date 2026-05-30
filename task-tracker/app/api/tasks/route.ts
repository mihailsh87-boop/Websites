import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('tasks')
    .select('*, creator:profiles!created_by(id, full_name, email, role), assignee:profiles!assigned_to(id, full_name, email, role)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, priority, deadline } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'medium',
      status: 'new',
      deadline: deadline || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
