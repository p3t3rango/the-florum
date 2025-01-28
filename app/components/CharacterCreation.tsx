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
      className="h-full flex flex-col"
    >
      {step === 'intro' ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-2xl font-tech-mono text-[#00ff00]">
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
        </div>
      ) : (
        <div className="flex-1 p-8">
          <OracleDialog character={character} setCharacter={setCharacter} />
        </div>
      )}
    </motion.div>
  )
} 