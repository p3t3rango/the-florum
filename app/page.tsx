'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import { motion } from 'framer-motion'
import CharacterCreation from './components/CharacterCreation'

export default function Home(): React.ReactElement {
  const [stage, setStage] = useState<'intro' | 'access' | 'oracle'>('intro')

  return (
    <main className="min-h-screen bg-black text-purple-500 flex items-center justify-center p-4">
      {stage === 'intro' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-press-start mb-8 text-purple-500 glow">
            <TypewriterEffect
              onInit={(typewriter): void => {
                typewriter
                  .typeString('Signal detected.')
                  .pauseFor(1000)
                  .typeString('<br>You\'re "seed" source code<br>for infinite worlds<br>loading...')
                  .pauseFor(1500)
                  .callFunction(() => setStage('access'))
                  .start()
              }}
              options={{
                cursor: '_',
                delay: 50,
              }}
            />
          </h1>
        </motion.div>
      ) : stage === 'access' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-press-start text-red-500 mb-8">
            <TypewriterEffect
              onInit={(typewriter): void => {
                typewriter
                  .typeString('Access granted.')
                  .pauseFor(1000)
                  .callFunction(() => setStage('oracle'))
                  .start()
              }}
              options={{
                cursor: '_',
                delay: 50,
              }}
            />
          </h2>
        </motion.div>
      ) : (
        <CharacterCreation />
      )}
    </main>
  )
} 