import clsx from "clsx"
import { AlertCircle, Award, CheckCircle2, Clock, Lightbulb, Sparkles } from "lucide-react"
import { formattedSeconds } from "../utils/utils"

export default function AIReviewSection(
    {
        score, scoreText, timeSpent, correctTranslation, grammarErrors, improvements, incentiveText
    }:{
        score: number, scoreText: string, timeSpent: number, correctTranslation: string, 
        grammarErrors: string[], improvements: string[], incentiveText: string
    })
{
    return (
        <section className={clsx([
            'my-8', 'space-y-4', 'animate-in', 'fade-in', 'duration-500'
        ])}>
            {/* Score and Time */}
            <div className="grid grid-cols-2 gap-4">
                <div className={clsx([
                    'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
                    'rounded-2xl', 'p-4', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-700">Score</span>
                    </div>
                    <div className={clsx([
                        'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'bg-clip-text',
                        'text-transparent'
                    ])}>
                        {score}/10
                        <p>{scoreText}</p>
                    </div>
                </div>
                <div className={clsx([
                    'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
                    'rounded-2xl', 'p-4', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-700">Time</span>
                    </div>
                    <div className={clsx([
                        'bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'bg-clip-text',
                        'text-transparent'
                    ])}>
                        {formattedSeconds(timeSpent)}
                    </div>
                </div>
            </div>
            {/* Correct Translation */}
            <div className={clsx([
                'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60', 'rounded-2xl',
                'p-5', 'shadow-lg'
            ])}>
                <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Correct Translation</span>
                </div>
                <p className="text-gray-800">{correctTranslation}</p>
            </div>
            {/* Grammar Errors */}
            {grammarErrors.length > 0 && (
                <div className={clsx([
                    'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
                    'rounded-2xl', 'p-5', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-gray-700">Grammar Errors</span>
                    </div>
                    <ul className="space-y-2">
                        {grammarErrors.map((error, index) => (
                            <li key={index} className={clsx([
                                'text-sm', 'text-gray-700', 'flex', 'items-start', 'gap-2'
                            ])}>
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Improvements */}
            {improvements.length > 0 && (
                <div className={clsx([
                    'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
                    'rounded-2xl', 'p-5', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-gray-700">Improvement Suggestions</span>
                    </div>
                    <ul className="space-y-2">
                        {improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-yellow-500 mt-0.5">•</span>
                            <span>{improvement}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Incentive Text */}
            <div className={clsx([
                'bg-gradient-to-r', 'from-purple-400/30', 'via-pink-400/30',
                'to-blue-400/30', 'backdrop-blur-md', 'border', 'border-white/60',
                'rounded-2xl', 'p-5', 'shadow-lg'
            ])}>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-gray-800 italic">{incentiveText}</p>
            </div>
        </section>
    )
}