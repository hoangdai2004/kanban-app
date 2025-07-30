import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function getUserIdFromRequest(req: Request): string | null {
  return req.headers.get("x-user-id") || null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await db.read();
  const task = db.data!.tasks.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.read();

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const idx = db.data!.tasks.findIndex((t) => t.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const task = db.data!.tasks[idx];

//   if (task.creatorId !== userId) {
//     return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//   }

  const body = await req.json();

  const allowedFields = ["title", "type", "dueDate", "urgent", "column"];
  const updatedData: Partial<typeof task> = {};

  for (const key of allowedFields) {
    if (key in body) {
      updatedData[key as keyof typeof updatedData] = body[key];
    }
  }

  db.data!.tasks[idx] = { ...task, ...updatedData };
  await db.write();

  return NextResponse.json(db.data!.tasks[idx]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.read();

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const task = db.data!.tasks.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

//   if (task.creatorId !== userId) {
//     return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//   }

  db.data!.tasks = db.data!.tasks.filter((t) => t.id !== params.id);
  await db.write();

  return NextResponse.json({ message: "Delete successfully" });
}