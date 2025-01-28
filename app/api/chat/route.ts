import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    })

    // Get the text content from the response
    const messageContent = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'No text response available'

    return NextResponse.json({ response: messageContent })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
} 