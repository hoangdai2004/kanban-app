import { NextResponse } from 'next/server'
import { db, initDB } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 })
    }

    await initDB()

    const userExists = db.data?.users.find(u => u.email === email)
    if (userExists) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 409 })
    }

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password,
    }

    db.data?.users.push(newUser)
    await db.write()

    return NextResponse.json({ success: true, userId: newUser.id }, { status: 201 })
  } catch (err) {
    console.error("Signup API Error:", err)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
