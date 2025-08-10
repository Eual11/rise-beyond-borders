"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Play, RefreshCw } from "lucide-react"

export default function PixelRevealHero() {
  const [revealedSquares, setRevealedSquares] = useState<number[]>([])
  const [currentPattern, setCurrentPattern] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Grid configuration - Much sparser and bigger
  const GRID_COLS = 10
  const GRID_ROWS = 6
  const TOTAL_SQUARES = GRID_COLS * GRID_ROWS

  // Different reveal patterns
  const revealPatterns = [
    "random", // Random squares
  ]

const squareImages = [
  "https://placebear.com/200/200",
  "https://picsum.photos/200/200?random=1",
  "https://placebear.com/201/200",
  "https://picsum.photos/200/201?random=2",
  "https://placebear.com/202/200",
  "https://picsum.photos/201/200?random=3",
  "https://placebear.com/203/200",
  "https://picsum.photos/200/202?random=4",
  "https://placebear.com/204/200",
  "https://picsum.photos/202/200?random=5",
  "https://placebear.com/205/200",
  "https://picsum.photos/200/203?random=6"
]

  const heroTexts = [
    {
      main: "RISE BEYOND",
      sub: "BORDERS",
      description: "Empowering refugee youth through creative expression and shared opportunity",
    },
    {
      main: "CREATE",
      sub: "TOGETHER",
      description: "Building bridges between refugee and host communities through art",
    },
    {
      main: "DREAM",
      sub: "BIGGER",
      description: "Transforming lives through education, healing, and inclusive opportunity",
    },
    {
      main: "UNITE",
      sub: "VOICES",
      description: "Amplifying stories that inspire change and build resilience",
    },
    {
      main: "INSPIRE",
      sub: "CHANGE",
      description: "Youth-led solutions creating sustainable impact across Ethiopia",
    },
    {
      main: "HOPE",
      sub: "RISES",
      description: "From displacement to empowerment, every story matters",
    },
  ]

  // Generate squares with different content
  const generateSquares = () => {
    const gradients = [
      "from-purple-600/80 to-purple-900/80",
      "from-pink-600/80 to-pink-900/80",
      "from-orange-600/80 to-orange-900/80",
      "from-yellow-600/80 to-yellow-900/80",
      "from-green-600/80 to-green-900/80",
      "from-blue-600/80 to-blue-900/80",
      "from-indigo-600/80 to-indigo-900/80",
      "from-red-600/80 to-red-900/80",
      "from-teal-600/80 to-teal-900/80",
      "from-cyan-600/80 to-cyan-900/80",
    ]

    return Array.from({ length: TOTAL_SQUARES }, (_, index) => ({
      id: index,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      image: squareImages[Math.floor(Math.random() * squareImages.length)],
      row: Math.floor(index / GRID_COLS),
      col: index % GRID_COLS,
      content: Math.random() > 0.5 ? "image" : "gradient", // 50/50 split
    }))
  }

  const [squares] = useState(generateSquares())

  // Different reveal pattern functions
  const getRevealOrder = (pattern: string) => {
    const indices = Array.from({ length: TOTAL_SQUARES }, (_, i) => i)

    switch (pattern) {
      case "wave":
        return indices.sort((a, b) => {
          const colA = a % GRID_COLS
          const colB = b % GRID_COLS
          const rowA = Math.floor(a / GRID_COLS)
          const rowB = Math.floor(b / GRID_COLS)
          return colA - colB || Math.abs(rowA - GRID_ROWS / 2) - Math.abs(rowB - GRID_ROWS / 2)
        })

      case "center":
        const centerRow = GRID_ROWS / 2
        const centerCol = GRID_COLS / 2
        return indices.sort((a, b) => {
          const rowA = Math.floor(a / GRID_COLS)
          const colA = a % GRID_COLS
          const rowB = Math.floor(b / GRID_COLS)
          const colB = b % GRID_COLS
          const distA = Math.sqrt(Math.pow(rowA - centerRow, 2) + Math.pow(colA - centerCol, 2))
          const distB = Math.sqrt(Math.pow(rowB - centerRow, 2) + Math.pow(colB - centerCol, 2))
          return distA - distB
        })

      case "random":
        return indices.sort(() => Math.random() - 0.5)

      case "spiral":
        const spiral: number[] = []
        let top = 0,
          bottom = GRID_ROWS - 1,
          left = 0,
          right = GRID_COLS - 1

        while (top <= bottom && left <= right) {
          for (let col = left; col <= right; col++) {
            spiral.push(top * GRID_COLS + col)
          }
          top++

          for (let row = top; row <= bottom; row++) {
            spiral.push(row * GRID_COLS + right)
          }
          right--

          if (top <= bottom) {
            for (let col = right; col >= left; col--) {
              spiral.push(bottom * GRID_COLS + col)
            }
            bottom--
          }

          if (left <= right) {
            for (let row = bottom; row >= top; row--) {
              spiral.push(row * GRID_COLS + left)
            }
            left++
          }
        }
        return spiral

      case "diagonal":
        return indices.sort((a, b) => {
          const rowA = Math.floor(a / GRID_COLS)
          const colA = a % GRID_COLS
          const rowB = Math.floor(b / GRID_COLS)
          const colB = b % GRID_COLS
          return rowA + colA - (rowB + colB)
        })

      case "explosion":
        const explosionPoints = [
          { row: 1, col: 2 },
          { row: 4, col: 7 },
          { row: 2, col: 5 },
        ]
        return indices.sort((a, b) => {
          const rowA = Math.floor(a / GRID_COLS)
          const colA = a % GRID_COLS
          const rowB = Math.floor(b / GRID_COLS)
          const colB = b % GRID_COLS

          const minDistA = Math.min(
            ...explosionPoints.map((point) => Math.sqrt(Math.pow(rowA - point.row, 2) + Math.pow(colA - point.col, 2))),
          )
          const minDistB = Math.min(
            ...explosionPoints.map((point) => Math.sqrt(Math.pow(rowB - point.row, 2) + Math.pow(colB - point.col, 2))),
          )
          return minDistA - minDistB
        })

      default:
        return indices
    }
  }

  const startReveal = (patternIndex: number) => {
    if (isAnimating) return

    setIsAnimating(true)
    setIsComplete(false)
    setCurrentPattern(patternIndex)

    const pattern = revealPatterns[patternIndex]
    const revealOrder = getRevealOrder(pattern)

    // Staggered reveal animation - squares appear and stay
    revealOrder.forEach((squareIndex, orderIndex) => {
      setTimeout(() => {
        setRevealedSquares((prev) => {
          if (!prev.includes(squareIndex)) {
            return [...prev, squareIndex]
          }
          return prev
        })

        // End animation when all squares are revealed
        if (orderIndex === revealOrder.length - 1) {
          setTimeout(() => {
            setIsAnimating(false)
            setIsComplete(true)
          }, 500)
        }
      }, orderIndex * 150) // 150ms delay between each square for more dramatic effect
    })
  }

  const resetSquares = () => {
    setRevealedSquares([])
    setIsAnimating(false)
    setIsComplete(false)
  }

  // Auto-cycle through patterns
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && isComplete) {
        setTimeout(() => {
          resetSquares()
          setTimeout(() => {
            const nextPattern = currentPattern
            startReveal(nextPattern)
          }, 1500)
        }, 3000)
      }
    }, 12000) // Wait 12 seconds after completion

    return () => clearInterval(interval)
  }, [currentPattern, isAnimating, isComplete])

  // Start first animation on mount
  useEffect(() => {
    setTimeout(() => startReveal(0), 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 relative overflow-hidden">
      {/* Background Pixel Grid - Behind everything */}
      <div className="absolute inset-0 z-0">
        <div
          className="grid gap-4 w-full h-full p-8"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {squares.map((square) => {
            const isRevealed = revealedSquares.includes(square.id)
            return (
              <div
                key={square.id}
                className={`transition-all duration-700 transform ${
                  isRevealed ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 rotate-12"
                }`}
                style={{
                  transitionDelay: isRevealed ? `${revealedSquares.indexOf(square.id) * 50}ms` : "0ms",
                }}
              >
                {square.content === "image" ? (
                  <div className="w-full h-full relative overflow-hidden rounded-xl shadow-2xl group">
                    <img
                      src={square.image || "/placeholder.svg"}
                      alt={`Background square ${square.id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br opacity-0 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500 backdrop-blur-sm`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-1 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>


    </div>
  )
}
