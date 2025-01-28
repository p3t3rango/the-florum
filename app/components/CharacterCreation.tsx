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
        className="w-full h-full border-2 border-[#00ff00] rounded-lg bg-black/90 
        backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,0,0.3)] terminal-window
        flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'intro' ? (
            <div className="text-2xl font-tech-mono text-[#00ff00] h-full flex items-center justify-center">
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
        </div>
      </motion.div>
    </div>
  )
} 