import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSanityWriteClient } from '@/lib/sanity/client'

const TASK_FIELDS = `_id, title, description, status, priority, deadline, _createdAt, _updatedAt,
  "createdBy": createdBy->{ _id, email, fullName, role },
  "assignedTo": assignedTo->{ _id, email, fullName, role }`

type Params = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const task = await getSanityWriteClient().fetch(
    `*[_type == "task" && _id == $id][0] { ${TASK_FIELDS} }`,
    { id }
  )

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (session.user.role === 'client' && task.createdBy?._id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(task)
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const isDeveloper = session.user.role === 'developer'

  const patch: Record<string, unknown> = {}
  if (body.title !== undefined) patch.title = body.title.trim()
  if (body.description !== undefined) patch.description = body.description?.trim() || undefined
  if (body.priority !== undefined) patch.priority = body.priority
  if (body.deadline !== undefined) patch.deadline = body.deadline || undefined
  if (isDeveloper && body.status !== undefined) patch.status = body.status

  const updated = await getSanityWriteClient().patch(id).set(patch).commit()
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'developer') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  await getSanityWriteClient().delete(id)
  return NextResponse.json({ success: true })
}
