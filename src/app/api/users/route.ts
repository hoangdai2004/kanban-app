import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    await db.read();
    return NextResponse.json(db.data.users || []);
}

export async function POST(req: Request) {
    const body = await req.json();
    const newUser = {id: Date.now().toString(), ...body};
    db.data.users.push(newUser);
    await db.write();
    return NextResponse.json(newUser, {status: 201});
}