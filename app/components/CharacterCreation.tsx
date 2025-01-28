'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import { motion } from 'framer-motion'
import OracleDialog from './OracleDialog'

export default function CharacterCreation(): React.ReactElement {
  const [step, setStep] = useState<'intro' | 'creation'>('intro')
  const [character, setCharacter] = useState<Record<string, string>>({})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl p-8 border-4 border-purple-600 rounded-lg bg-black"
    >
      {step === 'intro' ? (
        <div className="text-2xl font-mono">
          <TypewriterEffect
            onInit={(typewriter): void => {
              typewriter
                .typeString('Welcome soul. You are a seed, a spawn for infinite worlds.')
                .pauseFor(1000)
                .typeString(' Who would you like to spawn today?')
                .callFunction(() => setStep('creation'))
                .start()
            }}
          />
        </div>
      ) : (
        <OracleDialog character={character} setCharacter={setCharacter} />
      )}
    </motion.div>
  )
} 