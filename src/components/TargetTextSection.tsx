import clsx from "clsx"
import Textarea from "../ui/textarea"

export default function TargetTextSection(
    { userTranslation, onChange }:
    { userTranslation: string, onChange: (text: string) => void }
) {
    return (
        <section className={clsx([
            'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
            'rounded-3xl', 'p-8', 'shadow-lg', 'mb-6'
        ])}>
          <h3 className='text-sm text-gray-600 mb-3'>Your Translation</h3>
            <Textarea
                value={userTranslation}
                placeholder="Type your translation here..."
                className={clsx([
                    'resize-none', 'border-input', 'placeholder:text-muted-foreground','focus-visible:border-ring', 'focus-visible:ring-ring/20','aria-invalid:ring-destructive/20',
                    'dark:aria-invalid:ring-destructive/40',
                    'aria-invalid:border-destructive', 'dark:bg-input/30', 'flex','field-sizing-content', 'min-h-16', 'w-full', 'rounded-md', 'border','bg-input-background', 'px-3', 'py-2', 'text-lg',
                    'transition-[color,box-shadow]', 'outline-none',
                    'focus-visible:ring-[3px]', 'disabled:cursor-not-allowed','disabled:opacity-50',
                    'min-h-[200px]', 'bg-white/30', 'border-white/40',
                    'rounded-xl', 'shadow-inner'
                ])}
                onChange={(e) => onChange(e.target.value)}
            />
        </section>
    )
}