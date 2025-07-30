import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  await db.read();
  return NextResponse.json(db.data.users || []);
}

export async function POST(req: Request) {
  await db.read();

  const body = await req.json();
  const { email, name, password, avatar } = body;

  if (!db.data.users) db.data.users = [];

  const existingUser = db.data.users.find(user => user.email === email);
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already exists" },
      { status: 400 }
    );
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
    avatar,
  };

  db.data.users.push(newUser);
  await db.write();

  return NextResponse.json(
    {
      success: true,
      userId: newUser.id,
    },
    { status: 201 }
  );
}
