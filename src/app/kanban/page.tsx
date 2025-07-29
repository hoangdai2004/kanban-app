"use client";

import React, { useEffect, useState } from "react";
import { taskApi } from "@/apis/taskApi";
import type { Task } from "@/lib/db";

const KanbanPage = () => {
  const [tasks, settasks] = useState<Task[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const column = [
    { key: "open", title: "Open" },
    { key: "inprogress", title: "In Progress" },
    { key: "inreview", title: "In Review" },
    { key: "closed", title: "Closed" },
  ];

  const handleDrop = async (column: Task["column"]) => {
    if (!draggingTaskId) return;

    const task = tasks.find((t) => t.id === draggingTaskId);
    if (!task || task.column === column) return;

    const updated = await taskApi.update(task.id, { column });
    settasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, column } : t))
    );
  };

  useEffect(() => {
    taskApi.getAll().then(settasks).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {column.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.key as Task["column"])}
            className="bg-white rounded shadow-md p-4 min-h-[300px] flex flex-col"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {col.title}
            </h2>
            {tasks
              .filter((t) => t.column === col.key)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggingTaskId(task.id)}
                  className="bg-gray-100 hover:bg-gray-200 p-3 mb-3 rounded shadow-sm cursor-grab"
                >
                  <p className="text-sm font-medium">{task.title}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanPage;
