import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
};

export type Task = {
  id: string;
  title: string;
  type: "Task" | "Bug";
  dueDate: string;
  urgent: boolean;
  column: "open" | "inprogress" | "inreview" | "closed";
  code: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
};

type Schema = {
  users: User[];
  tasks: Task[];
};

const file = join(process.cwd(), "db.json");
const adapter = new JSONFile<Schema>(file);
export const db = new Low<Schema>(adapter, { users: [], tasks: [] });

export async function initDB() {
  await db.read();

  if (!db.data || typeof db.data !== "object") {
    db.data = { users: [], tasks: [] };
  }

  db.data.users ||= [];
  db.data.tasks ||= [];
}

export async function saveDB() {
  await db.write();
}
