import axios from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export const userApi = {
  getAll: () => axios.get<User[]>("/api/users").then((r) => r.data),
  getById: (id: string) =>
    axios.get<User>(`/api/users/${id}`).then((r) => r.data),
  create: (payload: Omit<User, "id">) =>
    axios
      .post<{ success: boolean; userId: string }>("/api/users", payload)
      .then((r) => {
        if (r.data.success) return r.data.userId;
        throw new Error("Signup failed");
      }),
  update: (id: string, payload: Partial<Omit<User, "id">>) =>
    axios.put(`/api/users/${id}`, payload).then((r) => r.data),
  remove: (id: string) => axios.delete(`/api/users/${id}`).then((r) => r.data),

  signIn: async (
    payload: Pick<User, "email" | "password">
  ): Promise<string> => {
    const res = await axios.post("/api/signin", payload);
    return res.data.userId;
  },
};
