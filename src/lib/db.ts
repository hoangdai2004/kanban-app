import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

type User = { id: string; name: string; email: string; password: string };
type Task = { id: string; title: string; column: string };

type Data = {
  users: User[];
  tasks: Task[];
};

const file = join(process.cwd(), "db.json");
const adapter = new JSONFile<Data>(file);
export const db = new Low<Data>(adapter, { users: [], tasks: [] });

export async function initDB() {
  await db.read();
  db.data ||= { users: [], tasks: [] };
}
