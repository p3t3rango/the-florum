'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import { motion } from 'framer-motion'
import CharacterCreation from './components/CharacterCreation'

export default function Home(): React.ReactElement {
  const [stage, setStage] = useState<'intro' | 'access' | 'oracle'>('intro')

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-4xl h-[80vh] relative">
        {stage === 'intro' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full border-2 border-[#00ff00] rounded-lg bg-black/90 
            backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,0,0.3)] terminal-window
            flex items-center justify-center"
          >
            <div className="text-center space-y-8 p-8">
              <h1 className="text-6xl font-tech-mono text-[#00ff00] leading-relaxed">
                <TypewriterEffect
                  onInit={(typewriter): void => {
                    typewriter
                      .typeString('NEXUS OS v1.0\n\n')
                      .pauseFor(500)
                      .typeString('SIGNAL DETECTED\n')
                      .pauseFor(1000)
                      .typeString('INITIALIZING SEED SOURCE CODE\n')
                      .pauseFor(500)
                      .typeString('LOADING...')
                      .pauseFor(1500)
                      .callFunction(() => setStage('access'))
                      .start()
                  }}
                  options={{
                    cursor: '_',
                    delay: 50,
                    wrapperClassName: 'whitespace-pre-line'
                  }}
                />
              </h1>
            </div>
          </motion.div>
        ) : stage === 'access' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full border-2 border-[#00ff00] rounded-lg bg-black/90 
            backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,0,0.3)] terminal-window
            flex items-center justify-center"
          >
            <div className="text-center p-8">
              <h2 className="text-6xl font-tech-mono text-[#00ff00] leading-relaxed">
                <TypewriterEffect
                  onInit={(typewriter): void => {
                    typewriter
                      .typeString('ACCESS GRANTED\n\n')
                      .pauseFor(500)
                      .typeString('INITIALIZING ORACLE INTERFACE...')
                      .pauseFor(1000)
                      .callFunction(() => setStage('oracle'))
                      .start()
                  }}
                  options={{
                    cursor: '_',
                    delay: 50,
                    wrapperClassName: 'whitespace-pre-line'
                  }}
                />
              </h2>
            </div>
          </motion.div>
        ) : (
          <CharacterCreation />
        )}
      </div>
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#00ff00] opacity-[0.03]" />
      </div>
    </main>
  )
} 