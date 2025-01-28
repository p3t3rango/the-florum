'use client'

import React, { useState, useRef, useEffect } from 'react'
import TypewriterEffect from 'typewriter-effect'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import ProgressIndicator from './ProgressIndicator'

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

interface Race {
  id: string
  name: string
  description: string
  icon?: string // We can add icons later
}

const CHARACTER_ATTRIBUTES = [
  'name', 'role', 'otherNames', 'personality', 'mannerisms', 'motivations',
  'flaws', 'prejudices', 'talents', 'hobbies', 'gender', 'age', 'weight',
  'height', 'hairColor', 'hairStyle', 'facialHair', 'eyeColor', 'race',
  'skinTone', 'bodyType', 'marks'
]

const RACES = [
  {
    id: 'kindred',
    name: 'Kindred',
    description: 'Fire-attuned beings with charcoal skin and glowing red eyes'
  },
  {
    id: 'arcadian',
    name: 'Arcadian',
    description: 'Ancient race with deep connections to the Eternal Garden'
  },
  {
    id: 'paragon',
    name: 'Paragon',
    description: 'Highly evolved beings with advanced abilities'
  },
  {
    id: 'verdan',
    name: 'Verdan',
    description: 'Nature-attuned beings with organic technologies'
  },
  {
    id: 'aquatic',
    name: 'Aquatic',
    description: 'Water-adapted beings with fluid-based technologies'
  },
  {
    id: 'lithian',
    name: 'Lithian',
    description: 'Stone-based beings with crystalline properties'
  },
  {
    id: 'solaris',
    name: 'Solaris',
    description: 'Light-based entities with solar affinities'
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    description: 'Beings who can manipulate color and light'
  },
  {
    id: 'cybernetic',
    name: 'Cybernetic',
    description: 'Technologically augmented beings'
  },
  {
    id: 'convergent',
    name: 'Convergent',
    description: 'Hybrid beings of multiple races'
  },
  {
    id: 'florabot',
    name: 'Florabot',
    description: 'Sentient robotic beings powered by the mycelial network'
  }
]

// Add more predefined options
const CHARACTER_OPTIONS = {
  role: [
    { id: 'warrior', name: 'Warrior', description: 'Combat specialist and protector' },
    { id: 'mystic', name: 'Mystic', description: 'Master of ancient knowledge and energy' },
    { id: 'technomancer', name: 'Technomancer', description: 'Blends technology with mystical arts' },
    { id: 'scout', name: 'Scout', description: 'Expert in exploration and survival' },
    { id: 'diplomat', name: 'Diplomat', description: 'Skilled negotiator and mediator' },
    { id: 'engineer', name: 'Engineer', description: 'Creator of advanced technology' }
  ],
  gender: [
    { id: 'male', name: 'Male', description: 'Masculine identity' },
    { id: 'female', name: 'Female', description: 'Feminine identity' },
    { id: 'nonbinary', name: 'Non-Binary', description: 'Beyond the binary spectrum' },
    { id: 'fluid', name: 'Fluid', description: 'Dynamic and changing identity' },
    { id: 'other', name: 'Other', description: 'Custom gender identity' }
  ],
  bodyType: [
    { id: 'athletic', name: 'Athletic', description: 'Well-trained and agile' },
    { id: 'sturdy', name: 'Sturdy', description: 'Strong and durable' },
    { id: 'slender', name: 'Slender', description: 'Light and quick' },
    { id: 'massive', name: 'Massive', description: 'Imposing and powerful' },
    { id: 'average', name: 'Average', description: 'Balanced build' }
  ]
}

