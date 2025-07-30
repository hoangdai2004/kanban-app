"use client";

import React from "react";
import { Task } from "@/lib/db";
import Image from "next/image";

type Props = {
  task: Task;
  onDelete?: (id: string) => void;
};

const TaskCard: React.FC<Props> = ({ task, onDelete }) => {
  return (
    <div className="bg-white hover:bg-gray-100 p-3 mb-3 rounded shadow-sm cursor-grab">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold">{task.title}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            task.type === "Bug"
              ? "bg-red-200 text-red-800"
              : "bg-blue-200 text-blue-800"
          }`}
        >
          {task.type}
        </span>
      </div>

      <div className="text-xs text-gray-600 mb-1">
        Due: {task.dueDate || "N/A"}
      </div>

      {task.urgent && (
        <div className="text-xs text-red-500 font-semibold mb-1">⚠ Urgent</div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <Image
          src={task.creatorAvatar}
          alt={task.creatorName}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span className="text-sm">{task.creatorName}</span>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(task.id)}
          className="mt-2 text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default TaskCard;
