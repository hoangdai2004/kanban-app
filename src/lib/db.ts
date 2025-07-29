import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

type User = { 
  id: string; 
  name: string; 
  email: string; 
  password: string 
};

export type Task = { 
  id: string; 
  title: string; 
  column: 'open' | 'inprogress' | 'inreview' | 'closed';
  type?: 'Task' | 'Bug';
  code?: string;
  deadline?: string;
  priority?: boolean;
  assigneeId?: string;
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
  db.data ||= { users: [], tasks: [] };
}
