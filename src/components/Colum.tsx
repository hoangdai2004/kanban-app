"use client";

import React from "react";
import { Task } from "@/lib/db";
import TaskCard from "@/components/TaskCard";
import Button from "@/components/Button";

type ColumnProps = {
  col: { key: Task["column"]; title: string };
  tasks: Task[];
  onDrop: (column: Task["column"]) => void;
  onDragStart: (taskId: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export const Column = ({
  col,
  tasks,
  onDrop,
  onDragStart,
  onAdd,
  onDelete,
}: ColumnProps) => {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(col.key)}
      className={`rounded shadow-md p-4 min-h-[300px] flex flex-col w-full ${
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
        <h2 className="text-lg font-semibold text-gray-700">{col.title}</h2>
        <Button variant="primary" onClick={onAdd}>
          Add
        </Button>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => onDragStart(task.id)}
        >
          <TaskCard task={task} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};
