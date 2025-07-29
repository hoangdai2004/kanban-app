import axios from '@/lib/axios'

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export const userApi = {
    getAll: () => axios.get<User[]>('/api/users').then(r => r.data),
    getById: (id: string) => axios.get(`/api/users/${id}`).then(r => r.data),
    create: (payload: Omit<User, 'id'>) => axios.post('/api/users', payload).then(r => r.data),
    update: (id: string, payload: Partial<Omit<User, 'id'>>) => axios.put(`/api/users/${id}`, payload).then(r => r.data),
    remove: (id: string) => axios.delete(`/api/users/${id}`).then(r => r.data)
}