import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  await db.read();
  return NextResponse.json(db.data!.tasks || []);
}

function getUserIdFromRequest(req: Request): string | null {
  return req.headers.get("x-user-id") || null;
}

export async function POST(req: Request) {
  await db.read();

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = db.data!.users.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  const { title, type, dueDate, urgent, column } = body;

  if (!title || !type || !dueDate || typeof urgent !== "boolean" || !column) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const newTask = {
    id: crypto.randomUUID?.() ?? Date.now().toString(),
    title,
    type,
    dueDate,
    urgent,
    column,
    code: `TASK-${Math.floor(Math.random() * 10000)}`,
    creatorId: user.id,
    creatorName: user.name,
    creatorAvatar: user.avatar,
  };

  db.data!.tasks.push(newTask);
  await db.write();

  return NextResponse.json({ success: true, task: newTask }, { status: 201 });
}
