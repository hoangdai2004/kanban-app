import axios from "axios"
import type { Task } from "@/lib/db"

function getAuthHeaders() {
  const userId = localStorage.getItem("userId") || ""
  return {
    headers: {
      "x-user-id": userId,
    },
  }
}

export const taskApi = {
  getAll: (): Promise<Task[]> =>
    axios.get("/api/tasks").then((r) => r.data),

  getById: (id: string): Promise<Task> =>
    axios.get(`/api/tasks/${id}`).then((r) => r.data),

  create: (payload: Omit<Task, "id" | "code">): Promise<Task> =>
    axios.post("/api/tasks", payload, getAuthHeaders()).then((r) => r.data),

  update: (id: string, payload: Partial<Omit<Task, "id">>): Promise<Task> =>
    axios.put(`/api/tasks/${id}`, payload, getAuthHeaders()).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axios.delete(`/api/tasks/${id}`, getAuthHeaders()).then((r) => r.data),
}
