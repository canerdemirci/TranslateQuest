import clsx from "clsx"
import { AlertCircle, ArrowDownUp, ArrowUpDown, Award, CheckCircle2, Clock, Lightbulb, ScrollText, Sparkles, Trophy, UserPen } from "lucide-react"
import { formattedSeconds } from "../utils/utils"
import { motion } from "motion/react"

function AnimatedSection(
    { delay, className, children } :
    { delay: number, className: string, children: React.ReactNode }
) {
    return (
        <motion.div
            className={className}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: delay }}
        >
            {children}
        </motion.div>
    )
}

export default function AIReviewSection(
    {
        score, scoreText, timeSpent, bonusFromTime, correctTranslation, userTranslation, sourceText,
        grammarErrors, improvements, incentiveText, ref
    }:{
        score: number, scoreText: string, timeSpent: number, bonusFromTime: number,
        correctTranslation: string, userTranslation: string, sourceText: string,
        grammarErrors: string[], improvements: string[], incentiveText: string,
        ref?: React.RefObject<HTMLElement | null>
    })
{
    return (
        <section ref={ref} className={clsx([
            'my-8', 'space-y-4', 'animate-in', 'fade-in', 'duration-500'
        ])}>
            {/* Score and Incentive Text */}
            <div
                className={clsx([
                    'flex', 'flex-col', 'gap-8',
                    "md:grid", "md:grid-cols-2", "md:gap-4"
                ])}
            >
                <AnimatedSection delay={0} className={clsx([
                    'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
                    'rounded-2xl', 'p-4', 'shadow-lg',
                ])}>
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-700">Score</span>
                    </div>
                    <div className={clsx([
                        'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'bg-clip-text',
                        'text-transparent'
                    ])}>
                        <div className={clsx([
                            "flex", "flex-col", "justify-start", "items-start", "gap-2",
                            "xl:items-center", "xl:flex-row",  "xl:gap-6"
                        ])}>
                            <div className="flex justify-center items-center gap-2">
                                <Clock className="w-5 h-5 inline-block text-black"  />
                                Time: <b>{formattedSeconds(timeSpent)}</b>
                            </div>
                            <div className="flex justify-center items-center gap-2">
                                <Sparkles className="w-5 h-5 inline-block text-black" />
                                AI Score: <b>{score}/10</b>
                            </div>
                            <div className="flex justify-center items-center gap-2">
                                <Trophy className="w-5 h-5 inline-block text-black"  />
                                Bonus from time: <b>{bonusFromTime}</b>
                            </div>
                        </div>
                        <br/>
                        <p>{scoreText}</p>
                    </div>
                </AnimatedSection>
                {/* Incentive Text */}
                <AnimatedSection delay={0.5} className={clsx([
                    'bg-gradient-to-r', 'from-purple-400/30', 'via-pink-400/30',
                    'to-blue-400/30', 'backdrop-blur-md', 'border', 'border-white/60',
                    'rounded-2xl', 'shadow-lg', 'p-4', 'flex', 'flex-col', 'items-center',
                    'justify-center', 'gap-4'
                ])}>
                    <Sparkles className="w-full h-5 text-purple-500 inline-block text-center" />
                    <p className="text-gray-600 italic font-bold text-center">
                        {incentiveText}
                    </p>
                </AnimatedSection>
            </div>
            <div className={clsx([
                'bg-white/10', 'backdrop-blur-md', 'border', 'border-white/60', 'rounded-2xl',
                'p-5', 'shadow-lg', 'flex', 'flex-col', 'items-center', 'gap-4', 'my-10'
            ])}>
                {/* Your Translation */}
                <AnimatedSection delay={1} className={clsx([
                    'bg-white/20', 'backdrop-blur-md', 'border', 'border-white/60', 'rounded-2xl',
                    'p-5', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-3">
                        <UserPen className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-700">Your Translation</span>
                    </div>
                    <div className="text-gray-800">
                        {markDifferences(userTranslation, correctTranslation)}
                    </div>
                </AnimatedSection>
                <ArrowDownUp className="text-center w-full" />
                {/* Source Text */}
                <AnimatedSection delay={1.5} className={clsx([
                    'bg-white/20', 'backdrop-blur-md', 'border', 'border-white/60', 'rounded-2xl',
                    'p-5', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-3">
                        <ScrollText className="w-5 h-5 text-black" />
                        <span className="text-sm text-gray-700">Source Text</span>
                    </div>
                    <p className="text-gray-800">{sourceText}</p>
                </AnimatedSection>
                <ArrowUpDown className="text-center w-full" />
                {/* Correct Translation */}
                <AnimatedSection delay={2} className={clsx([
                    'bg-white/20', 'backdrop-blur-md', 'border', 'border-white/60', 'rounded-2xl',
                    'p-5', 'shadow-lg'
                ])}>
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">Correct Translation</span>
                    </div>
                    <div className="text-gray-800">
                        {markDifferences(correctTranslation, userTranslation)}
                    </div>
                </AnimatedSection>
            </div>
            {/* Grammar Errors */}
            {grammarErrors.length > 0 && (
                <AnimatedSection delay={2.5} className={clsx([
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
                </AnimatedSection>
            )}
            {/* Improvements */}
            {improvements.length > 0 && (
                <AnimatedSection delay={3} className={clsx([
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
                </AnimatedSection>
            )}
        </section>
    )
}

function markDifferences(text1: string, text2: string): React.ReactNode {
    const text1words = text1.split(' ')
    const text2words = text2.split(' ')

    const text1differences: number[] = []
    
    for (let i=0; i<text1words.length; i++) {
        if (!text2words.includes(text1words[i])) text1differences.push(i)
    }

    return <>{text1words.map((w, i) => (
        <span
            key={i}
            className={clsx([
                'inline-block',
                text1differences.includes(i) ? 'bg-yellow-100/50 p-1 rounded-xl mx-1' : ''
            ])}
        >
            {w}&nbsp;
        </span>
    ))}</>
}