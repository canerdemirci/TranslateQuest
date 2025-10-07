import { useState, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Type definitions
interface AIReview {
  score: number
  scoreText: string
  grammarErrors: string[]
  improvements: string[]
  correctTranslation: string
  encouragement: string
}

interface Language {
  code: string
  name: string
  nativeName: string
}

interface WordButton {
  original: string
  simple: string
  translation?: string
}

// Supported languages by Gemini 2.5 Flash
const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'zu', name: 'Zulu', nativeName: 'IsiZulu' },
  { code: 'xh', name: 'Xhosa', nativeName: 'IsiXhosa' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
  { code: 'sn', name: 'Shona', nativeName: 'ChiShona' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi' },
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa' },
  { code: 'to', name: 'Tongan', nativeName: 'Lea fakatonga' },
  { code: 'fj', name: 'Fijian', nativeName: 'Na Vosa Vakaviti' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl ayisyen' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
  { code: 'la', name: 'Latin', nativeName: 'Latina' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu' },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk' },
  { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' }
]

const genAI = new GoogleGenerativeAI('AIzaSyCh7jIvEFtpzjZ77TQHTWfxhKaY57lSu80')

function App(): React.ReactElement {
  const [currentText, setCurrentText] = useState<string>('')
  const [userTranslation, setUserTranslation] = useState<string>('')
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showReview, setShowReview] = useState<boolean>(false)
  const [isGeneratingText, setIsGeneratingText] = useState<boolean>(true)
  const [totalScore, setTotalScore] = useState<number>(0)
  const [translationCount, setTranslationCount] = useState<number>(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeTaken, setTimeTaken] = useState<number | null>(null)
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [wordButtons, setWordButtons] = useState<WordButton[]>([])
  const [copiedWord, setCopiedWord] = useState<string | null>(null)
  const [adjustedScoreLast, setAdjustedScoreLast] = useState<number | null>(null)
  const [helpLoading, setHelpLoading] = useState<boolean>(false)
  // cache: key -> { simple: translation }
  const translationsCache = (globalThis as any).__translationsCache ||= new Map<string, Record<string, string>>()
  const [sourceLanguage, setSourceLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]) // Turkish
  const [targetLanguage, setTargetLanguage] = useState<Language>(SUPPORTED_LANGUAGES[1]) // English
  const [translationDirection, setTranslationDirection] = useState<'source-to-target' | 'target-to-source'>('source-to-target')
  const [showMoreWords, setShowMoreWords] = useState<boolean>(false)

  // Generate initial text when component mounts or language changes
  useEffect(() => {
    generateText()
  }, [sourceLanguage])

  const generateText = async (): Promise<void> => {
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
  setCurrentText(finalText)
  // build word buttons for the new text
  setWordButtons(buildWordButtonsFromText(finalText))
  setStartTime(Date.now())
  setTimeTaken(null)
  setShowHelp(false)
  setCopiedWord(null)
        setUserTranslation('')
        setAiReview(null)
        setShowReview(false)
        // start background prefetch for HELP translations
        prefetchTranslations().catch(() => {})
    } catch (error) {
      console.error('Text generation error:', error)
      // Fallback text if AI fails
      const fallbackTexts: { [key: string]: string } = {
        'tr': 'Merhaba! Bugün hava çok güzel. Parkta yürüyüş yapmak istiyorum.',
        'en': 'Hello! Today the weather is very nice. I want to take a walk in the park.',
        'es': '¡Hola! Hoy el clima está muy bonito. Quiero dar un paseo en el parque.',
        'fr': 'Bonjour! Aujourd\'hui le temps est très beau. Je veux faire une promenade dans le parc.',
        'de': 'Hallo! Heute ist das Wetter sehr schön. Ich möchte im Park spazieren gehen.',
        'it': 'Ciao! Oggi il tempo è molto bello. Voglio fare una passeggiata nel parco.'
      }
      const fallback = fallbackTexts[sourceLanguage.code] || fallbackTexts['en']
      setCurrentText(fallback)
      setWordButtons(buildWordButtonsFromText(fallback))
      setStartTime(Date.now())
      setTimeTaken(null)
      setShowHelp(false)
      setCopiedWord(null)
    }
    
    setIsGeneratingText(false)
  }

  // Helper: create simple word buttons from text
  const simpleForm = (word: string): string => {
    return word
      .normalize('NFKD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/["'„“”()\[\],.!?:;—–\/\\]/g, '')
      .trim()
      .toLowerCase()
  }

  const buildWordButtonsFromText = (text: string): WordButton[] => {
    if (!text) return []
    // Split on whitespace, keep short words; filter empty
    const raw = text.split(/\s+/).map(w => w.trim()).filter(Boolean)
    // produce initial array with simple forms; translations will be filled later
    const mapped = raw.map(r => ({ original: r, simple: simpleForm(r) }))
    // reorder to show likely content words first (longer words)
    mapped.sort((a, b) => {
      const scoreA = (a.simple.length >= 4 && !isCommonWord(a.simple)) ? 1 : 0
      const scoreB = (b.simple.length >= 4 && !isCommonWord(b.simple)) ? 1 : 0
      if (scoreA !== scoreB) return scoreB - scoreA
      return b.simple.length - a.simple.length
    })
    return mapped
  }

  // Very small common-word heuristic (English-focused). Used only to prioritize likely content words.
  const COMMON_WORDS = new Set(['the','and','for','that','with','this','from','have','are','but','not','you','was','they','his','her','she','he','it','a','an','in','on','at','to','of','is'])
  function isCommonWord(w: string): boolean { return COMMON_WORDS.has(w) }

  // Fetch per-word translations using the AI as JSON mapping. If it fails, we'll leave translations undefined.
  const fetchWordTranslations = async (): Promise<void> => {
    if (!currentText) return
    const src = translationDirection === 'source-to-target' ? sourceLanguage : targetLanguage
    const tgt = translationDirection === 'source-to-target' ? targetLanguage : sourceLanguage
    const cacheKey = `${currentText}::${src.code}->${tgt.code}`
    // If cached, apply cached translations and return
    if (translationsCache.has(cacheKey)) {
      const map = translationsCache.get(cacheKey) || {}
      setWordButtons(prev => prev.map(w => ({ ...w, translation: map[w.simple] || map[w.original] || w.translation })))
      return
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      // build list of simple forms to request translations for
      const simples = wordButtons.map(w => w.simple)
      const prompt = `
        You are given a source text in ${src.nativeName} (${src.code}).
        Text:
        "${currentText}"

        Return a JSON object that maps each simple form of the source words (lowercased, punctuation removed) to a short translation in ${tgt.nativeName}.
        Words: ${simples.join(', ')}
        Only return valid JSON. Example:
        { "merhaba": "hello", "bugun": "today" }
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const cleaned = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)

      // Cache the mapping and apply translations
      translationsCache.set(cacheKey, parsed)
      setWordButtons(prev => prev.map(w => ({ ...w, translation: parsed[w.simple] || parsed[w.original] || w.translation })))
    } catch (err) {
      console.warn('Word translations failed, falling back to nothing', err)
      if (aiReview && aiReview.correctTranslation) {
        const tgtWords = aiReview.correctTranslation.split(/\s+/).map(t => t.replace(/[.,!?;:]/g, '').toLowerCase())
        const mapped = wordButtons.map((w, i) => ({ ...w, translation: tgtWords[i] || undefined }))
        setWordButtons(mapped)
      }
    }
  }

  // Prefetch translations in background; store in cache so opening HELP is instant
  const prefetchTranslations = async (): Promise<void> => {
    if (!currentText) return
    const src = translationDirection === 'source-to-target' ? sourceLanguage : targetLanguage
    const tgt = translationDirection === 'source-to-target' ? targetLanguage : sourceLanguage
    const cacheKey = `${currentText}::${src.code}->${tgt.code}`
    if (translationsCache.has(cacheKey)) return
    try {
      setHelpLoading(true)
      // build list of simple forms
      const simples = buildWordButtonsFromText(currentText).map(w => w.simple)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const prompt = `
        You are given a source text in ${src.nativeName} (${src.code}).
        Text:
        "${currentText}"

        Return a JSON object that maps each simple form of the source words (lowercased, punctuation removed) to a short translation in ${tgt.nativeName}.
        Words: ${simples.join(', ')}
        Only return valid JSON.
      `
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      const cleaned = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      translationsCache.set(cacheKey, parsed)
      // do not automatically show help; just populate translations so help opens instantly
      setWordButtons(prev => prev.map(w => ({ ...w, translation: parsed[w.simple] || parsed[w.original] || w.translation })))
    } catch (err) {
      console.warn('Prefetch translations failed', err)
    } finally {
      setHelpLoading(false)
    }
  }

  // Live elapsed seconds while answering
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  useEffect(() => {
    if (startTime && !showReview) {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
      const id = setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000)), 1000)
      return () => clearInterval(id)
    }
    setElapsedSeconds(0)
    return
  }, [startTime, showReview])

  const handleSubmit = async (): Promise<void> => {
    if (!userTranslation.trim()) {
      alert('Please write your translation!')
      return
    }

    setIsLoading(true)
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      
      const sourceLang = translationDirection === 'source-to-target' ? sourceLanguage : targetLanguage
      const targetLang = translationDirection === 'source-to-target' ? targetLanguage : sourceLanguage
      
      const prompt = `
        Read the following text in ${sourceLang.nativeName} (${sourceLang.code}):
        "${currentText}"
        
        User's translation to ${targetLang.nativeName}:
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
        
        // calculate time taken (seconds)
        const now = Date.now()
        const elapsedMs = startTime ? (now - startTime) : 0
        const elapsedSec = Math.max(0, Math.round(elapsedMs / 1000))
        setTimeTaken(elapsedSec)

        // Adjust score by time multiplier
        const adjusted = computeScoreWithTimeMultiplier(parsedReview.score || 0, elapsedSec, { maxTime: 30, maxBonus: 0.5, minMultiplier: 0.6 })
        setAdjustedScoreLast(adjusted)

        setShowReview(true)

        // Update total score and translation count using adjusted score
        setTotalScore(prev => prev + adjusted)
        setTranslationCount(prev => prev + 1)
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError)
        // Fallback to plain text if JSON parsing fails
        const fallbackReview: AIReview = {
          score: 7,
          scoreText: "Çeviri değerlendirildi",
          grammarErrors: [],
          improvements: ["JSON formatında yanıt alınamadı"],
          correctTranslation: text,
          encouragement: "Tekrar deneyin!"
        }
        setAiReview(fallbackReview)
        setShowReview(true)

        // fallback: compute timing and adjusted score using fallback score
        const now = Date.now()
        const elapsedMs = startTime ? (now - startTime) : 0
        const elapsedSec = Math.max(0, Math.round(elapsedMs / 1000))
        setTimeTaken(elapsedSec)
        const adjusted = computeScoreWithTimeMultiplier(fallbackReview.score || 0, elapsedSec, { maxTime: 30, maxBonus: 0.5, minMultiplier: 0.6 })
        setAdjustedScoreLast(adjusted)

        setTotalScore(prev => prev + adjusted)
        setTranslationCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Gemini API hatası:', error)
      const errorReview: AIReview = {
        score: 0,
        scoreText: "Değerlendirme yapılamadı",
        grammarErrors: [],
        improvements: ["API hatası oluştu"],
        correctTranslation: "Çeviri değerlendirilirken bir hata oluştu. Lütfen tekrar deneyin.",
        encouragement: "Tekrar deneyin!"
      }
      setAiReview(errorReview)
      setShowReview(true)

      // Update timing and count even for errors
      const now = Date.now()
      const elapsedMs = startTime ? (now - startTime) : 0
      const elapsedSec = Math.max(0, Math.round(elapsedMs / 1000))
      setTimeTaken(elapsedSec)
      setAdjustedScoreLast(null)
      setTranslationCount(prev => prev + 1)
    }
    
    setIsLoading(false)
  }

  // Score multiplier function (linear decay)
  function computeScoreWithTimeMultiplier(basePoints: number, timeTakenSec: number, {
    maxTime = 30,
    maxBonus = 0.5,
    minMultiplier = 0.6
  }: { maxTime?: number, maxBonus?: number, minMultiplier?: number } = {}) {
    const clampedTime = Math.max(0, timeTakenSec)
    const bonusFraction = Math.max(0, (maxTime - clampedTime) / maxTime) // 1 when instant, 0 at maxTime+
    const multiplier = Math.max(minMultiplier, 1 + maxBonus * bonusFraction)
    return Math.round(basePoints * multiplier)
  }

  const handleNewText = (): void => {
    generateText()
  }

  const handleHelpClick = async (): Promise<void> => {
    // toggle help; if enabling and no cached translations, fetch (with loading indicator)
    const willShow = !showHelp
    setShowHelp(willShow)
    if (willShow) {
      setHelpLoading(true)
      try {
        await fetchWordTranslations()
      } finally {
        setHelpLoading(false)
      }
    }
  }

  const handleWordClick = async (w: WordButton): Promise<void> => {
    try {
      const toCopy = w.translation || w.simple || w.original
      await navigator.clipboard.writeText(toCopy)
      setCopiedWord(toCopy)
      setTimeout(() => setCopiedWord(null), 2000)
    } catch (err) {
      console.warn('Clipboard write failed', err)
      // fallback: try execCommand (older)
      const textarea = document.createElement('textarea')
      textarea.value = w.translation || w.simple || w.original
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand('copy') } catch (e) { /* ignore */ }
      document.body.removeChild(textarea)
      setCopiedWord(textarea.value)
      setTimeout(() => setCopiedWord(null), 2000)
    }
  }

  const handleSourceLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedCode = event.target.value
    const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedCode)
    if (selectedLanguage) {
      setSourceLanguage(selectedLanguage)
    }
  }

  const handleTargetLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedCode = event.target.value
    const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedCode)
    if (selectedLanguage) {
      setTargetLanguage(selectedLanguage)
    }
  }

  const handleDirectionSwitch = (): void => {
    setTranslationDirection(prev => 
      prev === 'source-to-target' ? 'target-to-source' : 'source-to-target'
    )
    // Swap languages when switching direction
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="app-container mx-auto">
        <header className="glass card-padding mb-5 section">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 style={{fontSize:'var(--h1)', margin:0}}>🌍 Translation Game</h1>
              <p className="small-muted" style={{marginTop:'6px'}}>Translate the text from {sourceLanguage.nativeName} to {targetLanguage.nativeName}</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.02)] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.04)]">
                <label className="text-sm small-muted">From</label>
                <select id="source-language" value={sourceLanguage.code} onChange={handleSourceLanguageChange} className="form-select bg-transparent text-sm">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
                  ))}
                </select>
                <button onClick={handleDirectionSwitch} className="ml-2 p-2 rounded-md bg-[rgba(0,0,0,0.18)]">↔️</button>
                <label className="text-sm small-muted ml-2">To</label>
                <select id="target-language" value={targetLanguage.code} onChange={handleTargetLanguageChange} className="form-select bg-transparent text-sm">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 stats-grid">
            <div className="glass-soft stats-item text-center">
              <div className="text-xs small-muted">Toplam Puan</div>
              <div className="text-base font-semibold">{totalScore}/{translationCount * 10}</div>
            </div>
            <div className="glass-soft stats-item text-center">
              <div className="text-xs small-muted">Çeviri Sayısı</div>
              <div className="text-base font-semibold">{translationCount}</div>
            </div>
            <div className="glass-soft stats-item text-center">
              <div className="text-xs small-muted">Ortalama</div>
              <div className="text-base font-semibold">{translationCount > 0 ? (totalScore / translationCount).toFixed(1) : '0.0'}/10</div>
            </div>
          </div>
        </header>

        <main className="game-container space-y-6">
          <div className="glass card-padding section">
            <h2 className="section-title">Text to translate ({sourceLanguage.nativeName}):</h2>
            <div className="source-text bg-[rgba(255,255,255,0.96)] p-4 rounded-md border border-[rgba(15,23,42,0.04)]">
            {isGeneratingText ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '1.2rem', color: '#667eea' }}>🤖 Generating new text...</div>
              </div>
            ) : (
              currentText
            )}
          </div>

          <div className="word-buttons-row">
            <button
              className="help-btn inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)]"
              onClick={handleHelpClick}
              disabled={helpLoading}
            >
              {helpLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              <span>{helpLoading ? 'Loading...' : (showHelp ? 'Hide HELP' : 'HELP')}</span>
            </button>
            <span className="timer">{startTime && !showReview ? `Time: ${elapsedSeconds}s` : (timeTaken !== null ? `Took: ${timeTaken}s` : '')}</span>
          </div>

          {showHelp && wordButtons && wordButtons.length > 0 && (
            <div className="word-buttons flex flex-wrap gap-2 mt-3">
              {(() => {
                const LIMIT = 8
                const list = showMoreWords ? wordButtons : wordButtons.slice(0, LIMIT)
                return list.map((w, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-sm"
                    title={`${w.simple} → ${w.translation || '—'}`}
                    onClick={() => handleWordClick(w)}
                  >
                    {w.translation || '—'}
                  </button>
                ))
              })()}

              {wordButtons.length > 8 && (
                <button
                  className="ml-2 px-3 py-1 rounded-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-sm"
                  onClick={() => setShowMoreWords(prev => !prev)}
                >
                  {showMoreWords ? 'Show less' : `Show more (${wordButtons.length - 8})`}
                </button>
              )}
            </div>
          )}
          {copiedWord && <div className="copied-notice">Copied: {copiedWord}</div>}
        </div>

        <div className="translation-section glass card-padding section">
          <h2 className="section-title">Your translation ({targetLanguage.nativeName}):</h2>
          <textarea
            className="form-input"
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            placeholder={`Write your translation in ${targetLanguage.nativeName}...`}
            rows={6}
            disabled={showReview || isGeneratingText}
          />
        </div>

        <div className="button-section flex justify-center mt-4">
          {!showReview ? (
            <button onClick={handleSubmit} disabled={isLoading || isGeneratingText} className="btn-accent rounded-full py-3 px-8">
              {isLoading ? 'Evaluating...' : 'Submit'}
            </button>
          ) : (
            <button onClick={handleNewText} className="rounded-full py-3 px-8 bg-[rgba(255,255,255,0.04)]">
              New Text
            </button>
          )}
        </div>

        {showReview && aiReview && (
          <div className="review-section glass card-padding section">
            <h2 className="section-title">🤖 AI Değerlendirmesi</h2>
            <div className="review-cards">
              
              {/* Score Card */}
              <div className="review-card glass-soft">
                <div className="card-header">
                  <span className="card-icon">🎯</span>
                  <h3>Puan</h3>
                </div>
                <div className="score-display flex items-center gap-4">
                  <div className="score-circle bg-[rgba(255,255,255,0.04)]">
                    <span className="score-number">{aiReview.score}</span>
                    <span className="score-total">/10</span>
                  </div>
                  <p className="score-text">{aiReview.scoreText}</p>
                </div>
              </div>

              {/* Grammar Errors Card */}
              {aiReview.grammarErrors && aiReview.grammarErrors.length > 0 && (
                <div className="review-card errors-card">
                  <div className="card-header">
                    <span className="card-icon">⚠️</span>
                    <h3>Dilbilgisi Hataları</h3>
                  </div>
                  <ul className="error-list">
                    {aiReview.grammarErrors.map((error, index) => (
                      <li key={index} className="error-item">
                        <span className="error-bullet">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements Card */}
              {aiReview.improvements && aiReview.improvements.length > 0 && (
                <div className="review-card improvements-card">
                  <div className="card-header">
                    <span className="card-icon">💡</span>
                    <h3>İyileştirme Önerileri</h3>
                  </div>
                  <ul className="improvement-list">
                    {aiReview.improvements.map((improvement, index) => (
                      <li key={index} className="improvement-item">
                        <span className="improvement-bullet">✨</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Correct Translation Card */}
              <div className="review-card translation-card">
                <div className="card-header">
                  <span className="card-icon">✅</span>
                  <h3>Doğru Çeviri</h3>
                </div>
                <div className="correct-translation bg-[rgba(255,255,255,0.02)]">
                  {aiReview.correctTranslation}
                </div>
              </div>

              {/* Timing / Adjusted Score Card */}
              <div className="review-card glass-soft">
                <div className="card-header">
                  <span className="card-icon">⏱️</span>
                  <h3>Zaman & Puan</h3>
                </div>
                <div className="timing-content">
                  <div>Answered in: {timeTaken !== null ? `${timeTaken}s` : '—'}</div>
                  <div>Adjusted points for this round: {adjustedScoreLast !== null ? adjustedScoreLast : aiReview.score}/{10}</div>
                </div>
              </div>

              {/* Encouragement Card */}
              <div className="review-card glass-soft">
                <div className="card-header">
                  <span className="card-icon">🌟</span>
                  <h3>Teşvik</h3>
                </div>
                <p className="encouragement-text">{aiReview.encouragement}</p>
              </div>

            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}

export default App
