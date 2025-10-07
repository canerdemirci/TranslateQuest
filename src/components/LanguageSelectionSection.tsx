import clsx from "clsx"
import { ArrowLeftRight } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "../utils/utils"
import { SUPPORTED_LANGUAGES } from "../constants"

export default function LanguageSelectionSection(
    { languages, className, onChange }:
    {
        languages: { code: string, name: string }[],
        className?: string,
        onChange: (source: Language, target: Language, direction: 's-to-t' | 't-to-s') => void
    }
) {
    const [sourceLanguage, setSourceLanguage] = useState(languages[0].code)
    const [targetLanguage, setTargetLanguage] = useState(languages[1].code)
    const [translationDirection, setTranslationDirection] = useState<'s-to-t' | 't-to-s'>('s-to-t')
    
    return (
        <section className={clsx([
            'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
            'rounded-3xl', 'p-6', 'shadow-lg', 'mb-8', className ? className : '',
        ])}>
            <div className={clsx([
                'flex', 'items-center', 'gap-4', 'justify-center'
            ])}>
                <Select
                    value={sourceLanguage}
                    onValueChange={(value) => {
                        setSourceLanguage(value)
                        onChange(
                            SUPPORTED_LANGUAGES.find(spl => spl.code === value)!,
                            SUPPORTED_LANGUAGES.find(spl => spl.code === targetLanguage)!,
                            translationDirection
                        )
                    }}
                >
                    <SelectTrigger className={cn(
                        'w-40', 'bg-white/60', 'backdrop-blur-sm', 'border-white/80',
                        'rounded-xl', 'shadow-md'
                    )}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.filter(l => l.code !== targetLanguage).map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <button
                    className={clsx([
                        'p-2', 'rounded-full', 'bg-gradient-to-r', 'from-purple-500',
                        'to-pink-500', 'hover:from-purple-600', 'hover:to-pink-600',
                        'text-white shadow-lg'
                    ])}
                    onClick={() => {
                        const newSource = targetLanguage
                        const newTarget = sourceLanguage
                        const newDirection = translationDirection === 's-to-t' ? 't-to-s' : 's-to-t'

                        setTranslationDirection(
                            translationDirection === 's-to-t' ? 't-to-s' : 's-to-t')
                        setSourceLanguage(newSource)
                        setTargetLanguage(newTarget)
                        onChange(
                            SUPPORTED_LANGUAGES.find(spl => spl.code === newSource)!,
                            SUPPORTED_LANGUAGES.find(spl => spl.code === newTarget)!,
                            newDirection
                        )
                    }}
                >
                    <ArrowLeftRight className='w-5 h-5' />
                </button>
                <Select
                    value={targetLanguage}
                    onValueChange={(value) => {
                        setTargetLanguage(value)
                        onChange(
                            SUPPORTED_LANGUAGES.find(spl => spl.code === sourceLanguage)!,
                            SUPPORTED_LANGUAGES.find(spl => spl.code === value)!,
                            translationDirection
                        )
                    }}
                >
                    <SelectTrigger className={cn(
                        'w-40', 'bg-white/60', 'backdrop-blur-sm', 'border-white/80',
                        'rounded-xl', 'shadow-md'
                    )}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.filter(l => l.code !== sourceLanguage).map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </section>
    )
}