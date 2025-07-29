// components/TaskCard.tsx

import React from 'react'
import { Task } from '@/lib/db'
import Image from 'next/image'

type Props = {
  task: Task
}

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-3 mb-3 rounded shadow-sm cursor-grab">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold">{task.title}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            task.type === 'Bug' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'
          }`}
        >
          {task.type}
        </span>
      </div>

      <div className="text-xs text-gray-600 mb-1">
        Due: {task.dueDate || 'N/A'}
      </div>

      {task.urgent && (
        <div className="text-xs text-red-500 font-semibold mb-1">
          ⚠ Urgent
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <Image
          src={task.assigneeAvatar || '/avatar-placeholder.png'}
          alt="Avatar"
          width={24}
          height={24}
          className="rounded-full"
        />
        <span className="text-sm">{task.assigneeName || 'Unassigned'}</span>
      </div>
    </div>
  )
}

export default TaskCard
