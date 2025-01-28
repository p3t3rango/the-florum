'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import toast from 'react-hot-toast'

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
  const [oracleResponse, setOracleResponse] = useState('')

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
      setOracleResponse(data.response)
    } catch (error) {
      toast.error('Failed to get Oracle guidance')
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const currentKey = CHARACTER_ATTRIBUTES[currentAttribute]
      setCharacter({ ...character, [currentKey]: userInput })
      setUserInput('')

      if (currentAttribute < CHARACTER_ATTRIBUTES.length - 1) {
        setCurrentAttribute(prev => prev + 1)
        await getOracleGuidance()
      } else {
        // Character complete - proceed to image generation
        handleCharacterComplete()
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
    }
  }

  const handleCharacterComplete = async () => {
    const imagePrompt = `Create a detailed character portrait: ${Object.entries(character)
      .map(([key, value]) => `${key}: ${value}`).join(', ')}`
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      })
      const data = await response.json()
      setCharacter(prev => ({ ...prev, imageUrl: data.imageUrl }))
    } catch (error) {
      toast.error('Failed to generate character image')
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xl font-mono">
        <TypewriterEffect
          onInit={(typewriter): void => {
            typewriter
              .typeString(oracleResponse || 'Tell me about your character...')
              .start()
          }}
        />
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={userInput}
          onChange={(e): void => setUserInput(e.target.value)}
          className="w-full bg-black border-2 border-green-500 text-green-500 p-2 rounded"
          placeholder="Type your answer..."
          disabled={isLoading}
        />
      </form>
    </div>
  )
} 