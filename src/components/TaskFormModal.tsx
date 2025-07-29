'use client'

import React, { useState } from 'react'
import { Task } from '@/lib/db'
import { taskApi } from '@/apis/taskApi'
import Button from './Button'

type Props = {
  isOpen: boolean
  onClose: () => void
  onCreated: (task: Task) => void
  defaultColumn?: Task['column']
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onCreated,
  defaultColumn = 'open',
}: Props) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'Task' | 'Bug'>('Task')
  const [dueDate, setDueDate] = useState('')
  const [urgent, setUrgent] = useState(false)

  const handleSubmit = async () => {
    const newTask = {
      title,
      type,
      dueDate,
      urgent,
      column: defaultColumn,
      assigneeAvatar: '/avatar-placeholder.png',
      assigneeName: 'You',
      code: `TASK-${Math.floor(Math.random() * 10000)}`,
    }

    const created = await taskApi.create(newTask)
    onCreated(created)
    onClose()
    setTitle('')
    setType('Task')
    setDueDate('')
    setUrgent(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

        <div className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="border p-2 w-full rounded"
            value={type}
            onChange={(e) => setType(e.target.value as 'Task' | 'Bug')}
          >
            <option value="Task">Task</option>
            <option value="Bug">Bug</option>
          </select>

          <input
            type="date"
            className="border p-2 w-full rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
            />
            Urgent
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}
