import axios from '@/lib/axios';
import type { Task } from '@/lib/db';

export const taskApi = {
    getAll: () => axios.get<Task[]>('/api/tasks').then((r) => r.data),
    getById: (id: string) => axios.get<Task>(`/api/tasks/${id}`).then((r) => r.data),
    create: (payload: Omit<Task, 'id'>) => axios.post<Task>('/api/tasks', payload).then((r) => r.data),
    update: (id: string, payload: Partial<Omit<Task, 'id'>>) => 
        axios.put<Task>(`/api/tasks/${id}`, payload).then((r) => r.data),
    remove: (id: string) => axios.delete(`/api/tasks/${id}`).then((r) => r.data),
}