// Add a helper function to determine if an attribute has predefined options
const hasPresetOptions = (attribute: string): boolean => {
  return attribute === 'race' || Object.keys(CHARACTER_OPTIONS).includes(attribute)
}

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

  const renderRaceSelection = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-tech-mono text-[#00ff00] mb-4">Select your character's race:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RACES.map((race) => (
          <motion.button
            key={race.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCharacter({ ...character, race: race.name })
              setCurrentAttribute(currentAttribute + 1)
            }}
            className="p-4 border-2 border-[#00ff00] rounded-lg bg-black/50 
            hover:bg-[#00ff00]/10 transition-colors text-left group"
          >
            <h4 className="text-lg font-tech-mono text-[#00ff00] group-hover:text-[#00ff00]">
              {race.name}
            </h4>
            <p className="text-sm text-[#00ff00]/70 mt-1">
              {race.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )

  const renderCurrentPrompt = () => {
    const attribute = CHARACTER_ATTRIBUTES[currentAttribute]
    
    if (hasPresetOptions(attribute)) {
      return renderOptionSelection(attribute)
    }

    return renderTextInput(attribute)
  }

  // New component for option selection
  const renderOptionSelection = (attribute: string) => {
    const options = attribute === 'race' ? RACES : CHARACTER_OPTIONS[attribute]
    
    return (
      <div className="space-y-4">
        {/* Grid with single column on mobile, two columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCharacter({ ...character, [attribute]: option.name })
                setCurrentAttribute(currentAttribute + 1)
              }}
              className="group relative p-3 md:p-4 border-2 border-[#00ff00]/50 rounded-lg 
              bg-black/50 backdrop-blur-sm overflow-hidden transition-colors
              hover:border-[#00ff00] focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50"
            >
              {/* Hover effect background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00ff00]/0 via-[#00ff00]/5 to-[#00ff00]/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-tech-mono text-[#00ff00] group-hover:text-[#00ff00]">
                  {option.name}
                </h4>
                <p className="text-xs md:text-sm text-[#00ff00]/70 mt-1 group-hover:text-[#00ff00]/90">
                  {option.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Updated text input component
  const renderTextInput = (attribute: string) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-tech-mono text-[#00ff00]">
          <TypewriterEffect
            onInit={(typewriter): void => {
              typewriter.typeString(`Enter your character's ${attribute}:`).start()
            }}
            options={{
              cursor: '_',
              delay: 30,
            }}
          />
        </div>
        <span className="text-sm text-[#00ff00]/70">
          {currentAttribute + 1}/{CHARACTER_ATTRIBUTES.length}
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e): void => setUserInput(e.target.value)}
            className="w-full bg-black/50 border-2 border-[#00ff00] text-[#00ff00] p-4 rounded-lg 
            font-tech-mono text-lg focus:outline-none focus:border-[#00ff00]/80 transition-colors
            pr-24" // Added padding for the button
            placeholder={`Enter ${attribute}...`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 
            bg-[#00ff00] text-black font-tech-mono text-sm rounded
            hover:bg-[#00ff00]/80 transition-colors disabled:opacity-50
            focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <ProgressIndicator 
        currentStep={currentAttribute + 1}
        totalSteps={CHARACTER_ATTRIBUTES.length}
        attribute={CHARACTER_ATTRIBUTES[currentAttribute]}
      />

      <div className="flex-1 overflow-hidden flex flex-col pt-12 md:pt-14"> {/* Account for fixed header */}
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 md:py-6 space-y-3 md:space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-3xl mx-auto ${
                message.role === 'oracle' ? 'ml-0' : 'ml-auto'
              }`}
            >
              <div className={`p-3 md:p-4 rounded-lg border backdrop-blur-sm ${
                message.role === 'oracle'
                  ? 'bg-[#00ff00]/5 border-[#00ff00]/30 rounded-tr-2xl md:rounded-tr-3xl'
                  : 'bg-[#00ff00]/10 border-[#00ff00]/50 rounded-tl-2xl md:rounded-tl-3xl'
              }`}>
                {message.role === 'oracle' ? (
                  <TypewriterEffect
                    onInit={(typewriter): void => {
                      typewriter.typeString(message.content).start()
                    }}
                    options={{
                      cursor: '_',
                      delay: 30,
                      wrapperClassName: 'font-tech-mono text-[#00ff00] text-sm md:text-base'
                    }}
                  />
                ) : (
                  <div className="font-tech-mono text-[#00ff00] text-sm md:text-base">
                    {message.content}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#00ff00]/30 bg-black/90 backdrop-blur-sm p-3 md:p-4">
          <div className="max-w-3xl mx-auto">
            {renderCurrentPrompt()}
          </div>
        </div>
      </div>
    </div>
  )
} 