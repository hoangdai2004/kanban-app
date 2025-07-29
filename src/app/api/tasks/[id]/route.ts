import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET (
    _req: Request,
    {params}: {params: {id: string}}
) {
    await db.read();
    const task = db.data!.tasks.find((t) => t.id === params.id)
    if (!task) return NextResponse.json({message: 'Task not found'}, {status: 404});
    return NextResponse.json(task);
}

export async function PUT (
    req: Request,
    {params} : {params: {id: string}}
) {
    await db.read();
    const idx = db.data!.tasks.findIndex((t) => t.id === params.id)
    if (idx === -1) return NextResponse.json({message: 'Task not found'}, {status: 404})
    
    const body = await req.json();
    db.data!.tasks[idx] = {...db.data!.tasks[idx], ...body};
    await db.write();
    return NextResponse.json(db.data!.tasks[idx]);
}

export async function DELETE (
    _req: Request,
    {params}: {params: {id: string}}
) {
    await db.read();
    const exists = db.data!.tasks.some((t) => t.id === params.id);
    if(!exists) return NextResponse.json({message: 'Task not found'}, {status: 404})

    db.data!.tasks = db.data!.tasks.filter((t) => t.id !== params.id);
    await db.write();
    return NextResponse.json({message: 'Delete successfully'});
}