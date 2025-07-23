import { NextResponse } from 'next/server'
import { db, initDB } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing email or password' }, { status: 400 })
    }

    await initDB()

    const user = db.data?.users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
