"use client";

import React, { useEffect, useState } from "react";
import { taskApi } from "@/apis/taskApi";
import type { Task } from "@/lib/db";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import TaskFormModal from "@/components/TaskFormModal";
import TaskCard from "@/components/TaskCard";

const KanbanPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [tasks, settasks] = useState<Task[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState<Task["column"]>("open");

  const columns = [
    { key: "open", title: "Open" },
    { key: "inprogress", title: "In Progress" },
    { key: "inreview", title: "In Review" },
    { key: "closed", title: "Closed" },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filter ? task.type === filter : true;
    return matchesTitle && matchesType;
  });

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    router.push("/signin");
  };

  const handleDrop = async (column: Task["column"]) => {
    if (!draggingTaskId) return;
    const task = tasks.find((t) => t.id === draggingTaskId);
    if (!task || task.column === column) return;
    await taskApi.update(task.id, { column });
    settasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, column } : t))
    );
  };

  const handleCreated = (task: Task) => {
    settasks((prev) => [...prev, task]);
  };

  const handleDelete = async (id: string) => {
    try {
      await taskApi.remove(id);
      settasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Lỗi khi xóa task");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/signin");
      return;
    }

    taskApi.getAll().then(settasks).catch(console.error);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.key as Task["column"])}
            className={`rounded shadow-md p-4 min-h-[300px] flex flex-col ${
              col.key === "open"
                ? "bg-blue-200"
                : col.key === "inprogress"
                ? "bg-yellow-200"
                : col.key === "inreview"
                ? "bg-purple-200"
                : "bg-green-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {col.title}
              </h2>
              <Button
                variant="primary"
                onClick={() => {
                  setModalColumn(col.key as Task["column"]);
                  setModalOpen(true);
                }}
              >
                Add
              </Button>
            </div>

            {filteredTasks
              .filter((t) => t.column === col.key)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggingTaskId(task.id)}
                >
                  <TaskCard task={task} onDelete={handleDelete} />
                </div>
              ))}
          </div>
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
