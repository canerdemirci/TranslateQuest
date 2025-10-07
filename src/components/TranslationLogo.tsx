import clsx from "clsx"
import { Languages, Sparkles } from "lucide-react"

export default function TranslationLogo() {
    return (
        <div className={clsx([
            'flex', 'items-center', 'justify-center', 'gap-3', 'my-16'
        ])}>
            <div className="relative">
                <Languages
                    className={clsx([
                        'w-10', 'h-10', 'text-purple-400',
                        'sm:w-20', 'sm:h-20'
                    ])}
                    strokeWidth={1.5}
                />
                <Sparkles
                    className={clsx([
                        'w-4', 'h-4', 'text-pink-400', 'absolute', '-top-1', '-right-1',
                        'sm:w-8', 'sm:h-8'
                     ])}
                />
            </div>
            <div className="flex flex-col">
                <span className={clsx([
                    'bg-gradient-to-r', 'from-purple-400', 'via-pink-400', 'to-blue-400',
                    'bg-clip-text', 'text-transparent', 'tracking-wide', 'text-xl',
                    'sm:text-2xl'
                ])}>
                    TranslateQuest
                </span>
            </div>
        </div>
    )
}