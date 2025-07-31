"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskApi } from "@/apis/taskApi";
import type { Task } from "@/lib/db";
import { columns, ColumnKey } from "@/lib/constants/column";

import Button from "@/components/Button";
import TaskFormModal from "@/components/TaskFormModal";
import { Column } from "@/components/Colum";

const KanbanPage = () => {
  const router = useRouter();

  const [modalColumn, setModalColumn] = useState<ColumnKey>("open");
  const [searchKey, setSearchKey] = useState("");
  const [filter, setFilter] = useState("");
  const [tasks, setTask] = useState<Task[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/signin");
      return;
    }

    taskApi.getAll().then(setTask).catch(console.error);
  }, [router]);

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(searchKey.toLowerCase());
    const matchesType = filter ? task.type === filter : true;
    return matchesTitle && matchesType;
  });

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    router.push("/signin");
  };

  const handleCreated = (task: Task) => {
    setTask((prev) => [...prev, task]);
  };

  const handleDelete = async (id: string) => {
    try {
      await taskApi.remove(id);
      setTask((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Lỗi khi xóa task");
    }
  };

  const handleDrop = async (column: Task["column"]) => {
    if (!draggingTaskId) return;

    const task = tasks.find((t) => t.id === draggingTaskId);
    if (!task || task.column === column) return;

    await taskApi.update(task.id, { column });

    setTask((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, column } : t))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="p-2 border border-black rounded w-full sm:w-64"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-black rounded"
        >
          <option value="">All</option>
          <option value="Task">Task</option>
          <option value="Bug">Bug</option>
        </select>
      </div>

      <Button
        variant="primary"
        onClick={handleSignOut}
        className="ml-auto mb-4"
      >
        Sign out
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <Column
            key={col.key}
            col={col}
            tasks={filteredTasks.filter((t) => t.column === col.key)}
            onDrop={handleDrop}
            onDragStart={setDraggingTaskId}
            onAdd={() => {
              setModalColumn(col.key);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
        defaultColumn={modalColumn}
      />
    </div>
  );
};

export default KanbanPage;
