import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' })
        }

        const data = { apiKey: process.env.GEMINI_API_KEY }

        res.status(200).json(data)
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Something went wrong" })
    }
}
