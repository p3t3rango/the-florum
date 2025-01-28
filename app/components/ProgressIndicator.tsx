'use client'

import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  attribute: string
}

export default function ProgressIndicator({ currentStep, totalSteps, attribute }: ProgressIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 border-b border-[#00ff00]/30 backdrop-blur-sm z-50">
      <div className="max-w-5xl mx-auto px-3 py-2 md:px-4 md:py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-[#00ff00]/70 font-tech-mono text-xs md:text-sm">
            {currentStep}/{totalSteps}
          </span>
          <div className="hidden sm:block w-32 md:w-64 h-1 bg-[#00ff00]/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00ff00]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-[#00ff00] font-tech-mono text-xs md:text-sm truncate ml-2">
          Creating: {attribute}
        </span>
      </div>
    </div>
  )
} 