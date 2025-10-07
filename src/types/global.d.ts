export {}

declare global {
    type Language = {
        code: string
        name: string
        nativeName: string
    }

    type AIReview = {
        score: number
        scoreText: string
        grammarErrors: string[]
        improvements: string[]
        correctTranslation: string
        encouragement: string
    }
}