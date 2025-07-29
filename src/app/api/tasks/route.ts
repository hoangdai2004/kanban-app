import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  await db.read();
  return NextResponse.json(db.data!.tasks || []);
}

export async function POST(req: Request) {
  await db.read();

  const body = await req.json();
  const newTask = {
    id: crypto.randomUUID?.() ?? Date.now().toString(),
    column: "open",
    ...body,
  };
  
  db.data!.tasks.push(newTask);
  await db.write();

  return NextResponse.json({success: true, task: newTask}, {status: 201});
}
