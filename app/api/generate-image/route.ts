import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    })

    return NextResponse.json({ imageUrl: response.data[0].url })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
} 