'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import { motion } from 'framer-motion'
import CharacterCreation from './components/CharacterCreation'

export default function Home(): React.ReactElement {
  const [stage, setStage] = useState<'intro' | 'oracle'>('intro')

  return (
    <main className="min-h-screen bg-black text-green-500 flex items-center justify-center">
      {stage === 'intro' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-4xl font-mono"
        >
          <TypewriterEffect
            onInit={(typewriter): void => {
              typewriter
                .typeString('The Florum')
                .pauseFor(2500)
                .callFunction(() => setStage('oracle'))
                .start()
            }}
          />
        </motion.div>
      ) : (
        <CharacterCreation />
      )}
    </main>
  )
} 