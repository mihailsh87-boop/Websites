import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSanityWriteClient } from '@/lib/sanity/client'

const TASK_FIELDS = `_id, title, description, status, priority, deadline, _createdAt, _updatedAt,
  "createdBy": createdBy->{ _id, email, fullName, role },
  "assignedTo": assignedTo->{ _id, email, fullName, role }`

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isClient = session.user.role === 'client'
  const query = isClient
    ? `*[_type == "task" && createdBy._ref == $userId] | order(_createdAt desc) { ${TASK_FIELDS} }`
    : `*[_type == "task"] | order(_createdAt desc) { ${TASK_FIELDS} }`

  const data = await getSanityWriteClient().fetch(query, { userId: session.user.id })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, priority, deadline } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })
  }

  const doc = await getSanityWriteClient().create({
    _type: 'task',
    title: title.trim(),
    description: description?.trim() || undefined,
    priority: priority || 'medium',
    status: 'new',
    deadline: deadline || undefined,
    createdBy: { _type: 'reference', _ref: session.user.id },
  })

  return NextResponse.json(doc, { status: 201 })
}
