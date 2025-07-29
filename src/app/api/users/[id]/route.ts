import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await db.read();
  const user = db.data.users.find((u) => u.id === params.id);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.read();
  const index = db.data.users.findIndex((u) => u.id === params.id);

  if (index === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  db.data.users[index] = { ...db.data.users[index], ...body };
  await db.write();

  return NextResponse.json(db.data.users[index]);
}

export async function DELETE(
    _req: Request,
    {params} : {params: {id: string}}
) {
    await db.read()
    const exists = db.data.users.some((u) => u.id === params.id);

    if (!exists) {
        return NextResponse.json({message: 'User not found'}, {status: 404})
    }

    db.data.users = db.data.users.filter((u) => u.id !== params.id);
    await db.write()

    return NextResponse.json({message: 'Delete successfully'});
}
