'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import { motion } from 'framer-motion'
import OracleDialog from './OracleDialog'

export default function CharacterCreation(): React.ReactElement {
  const [step, setStep] = useState<'intro' | 'creation'>('intro')
  const [character, setCharacter] = useState<Record<string, string>>({})

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-4xl h-screen p-6 border-2 border-[#00ff00] rounded-lg bg-black/90 
        backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,0,0.3)] terminal-window"
      >
        {step === 'intro' ? (
          <div className="text-2xl font-vt323">
            <TypewriterEffect
              onInit={(typewriter): void => {
                typewriter
                  .typeString('What character would you like to spawn today?')
                  .callFunction(() => setStep('creation'))
                  .start()
              }}
              options={{
                cursor: '_',
                delay: 30,
              }}
            />
          </div>
        ) : (
          <OracleDialog character={character} setCharacter={setCharacter} />
        )}
      </motion.div>
    </div>
  )
} 