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
      className="w-full max-w-2xl p-8 border-2 border-purple-600 rounded-lg bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.5)]"
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
  )
} 