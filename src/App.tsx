import clsx from 'clsx'
import TranslationLogo from './components/TranslationLogo'
import ScoreSection from './components/ScoreSection'
import LanguageSelectionSection from './components/LanguageSelectionSection'
import SourceTextSection from './components/SourceTextSection'
import TargetTextSection from './components/TargetTextSection'
import AIReviewSection from './components/AIReviewSection'
import GameLoading from './components/GameLoading'
import { SUPPORTED_LANGUAGES } from './constants'
import { useEffect, useRef, useState } from 'react'
import gemini, { formattedSeconds } from './utils/utils'
import { Loader, PencilLine, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import AIReviewAnimation from './components/AIReviewAnimation'
import TextGenerationAnimation from './components/TextGenerationAnimation'
import ConfirmationBox from './components/ConfirmationBox'

const minUserTrnsLen = 10

// Score multiplier function (linear decay)
const computeScoreWithTimeMultiplier = (
  basePoints: number,
  timeTakenSec: number,
  {
    maxTime = 30,
    maxBonus = 0.5,
    minMultiplier = 0.6
  }:{
    maxTime?: number,
    maxBonus?: number,
    minMultiplier?: number
  } = {}) =>
{
  const clampedTime = Math.max(0, timeTakenSec)
  // 1 when instant, 0 at maxTime+
  const bonusFraction = Math.max(0, (maxTime - clampedTime) / maxTime)
  const multiplier = Math.max(minMultiplier, 1 + maxBonus * bonusFraction)
  return Math.round(basePoints * multiplier)
}

const getSourceText = async (language: Language): Promise<string | null | never> => {
  const prompt = `
    Create a text in ${language.nativeName} (${language.code}). The text should have these 
    characteristics:
    - Be 2-4 sentences long
    - Can be about any topics randomly (e.g., food, travel, hobbies, family, work, sports, music, books, movies, nature, city life, quotes etc.)
    - The level of text can be intermediate or slightly above
    - Be translatable and understandable
    - Only provide the text, no other explanations
  `

  const res: AIResponse = await gemini(prompt)

  if (res.error) { throw new Error() }
  if (res.aiResponse) { return res.aiResponse.trim() }

  return null
}

const getHelperWords = async (
  sourceLanguage: Language,
  targetLanguage: Language,
  currentSourceText: string
) : Promise<string[] | null | never> => {
  const prompt = `Examine the text that I will give you. A user in my app will try to translate 
    it from ${sourceLanguage.name} ($${sourceLanguage.code}) language to 
    ${sourceLanguage.name} (${sourceLanguage.code}) language. Output words or collocations in 
    ${targetLanguage.name} (${targetLanguage.code}) that can serve as clues for the user. 
    Json format:
    {
      words: ['word1', 'word2']
    }
    Rules:
      - Only respond in JSON format, no other explanations
    Text: ${currentSourceText}
  `

  const res: AIResponse = await gemini(prompt)

  if (res.error) { throw new Error() }

  if (res.aiResponse) {
    const cleanedText = res.aiResponse.replace(/```json|```/g, '').trim()
    const words = JSON.parse(cleanedText).words as string[]
    
    return words.sort(() => Math.random() - 0.5)
  }

  return null
}

const getReview = async (
  currentSourceText: string,
  userTranslation: string,
  sourceLanguage: Language,
  targetLanguage: Language
) : Promise<AIReview | null | never> => {
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

  const res: AIResponse = await gemini(prompt)

  if (res.error) { throw new Error() }
  
  if (res.aiResponse) {
    // Clean the response text to extract JSON
    const cleanedText = res.aiResponse.replace(/```json|```/g, '').trim()
    const parsedReview: AIReview = JSON.parse(cleanedText)

    return parsedReview
  }

  return null
}

function App(): React.ReactElement {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0])
  const [targetLanguage, setTargetLanguage] = useState<Language>(SUPPORTED_LANGUAGES[1])
  const [isGeneratingText, setIsGeneratingText] = useState<boolean>(false)
  const [isGameLoading, setIsGameLoading] = useState<boolean>(true)
  const [currentSourceText, setCurrentSourceText] = useState<string>('')
  const [sourceTextGenerationError, setSourceTextGenerationError] = useState<boolean>(false)
  const [userTranslation, setUserTranslation] = useState<string>('')
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [showReview, setShowReview] = useState<boolean>(false)
  const [reviewLoading, setReviewLoading] = useState<boolean>(false)
  const [totalScore, setTotalScore] = useState<number>(0)
  const [adjustedScore, setAdjustedScore] = useState<number>(0)
  const [translationCount, setTranslationCount] = useState<number>(0)
  const [elapsedSec, setElapsedSec] = useState<number>(0)
  const [timerSt, setTimerSt] = useState<'play' | 'stop'>('stop')
  const [introAnimationComplete, setIntroAnimationComplete] = useState<boolean>(false)
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState<boolean>(false)
  const [confirmationBoxText, setConfirmationBoxText] = useState<string>('')
  const [pasteText, setPasteText] = useState<string>('')
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [hintWords, setHintWords] = useState<string[]>([])

  const aiReviewRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const loadingTimeout = setTimeout(() => { setIsGameLoading(false) }, 4000)

    return () => clearTimeout(loadingTimeout)
  }, [])

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

  // Scroll to AI review when it appears
  useEffect(() => {
    if (showReview && aiReviewRef.current) {
      aiReviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (reviewLoading) {
      setHintWords([])
      setTimerSt('stop')
    }
  }, [showReview, reviewLoading])

  useEffect(() => {
    setUserTranslation('')
    setAiReview(null)
    setShowReview(false)
  }, [sourceTextGenerationError])

  useEffect(() => {
    if (isGeneratingText) {
      setTimerSt('stop')
    } else {
      setTimerSt('play')
      setElapsedSec(0)
    }
    
    setHintWords([])
  }, [currentSourceText, sourceLanguage, targetLanguage, isGeneratingText])

  useEffect(() => {
    if (introAnimationComplete) {
      setIsGeneratingText(true)
      generateSourceText()
    }
  }, [sourceLanguage, introAnimationComplete])

  useEffect(() => {
    if (hintWords.length === 0) {
      setShowHelp(false)
    } else {
      setShowHelp(true)
    }
  }, [hintWords])

  const generateSourceText = () => {
    getSourceText(sourceLanguage)
      .then(text => {
        if (text) {
          setCurrentSourceText(text)
        }
        
        setTimerSt('play')
      })
      .catch(_ => setSourceTextGenerationError(true))
      .finally(() => setIsGeneratingText(false))
  }

  const generateReview = () => {
    setReviewLoading(true)
    getReview(currentSourceText, userTranslation, sourceLanguage, targetLanguage)
      .then(review => {
        if (review) {
          setAiReview(review)
          setShowReview(true)
          
          // Adjust score by time multiplier
          const adjusted = computeScoreWithTimeMultiplier(
            review.score || 0, elapsedSec, { maxTime: 30, maxBonus: 0.5, minMultiplier: 0.6 })
          
          // Update total score and translation count using adjusted score
          setAdjustedScore(adjusted)
          setTotalScore(prev => prev + adjusted)
          setTranslationCount(prev => prev + 1)
        }
      })
      .catch(_ => {
        alert('The AI review is currently unavailable. Please try again later.')
        setAiReview(null)
        setShowReview(false)
      })
      .finally(() => setReviewLoading(false))
  }

  const handleSubmitTranslation = async (): Promise<void> => {
    if (userTranslation.trim().length < minUserTrnsLen) {
      alert('Please write your translation!')
      return
    }

    generateReview()
  }

  const handleNextTranslation = async (): Promise<void> => {
    setShowReview(false)
    setUserTranslation('')
    setIsGeneratingText(true)
    generateSourceText()
  }

  function handlePasteText(text: string) {
    setCurrentSourceText(text)
    setElapsedSec(0)
  }

  function handleHelpButton() {
    setShowHelp(true)
    getHelperWords(sourceLanguage, targetLanguage, currentSourceText)
      .then(words => {
        if (words) {
          setHintWords(words)
      }})
      .catch(_ => {
        setHintWords([])
        alert('Failed to generate AI help!')
      })
  }

  function handleSourceTextTryAgainButton() {
    setSourceTextGenerationError(false)
    setIsGeneratingText(true)
    generateSourceText()
  }

  if (isGameLoading) {
    return <GameLoading />
  }

  return <>
    {/* ---*** Modals ***--- start --- */}
    {/* Review is coming animation */}
    <AIReviewAnimation open={reviewLoading} />
    {/* Text generating animation */}
    <TextGenerationAnimation open={isGeneratingText} />
    {/* Confirmation Dialog */}
    <ConfirmationBox
      open={confirmationBoxOpen}
      text={confirmationBoxText}
      onClose={(choice) => {
        if (choice === 'yes') handlePasteText(pasteText)
        setConfirmationBoxOpen(false)
      }}
    />
    {/* ---*** Modals ***--- end --- */}

    {/* MAIN LAYOUT */}
    <motion.main
      className={clsx([
        'w-screen', 'h-screen', 'overflow-x-hidden', 'overflow-y-auto', 'px-4',
        'bg-gradient-to-br', 'from-purple-200', 'via-pink-200', 'to-blue-200',
        'sm:px-16',
      ])}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      onAnimationComplete={() => setIntroAnimationComplete(true)}
    >
      {/* App Logo */}
      <header className='text-center'>
        <TranslationLogo />
      </header>

      {/* Score Section */}
      <ScoreSection
        totalScore={totalScore}
        totalTranslations={translationCount}
        time={formattedSeconds(elapsedSec)}
      />

      {/* Language Selection Section */}
      <LanguageSelectionSection
        languages={SUPPORTED_LANGUAGES}
        onChange={(source, target) => {
          if (source.code !== sourceLanguage.code) {
            setSourceLanguage(source)
          }
          setTargetLanguage(target)
        }}
        className={clsx([
          !(showReview || isGeneratingText || reviewLoading) ? 'block' : 'hidden'
        ])}
      />

      {/* Source Text Section */}
      {!showReview && <SourceTextSection
        sourceText={isGeneratingText ? 'Generating Source Text...' : currentSourceText}
        error={sourceTextGenerationError}
        showHelpBtn={!showHelp}
        onPaste={(text) => {
          if (text.length > 150) {
            setConfirmationBoxOpen(true)
            setConfirmationBoxText(
              "You will paste a text for translation instead of AI generated text. Are you sure?")
            setPasteText(text)
          } else {
            alert('Your text must be 150 characters long at least!')
          }
        }}
        onHelp={handleHelpButton}
        onTryAgain={handleSourceTextTryAgainButton}
      />}

      {/* Helper Words Section */}
      {showHelp && <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <section className={clsx([
          'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
          'rounded-3xl', 'p-8', 'shadow-lg', 'mb-6'
        ])}>
          {
            hintWords.length < 1 ?
              <motion.div
                className='origin-center w-8 h-8 m-auto'
                animate={{ rotate: [0, 360], opacity: [0.3, 1, 0.3], scale: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
              >
                <Loader className='w-8 h-8' />
              </motion.div>
              : <div
                  className={clsx([
                    'flex', 'flex-wrap', 'items-center', 'justify-start', 'gap-8'
                  ])}
                >
                  {
                    hintWords.map((w, i) =>
                      <motion.div
                        key={i}
                        className='text-sm text-pink-600 flex justify-center items-center'
                        animate={{ opacity: [0, 1] }}
                        transition={{ duration: 0.5, ease: 'linear', delay: i * 0.3 }}
                      >
                        <Sparkles className='w-4 h-4 text-purple-600' />
                        <span className='ml-2 italic'>{w}</span>
                      </motion.div>)
                  }
                </div>
          }
        </section>
      </motion.div>}

      {/* Target Text Section */}
      {!showReview && <TargetTextSection
        userTranslation={userTranslation}
        onChange={(text) => setUserTranslation(text)}
      />}

      {/* AI Review Button */}
      {!showReview && <motion.button
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
          'disabled:opacity-60', 'disabled:text-gray-200', 'mb-16', 'mt-10'
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
            userTranslation.trim().length < minUserTrnsLen ?
              <><PencilLine /> Write more to AI Review</> :
              <><Sparkles /> REVIEW</>
        }
      </motion.button>}

      {/* AI Review Section */}
      {showReview && aiReview &&
        <>
          <AIReviewSection
            ref={aiReviewRef}
            score={aiReview.score}
            scoreText={aiReview.scoreText}
            timeSpent={elapsedSec || 0}
            bonusFromTime={adjustedScore - aiReview.score}
            userTranslation={userTranslation}
            sourceText={currentSourceText}
            correctTranslation={aiReview.correctTranslation}
            grammarErrors={aiReview.grammarErrors}
            improvements={aiReview.improvements}
            incentiveText={aiReview.encouragement}
          />
          {/* Next Translation Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={clsx([
              'w-full', 'bg-gradient-to-r', 'from-green-400', 'to-blue-500',
              'hover:from-green-500', 'hover:to-blue-600', 'text-white', 'rounded-2xl',
              'py-4', 'shadow-lg', 'transition-all', 'duration-300', 'hover:shadow-xl',
              'mb-16', 'mt-2'
            ])}
            onClick={handleNextTranslation}
          >
            Next Translation
          </motion.button>
        </>
      }
    </motion.main>
  </>
}

export default App
