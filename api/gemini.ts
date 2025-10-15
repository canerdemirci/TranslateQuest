import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'

if (!process.env.GEMINI_API_KEY && !process.env.VITE_GEMINI_API_KEY) {
    console.error('Gemini API key not configured')
    throw new Error('Gemini API key not configured')
}

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    })

    res.status(200).json({ aiResponse: response.text } as AIResponse)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message || 'Something went wrong' } as AIResponse)
  }
}
