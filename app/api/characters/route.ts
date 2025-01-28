import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const characterData = await req.json()
    
    const character = await prisma.character.create({
      data: {
        ...characterData,
        userId: 'temp-user-id', // We'll update this when we add auth
      },
    })

    return NextResponse.json(character)
  } catch (error) {
    console.error('Failed to create character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
} 