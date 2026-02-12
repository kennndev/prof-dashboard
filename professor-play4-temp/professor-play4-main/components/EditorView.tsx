'use client'

import { ChevronLeft, ChevronRight, Minus, Plus, Image, Trash2 } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useEffect, useRef } from 'react'

export default function EditorView() {
  const {
    currentStep,
    deck,
    currentCardIndex,
    setCurrentCardIndex,
    globalBack,
    setDeck,
  } = useApp()

  const currentCard = currentStep === 2 ? null : deck[currentCardIndex]
  const imageToShow = currentStep === 2 ? globalBack.processed : currentCard?.front
  const cutLineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Update cut line overlay based on bleed settings (matching HTML logic exactly)
  useEffect(() => {
    const cutLine = cutLineRef.current
    const canvas = canvasRef.current
    if (!cutLine || !canvas) return

    const target = currentStep === 2 ? globalBack : currentCard
    if (!target) {
      cutLine.classList.add('hidden')
      // Reset aspect ratio when no target (default card size)
      canvas.style.aspectRatio = '63 / 88'
      // Ensure canvas is visible
      canvas.style.display = ''
      canvas.style.visibility = 'visible'
      return
    }

    // Standard TCG Dimensions
    const baseW = 63
    const baseH = 88

    // Calculate total canvas size in "units" (base + bleed)
    // For positive bleed: canvas expands outward
    // For negative bleed (cropping): canvas stays at base size (we're zooming/cropping the image)
    const rawBleed = target.hasBleed ? (target.bleedMm !== undefined ? target.bleedMm : 1.9) : 0
    const activeBleed = Math.max(0, rawBleed) // Canvas only expands, never shrinks below base size

    const totalW = baseW + (2 * activeBleed)
    const totalH = baseH + (2 * activeBleed)

    // Update canvas aspect ratio to expand when bleed is enabled
    canvas.style.aspectRatio = `${totalW} / ${totalH}`
    // Ensure canvas is visible
    canvas.style.display = ''
    canvas.style.visibility = 'visible'

    // Calculate cut line position (63x88mm boundary)
    const cutInsetX = (activeBleed / totalW) * 100
    const cutInsetY = (activeBleed / totalH) * 100

    cutLine.style.left = `${cutInsetX}%`
    cutLine.style.right = `${cutInsetX}%`
    cutLine.style.top = `${cutInsetY}%`
    cutLine.style.bottom = `${cutInsetY}%`

    // Show cut line when bleed is enabled
    if (target.hasBleed) {
      cutLine.classList.remove('hidden')
    } else {
      cutLine.classList.add('hidden')
    }
  }, [currentStep, currentCardIndex, currentCard?.bleedMm, currentCard?.hasBleed, globalBack.bleedMm, globalBack.hasBleed])

  const nextCard = () => {
    if (deck.length === 0) return
    setCurrentCardIndex((currentCardIndex + 1) % deck.length)
  }

  const prevCard = () => {
    if (deck.length === 0) return
    setCurrentCardIndex((currentCardIndex - 1 + deck.length) % deck.length)
  }

  const updateQuantity = (change: number) => {
    if (currentCardIndex < 0 || !deck[currentCardIndex]) return
    const card = deck[currentCardIndex]
    const newQty = (card.quantity || 1) + change
    if (newQty >= 1) {
      setDeck(prev => {
        const newDeck = [...prev]
        newDeck[currentCardIndex] = { ...newDeck[currentCardIndex], quantity: newQty }
        return newDeck
      })
    }
  }

  return (
    <div className="flex-grow bg-slate-100 dark:bg-slate-950 canvas-area p-2 sm:p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 sm:px-3 py-1 sm:py-1.5 rounded shadow text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 z-10 flex gap-1.5 sm:gap-2">
        <span>Canvas: 2.5" x 3.5"</span>
        {currentStep === 2 && (
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 rounded-sm font-bold">
            Common Back
          </span>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full">
        {deck.length > 0 && currentStep === 1 && (
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 z-10">
            <button
              onClick={prevCard}
              className="bg-white dark:bg-slate-800 p-2 sm:p-2 rounded-full shadow hover:bg-blue-50 dark:hover:bg-slate-700 active:bg-blue-100 dark:active:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Previous Card"
              aria-label="Previous Card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-800 rounded-full shadow pl-3 sm:pl-4 pr-1.5 sm:pr-2 py-1.5 transition-colors">
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 min-w-[35px] sm:min-w-[40px] text-center">
                {currentCardIndex + 1} / {deck.length}
              </span>
              <div className="w-px h-3 sm:h-4 bg-slate-200 dark:bg-slate-600"></div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={() => updateQuantity(-1)}
                  className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors touch-manipulation"
                  title="Decrease Quantity"
                  aria-label="Decrease Quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">x</span>
                  <input
                    type="number"
                    min="1"
                    value={currentCard?.quantity || 1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10)
                      if (!isNaN(value) && value >= 1) {
                        setDeck(prev => {
                          const newDeck = [...prev]
                          newDeck[currentCardIndex] = { ...newDeck[currentCardIndex], quantity: value }
                          return newDeck
                        })
                      }
                    }}
                    className="w-10 sm:w-12 text-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    title="Card Quantity"
                    aria-label="Card Quantity"
                  />
                </div>
                <button
                  onClick={() => updateQuantity(1)}
                  className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors touch-manipulation"
                  title="Increase Quantity"
                  aria-label="Increase Quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={nextCard}
              className="bg-white dark:bg-slate-800 p-2 sm:p-2 rounded-full shadow hover:bg-blue-50 dark:hover:bg-slate-700 active:bg-blue-100 dark:active:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Next Card"
              aria-label="Next Card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div
          ref={canvasRef}
          id="card-canvas"
          className="h-[280px] sm:h-[350px] md:h-[420px] w-auto max-w-[90vw] sm:max-w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl relative border border-slate-200 dark:border-slate-700 transition-all duration-200 transform origin-center"
        >
          <div
            ref={cutLineRef}
            id="cut-line"
            className="absolute border-2 border-cyan-500 border-dotted pointer-events-none z-40 hidden opacity-90"
          >
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-cyan-600 dark:text-cyan-400 font-bold font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow border border-cyan-100 dark:border-cyan-900 whitespace-nowrap">
              Cut Line (63x88mm)
            </span>
          </div>

          <div className="w-full h-full rounded-lg overflow-hidden relative bg-white dark:bg-slate-800 group">
            {imageToShow ? (
              <img
                key={`${currentStep}-${currentCardIndex}-${currentCard?.trimMm}-${currentCard?.bleedMm}-${currentCard?.hasBleed}-${globalBack.trimMm}-${globalBack.bleedMm}-${globalBack.hasBleed}`}
                src={imageToShow}
                alt="Card"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 p-8 text-center group">
                <Image className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm font-medium">
                  {currentStep === 2 ? 'No Back Selected' : 'No Image Selected'}
                </p>
                <p className="text-xs opacity-75 mt-1">Upload an image to start</p>
              </div>
            )}
          </div>
        </div>

        {currentCard && currentStep === 1 && (
          <div className="mt-4 sm:mt-6 flex justify-center gap-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Are you sure you want to delete this card?')) {
                  // Adjust index if we're deleting the last card
                  if (currentCardIndex === deck.length - 1) {
                    setCurrentCardIndex(Math.max(0, currentCardIndex - 1))
                  }

                  // Remove card from deck
                  setDeck(prev => prev.filter((_, i) => i !== currentCardIndex))
                }
              }}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-colors border border-red-700/20 touch-manipulation min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

