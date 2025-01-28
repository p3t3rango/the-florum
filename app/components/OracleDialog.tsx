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
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 font-tech-mono text-lg">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border ${
              message.role === 'oracle'
                ? 'bg-[#00ff00]/10 border-[#00ff00] ml-4'
                : 'bg-[#00ff00]/5 border-[#00ff00]/50 mr-4'
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
              <div className="text-[#00ff00]">{message.content}</div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 mt-auto border-t border-[#00ff00]/30">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e): void => setUserInput(e.target.value)}
            className="w-full bg-black/50 border-2 border-[#00ff00] text-[#00ff00] p-3 pr-20 rounded-lg 
            font-tech-mono text-lg focus:outline-none focus:border-[#00ff00]/80 transition-colors"
            placeholder="Type your answer..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#00ff00] text-black 
            font-tech-mono text-sm rounded hover:bg-[#00ff00]/80 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
} 