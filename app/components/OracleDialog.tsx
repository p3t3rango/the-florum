'use client'

import React, { useState, useRef, useEffect } from 'react'
import TypewriterEffect from 'typewriter-effect'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Message {
  role: 'oracle' | 'user'
  content: string
}

interface Character {
  [key: string]: string
}

interface Props {
  character: Character
  setCharacter: (character: Character) => void
}

const CHARACTER_ATTRIBUTES = [
  'name', 'role', 'otherNames', 'personality', 'mannerisms', 'motivations',
  'flaws', 'prejudices', 'talents', 'hobbies', 'gender', 'age', 'weight',
  'height', 'hairColor', 'hairStyle', 'facialHair', 'eyeColor', 'race',
  'skinTone', 'bodyType', 'marks'
]

export default function OracleDialog({ character, setCharacter }: Props): React.ReactElement {
  const [currentAttribute, setCurrentAttribute] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'oracle', content: 'Tell me about your character...' }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getCurrentPrompt = () => {
    const attribute = CHARACTER_ATTRIBUTES[currentAttribute]
    return `As The Oracle, guide the user in creating their character's ${attribute}. Consider their previous answers: ${JSON.stringify(character)}`
  }

  const getOracleGuidance = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: getCurrentPrompt() })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'oracle', content: data.response }])
    } catch (error) {
      toast.error('Failed to get Oracle guidance')
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!userInput.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: userInput }])
    
    try {
      const currentKey = CHARACTER_ATTRIBUTES[currentAttribute]
      setCharacter({ ...character, [currentKey]: userInput })
      setUserInput('')

      if (currentAttribute < CHARACTER_ATTRIBUTES.length - 1) {
        setCurrentAttribute(prev => prev + 1)
        await getOracleGuidance()
      } else {
        handleCharacterComplete()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCharacterComplete = async () => {
    const imagePrompt = `Create a detailed character portrait: ${Object.entries(character)
      .map(([key, value]) => `${key}: ${value}`).join(', ')}`
    
    try {
      // Generate image
      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      })
      const imageData = await imageResponse.json()
      
      // Save character to database
      const characterData = {
        ...character,
        imageUrl: imageData.imageUrl,
        isPublic: false // default to private
      }
      
      const saveResponse = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData)
      })
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save character')
      }
      
      toast.success('Character created successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to complete character creation')
    }
  }

  return (
    <div className="space-y-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 font-vt323 text-xl p-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              message.role === 'oracle'
                ? 'bg-purple-900/20 border-purple-500 ml-4'
                : 'bg-red-900/20 border-red-500 mr-4'
            }`}
          >
            {message.role === 'oracle' ? (
              <TypewriterEffect
                onInit={(typewriter): void => {
                  typewriter.typeString(message.content).start()
                }}
                options={{
                  cursor: '_',
                  delay: 30,
                }}
              />
            ) : (
              <div>{message.content}</div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-auto p-4">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e): void => setUserInput(e.target.value)}
            className="w-full bg-black/50 border-2 border-purple-500 text-purple-300 p-4 pr-24 rounded-lg font-vt323 text-xl focus:outline-none focus:border-red-500 transition-colors"
            placeholder="Type your answer..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-500 text-black font-press-start text-sm rounded hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
} 