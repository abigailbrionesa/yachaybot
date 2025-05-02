import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email: username } })

  if (user && user.password === password) {
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
}
