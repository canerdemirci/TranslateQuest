import clsx from 'clsx'
import TranslationLogo from './components/TranslationLogo'
import ScoreSection from './components/ScoreSection'
import LanguageSelectionSection from './components/LanguageSelectionSection'
import SourceTextSection from './components/SourceTextSection'
import TargetTextSection from './components/TargetTextSection'
import AIReviewSection from './components/AIReviewSection'
import GameLoading from './components/GameLoading'
import { SUPPORTED_LANGUAGES } from './constants'
import { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { formattedSeconds } from './utils/utils'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

var genAI: any | GoogleGenerativeAI = null

const getGeminiApiKey = async () : Promise<string | never> => {
    const res = await fetch("/api/gemini")
    const data = await res.json()

    if (res.status === 200) {
      return data.apiKey
    } else {
      throw new Error(data.error || "Failed to fetch Gemini API key")
    }
}

function App(): React.ReactElement {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0])
  const [targetLanguage, setTargetLanguage] = useState<Language>(SUPPORTED_LANGUAGES[1])
  const [isGeneratingText, setIsGeneratingText] = useState<boolean>(true)
  const [isGameLoading, setIsGameLoading] = useState<boolean>(true)
  const [currentSourceText, setCurrentSourceText] = useState<string>('')
  const [userTranslation, setUserTranslation] = useState<string>('')
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [showReview, setShowReview] = useState<boolean>(false)
  const [reviewLoading, setReviewLoading] = useState<boolean>(false)
  const [totalScore, setTotalScore] = useState<number>(0)
  const [translationCount, setTranslationCount] = useState<number>(0)
  const [elapsedSec, setElapsedSec] = useState<number>(0)
  const [timerSt, setTimerSt] = useState<'play' | 'stop'>('stop')

  useEffect(() => {
    if (import.meta.env.VITE_ENV === 'development') {
      genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!)
      setTimeout(() => setIsGameLoading(false), 4000)
    } else {
      getGeminiApiKey().then(key => {
        console.log('Gemini API Key fetched successfully', key)
        genAI = new GoogleGenerativeAI(key)
        setIsGameLoading(false)
      }).catch(err => {
        console.error('Gemini API Key fetch error:', err)
        alert('The game is currently unavailable. Please try again later.')
        setIsGameLoading(false)
        process.exit(1)
      })
    }
  }, [])
  
  // Generate initial text when component mounts or language changes
  useEffect(() => {
    generateSourceText()
  }, [sourceLanguage])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerSt === 'play') {
      setElapsedSec(0)
      interval = setInterval(() => {
        setElapsedSec(prev => prev + 1)
      }, 1000)
    } else {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timerSt])

  const generateSourceText = async (): Promise<void> => {
    setIsGeneratingText(true)
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      
      const languageName = sourceLanguage.nativeName
      const languageCode = sourceLanguage.code
      
      const prompt = `
        Create a text in ${languageName} (${languageCode}). The text should have these characteristics:
        - Be 2-4 sentences long
        - Can be about any topics randomly (e.g., food, travel, hobbies, family, work, sports, music, books, movies, nature, city life, etc.)
        - The level of text can be intermediate or slightly above
        - Be translatable and understandable
        - Only provide the text, no other explanations
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      const finalText = text.trim()
      
      setCurrentSourceText(finalText)
      setUserTranslation('')
      setAiReview(null)
      setShowReview(false)
    } catch (error) {
      console.error('Text generation error:', error)
      alert('Failed to generate source text. Please try again.')
      setCurrentSourceText('')
    }
    
    setIsGeneratingText(false)
    setTimerSt('play')
  }

  const handleSubmitTranslation = async (): Promise<void> => {
    if (userTranslation.trim().length < 10) {
      alert('Please write your translation!')
      return
    }

    setReviewLoading(true)
    setTimerSt('stop')
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      
      const prompt = `
        Read the following text in ${sourceLanguage.nativeName} (${sourceLanguage.code}):
        "${currentSourceText}"
        
        User's translation to ${targetLanguage.nativeName}:
        "${userTranslation}"
        
        Please evaluate the user's translation and respond in the following JSON format:
        
        {
          "score": 8,
          "scoreText": "Very good translation!",
          "grammarErrors": [
            "Minor word order error"
          ],
          "improvements": [
            "You could use a more natural expression",
            "Some words could be replaced with more appropriate ones"
          ],
          "correctTranslation": "The correct translation of this text should be...",
          "encouragement": "Overall, you made a successful translation!"
        }
        
        Rules:
        - score: integer between 0-10
        - scoreText: brief evaluation (1-2 sentences)
        - grammarErrors: string array if errors exist, empty array [] if none
        - improvements: string array of improvement suggestions
        - correctTranslation: suggested correct translation
        - encouragement: encouraging message
        - Write all text in English
        - Only respond in JSON format, no other explanations
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        // Clean the response text to extract JSON
        const cleanedText = text.replace(/```json|```/g, '').trim()
        const parsedReview: AIReview = JSON.parse(cleanedText)

        setAiReview(parsedReview)
        setShowReview(true)

        // Adjust score by time multiplier
        const adjusted = computeScoreWithTimeMultiplier(
          parsedReview.score || 0, elapsedSec, { maxTime: 30, maxBonus: 0.5, minMultiplier: 0.6 })

        // Update total score and translation count using adjusted score
        setTotalScore(prev => prev + adjusted)
        setTranslationCount(prev => prev + 1)
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError)
        alert('AI review could not be parsed.')

        setAiReview(null)
        setShowReview(false)
      }
    } catch (error) {
      console.error('Gemini API hatası:', error)
      alert('The AI review is currently unavailable. Please try again later.')
      setAiReview(null)
      setShowReview(false)
    }
    
    setReviewLoading(false)
  }

  const handleNextTranslation = async (): Promise<void> => {
    setShowReview(false)
    setUserTranslation('')
    await generateSourceText()
  }

  // Score multiplier function (linear decay)
  function computeScoreWithTimeMultiplier(basePoints: number, timeTakenSec: number, {
    maxTime = 30,
    maxBonus = 0.5,
    minMultiplier = 0.6
  }: { maxTime?: number, maxBonus?: number, minMultiplier?: number } = {}) {
    const clampedTime = Math.max(0, timeTakenSec)
    // 1 when instant, 0 at maxTime+
    const bonusFraction = Math.max(0, (maxTime - clampedTime) / maxTime)
    const multiplier = Math.max(minMultiplier, 1 + maxBonus * bonusFraction)
    return Math.round(basePoints * multiplier)
  }

  if (isGameLoading) {
    return <GameLoading />
  }
  
  return (
    <main className={clsx([
      'w-screen', 'h-screen', 'overflow-x-hidden', 'overflow-y-auto', 'px-4',
      'bg-gradient-to-br', 'from-purple-200', 'via-pink-200', 'to-blue-200',
      'sm:px-16',
    ])}>
      <header className='text-center'>
        <TranslationLogo />
      </header>
      <ScoreSection
        totalScore={totalScore}
        totalTranslations={translationCount}
        time={formattedSeconds(elapsedSec)}
      />
      <LanguageSelectionSection
        languages={SUPPORTED_LANGUAGES}
        onChange={(source, target) => {
          setElapsedSec(0)
          setTimerSt('stop')
          setSourceLanguage(source)
          setTargetLanguage(target)
        }}
        className={clsx([
          !(showReview || isGeneratingText || reviewLoading) ? 'block' : 'hidden'
        ])}
      />
      <SourceTextSection
        sourceText={isGeneratingText ? 'Generating Source Text...' : currentSourceText}
        onPaste={(text) => {
          setElapsedSec(0)
          setCurrentSourceText(text)
        }}
      />
      <TargetTextSection
        userTranslation={userTranslation}
        onChange={(text) => setUserTranslation(text)}
      />
      <motion.button
        whileHover={
          (userTranslation.trim().length < 10 || showReview || reviewLoading) ? undefined
          : { scale: 1.02 }
        }
        whileTap={
          (userTranslation.trim().length < 10 || showReview || reviewLoading) ? undefined
          : { scale: 0.95 }
        }
        className={clsx([
          'flex', 'items-center', 'justify-center', 'gap-2',
          'w-full', 'bg-gradient-to-r', 'from-purple-500', 'via-pink-500', 'to-blue-500',
          'hover:from-purple-600', 'hover:via-pink-600', 'hover:to-blue-600', 'text-white',
          'rounded-2xl', 'py-4', 'shadow-lg', 'transition-all', 'duration-300', 'hover:shadow-xl',
          'disabled:opacity-60', 'disabled:text-gray-200', 'mb-4'
        ])}
        disabled={userTranslation.trim().length < 10 || showReview || reviewLoading}
        onClick={handleSubmitTranslation}
      >
        {
          reviewLoading ?
            <>
              <motion.text
                className='ml-2'
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                ⏳
              </motion.text> AI is working...
            </> :
            <><Sparkles /> REVIEW</>
        }
      </motion.button>
      {showReview && aiReview &&
        <>
          <AIReviewSection
            score={aiReview.score}
            scoreText={aiReview.scoreText}
            timeSpent={elapsedSec || 0}
            correctTranslation={aiReview.correctTranslation}
            grammarErrors={aiReview.grammarErrors}
            improvements={aiReview.improvements}
            incentiveText={aiReview.encouragement}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={clsx([
                'w-full', 'bg-gradient-to-r', 'from-green-400', 'to-blue-500',
                'hover:from-green-500', 'hover:to-blue-600', 'text-white', 'rounded-2xl',
                'py-4', 'mb-12', 'shadow-lg', 'transition-all', 'duration-300', 'hover:shadow-xl'
            ])}
            onClick={handleNextTranslation}
          >
            Next Translation
          </motion.button>
        </>
      }
    </main>
  )
}

export default App
