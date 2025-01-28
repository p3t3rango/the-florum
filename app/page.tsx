'use client'

import React, { useState } from 'react'
import TypewriterEffect from 'typewriter-effect'
import { motion } from 'framer-motion'
import CharacterCreation from './components/CharacterCreation'

export default function Home(): React.ReactElement {
  const [stage, setStage] = useState<'intro' | 'access' | 'oracle'>('intro')

  const typewriterOptions = {
    cursor: '_',
    delay: 50,
    wrapperClassName: 'whitespace-pre-line font-tech-mono text-[#00ff00]'
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Terminal Container */}
      <div className="absolute inset-4 md:inset-10 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-black border-2 border-[#00ff00] rounded-lg 
        shadow-[0_0_20px_rgba(0,255,0,0.3)] overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-[#00ff00] text-black px-4 py-2 font-tech-mono text-sm flex justify-between items-center">
            <span>NEXUS TERMINAL v1.0</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>

          {/* Terminal Content */}
          <div className="h-[80vh] relative">
            {stage === 'intro' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="text-center space-y-8">
                  <h1 className="text-5xl font-tech-mono text-[#00ff00] leading-relaxed">
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
                      options={typewriterOptions}
                    />
                  </h1>
                </div>
              </motion.div>
            ) : stage === 'access' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="text-center">
                  <h2 className="text-5xl font-tech-mono text-[#00ff00] leading-relaxed">
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
                      options={typewriterOptions}
                    />
                  </h2>
                </div>
              </motion.div>
            ) : (
              <CharacterCreation />
            )}

            {/* Scanline Effect */}
            <div className="scanline" />
          </div>
        </div>
      </div>
    </div>
  )
} 