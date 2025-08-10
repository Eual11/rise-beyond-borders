
import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Users, Heart } from 'lucide-react';

const Hero = () => {

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
    "../../public/images/20240610090228_IMG_2642.JPG",
    "../../public/images/9T9A0036.JPG",
    "../../public/images/9T9A0047.JPG",
    "../../public/images/IMG-20250611-WA0051.jpg",
    "../../public/images/IMG-20250628-WA0028.jpg",
    "https://plus.unsplash.com/premium_photo-1681841986668-117d7eaab200?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1721562117948-7614b4b7bdad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
      content: Math.random() > 0.5 ? "image" : "gradient", // 60/40 split
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

  // Start first animation on mount
  useEffect(() => {
    setTimeout(() => startReveal(0), 3000)
  }, [])



  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div className="absolute hidden md:block inset-0 z-0">
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
                className={`transition-all duration-700 transform ${isRevealed ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 rotate-12"
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

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce">
        <Sparkles className="h-8 w-8 text-orange-400" />
      </div>
      <div className="absolute top-40 right-10 animate-pulse">
        <Heart className="h-6 w-6 text-pink-400" />
      </div>
      <div
        className="absolute bottom-20 left-20 animate-bounce"
        style={{ animationDelay: '1s' }}
      >
        <Users className="h-10 w-10 text-teal-400" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full shadow-lg">
          <span className="text-sm font-medium text-white">Refugee & Youth-Led Initiative</span>
        </div>

      <div className="backdrop-blur-sm bg-white">
        <h1 className="text-4xl   sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
            Rise Beyond
          </span>
          <br />
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Borders
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
          Empowering refugee and displaced youth through
          <span className="font-semibold text-blue-600"> creative expression</span>,
          <span className="font-semibold text-teal-600"> education</span>, and
          <span className="font-semibold text-orange-600"> sustainable opportunity</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={scrollToContact}
            className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Join Our Movement</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-lg underline decoration-2 underline-offset-4 decoration-blue-300 hover:decoration-blue-600">
            Watch Our Story
          </button>
        </div>

         </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold text-white mb-2">300+</div>
            <div className="text-blue-100 font-medium">Youth Impacted</div>
          </div>
          <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold text-white mb-2">3</div>
            <div className="text-teal-100 font-medium">Program Locations</div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-orange-100 font-medium">Refugee-Led</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
