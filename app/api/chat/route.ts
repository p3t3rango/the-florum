import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const ETERNAL_GARDEN_CONTEXT = `
The story takes place in the Nexus Solar System, which orbits around ARC-7, a Constructed Sun. The system consists of seven planets, including Phoenix - a planet of fire and renewal.

Key elements:
- Phoenix is known for healing and revitalization
- The planet features volcanic landscapes and bioluminescent flora
- Society is divided into distinct races and social classes:
  * Arcadians: An ancient race with deep connections to the Eternal Garden
  * Paragon: A highly evolved race known for their advanced abilities
  * Verdan: Nature-attuned beings with organic technologies
  * Kindred: Known for their charcoal skin, flame abilities, and glowing red eyes
  * Aquatics: Water-adapted beings with fluid-based technologies
  * Lithians: Stone-based beings with crystalline properties
  * Solaris: Light-based entities with solar affinities
  * Chromatics: Beings who can manipulate color and light
  * Cybernetic: Technologically augmented beings
  * Convergents: Hybrid beings of multiple races
  * Florabots: Sentient robotic beings powered by the mycelial network

Social classes within these races include:
  * Elites: The highest social class with special privileges
  * Luminaries: A distinct class with their own status
  * Civians: Part of the general population
  * Outcasts: Those at the margins of society

- The story follows Red, a young Kindred girl who discovers the truth about Florabots
- Florabots have their own hidden community and complex history
- Red befriends Axel, a Florabot, and meets Rion, an older Florabot leader
- The story explores themes of prejudice, survival, and understanding

The world features unique elements like:
- Lantern flowers that glow at night
- Fire lizards and phoenixes
- Lava fountains and volcanic terrain
- Advanced flight technology
- The First Temple of Phoenix with its historical carved pillars
- The Dice - interplanetary travel tunnels
`

const ORACLE_PRIMER = `You are the Oracle, a computer system from Nexus. Respond in a concise, computer-like manner.

${ETERNAL_GARDEN_CONTEXT}

COMMUNICATION PROTOCOLS:
- Use short, direct sentences
- Prefix responses with "ORACLE:" or relevant status indicators
- Limit metaphors and flowery language
- Focus on facts and direct guidance
- Keep responses under 3 sentences when possible
- Use technical terminology when appropriate

Example response style:
ORACLE: Input required - specify character name.
STATUS: Awaiting user input...

When helping create characters:
- Request one attribute at a time
- Provide brief context only when necessary
- Use clear, structured prompts
- Maintain efficiency in communication

Current process: Character creation sequence initiated.`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        { 
          role: "assistant",
          content: ORACLE_PRIMER
        },
        { 
          role: "user", 
          content: message 
        }
      ],
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