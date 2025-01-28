import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) 