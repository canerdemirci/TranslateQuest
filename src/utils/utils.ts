import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formattedSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default async function gemini(prompt: string): Promise<AIResponse | never> {
    try {
      const response = await fetch(
        '/api/gemini',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        }
      )

      return await response.json() as AIResponse
    } catch (_) {
      throw new Error('Gemini api error!')
    }
}