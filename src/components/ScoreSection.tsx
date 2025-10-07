import clsx from "clsx"
import { Trophy, Hash, TrendingUp, TimerIcon } from 'lucide-react'

function noNaN(value: number) {
    return isNaN(value) ? 0 : value
}

function ScoreBox(
    { icon, caption, score, isFixed = false }:
    { icon: React.ReactElement, caption: string, score: number, isFixed?: boolean }
) {
    return (
        <div className="relative group">
            <div className={clsx([
                'w-20', 'h-20', 'flex', 'items-center', 'justify-center',
                'relative', 'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
                'rounded-2xl', 'shadow-lg', 'hover:shadow-xl', 'transition-all', 'duration-300',
                'sm:w-30', 'sm:h-30'
            ])}>
                <div className={clsx(['flex', 'flex-col', 'items-center', 'gap-2'])}>
                    <div className='text-purple-400'>{icon}</div>
                    <div className='text-center'>
                        <span className={clsx([
                            'hidden', 'text-xs', 'text-gray-600', 'mb-1',
                            'sm:inline-block'
                        ])}>
                            {caption}
                        </span>
                        <div className={clsx([
                            'bg-gradient-to-r', 'from-purple-500', 'via-pink-500',
                            'to-blue-500', 'bg-clip-text', 'text-transparent'
                        ])}>
                            {isFixed ? score.toFixed(2) : score}
                        </div>
                    </div>
                </div>
                <div className={clsx([
                    'absolute', 'inset-0', 'rounded-2xl', 'bg-gradient-to-br',
                    'from-purple-400/20', 'via-pink-400/20', 'to-blue-400/20',
                    'opacity-0', 'group-hover:opacity-100', 'transition-opacity',
                    'duration-300', '-z-10', 'blur-xl'
                ])}></div>
            </div>
        </div>
    )
}

function TimerBox({ time }: { time: string }) {
    return (
        <div className={clsx([
            'flex', 'items-center', 'justify-center', 'gap-2',
            'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
            'rounded-full', 'px-5', 'py-2.5', 'shadow-lg'
        ])}>
            <TimerIcon className='w-5 h-5 text-purple-500' />
            <span className={clsx([
                'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'bg-clip-text','text-transparent', 'tabular-nums'
            ])}>
                {time}
            </span>
        </div>
    )
}

export default function ScoreSection(
    { totalScore, totalTranslations, time }:
    { totalScore: number, totalTranslations: number, time: string }
) {
    return (
        <section className={clsx([
            'flex', 'flex-col', 'items-center', 'justify-between', 'gap-8', 'my-8',
            'sm:flex-row', 'sm:items-start', 'sm:gap-0'
        ])}>
            <div className={clsx([
                'flex', 'gap-4'
            ])}>
                <ScoreBox
                    icon={<Trophy className='w-5 h-5 text-purple-500' />}
                    caption='Total Score'
                    score={totalScore}
                />
                <ScoreBox
                    icon={<Hash className='w-5 h-5 text-purple-500' />}
                    caption='Translations'
                    score={totalTranslations}
                />
                <ScoreBox
                    icon={<TrendingUp className='w-5 h-5 text-purple-500' />}
                    caption='Average'
                    score={noNaN(totalScore/totalTranslations)}
                    isFixed={true}
                />
            </div>
            <TimerBox time={time} />
        </section>
    )
}