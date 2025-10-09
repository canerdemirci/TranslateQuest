import clsx from "clsx"
import { ClipboardPaste } from "lucide-react"

export default function SourceTextSection(
    { sourceText, onPaste }: { sourceText: string, onPaste?: (text: string) => void }
) {
    return (
        <section className={clsx([
            'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
            'rounded-3xl', 'p-8', 'shadow-lg', 'mb-6'
        ])}>
            <div className={clsx(['flex', 'items-start', 'justify-between'])}>
                <h3 className='text-sm text-gray-600 mb-3'>Source Text</h3>
                <button
                    onClick={async () => {
                        const text = await navigator.clipboard.readText()
                        if (onPaste) onPaste(text)
                    }}
                    title="Copy to clipboard"
                    className="cursor-pointer, hover:opacity-50"
                >
                    <ClipboardPaste  />
                </button>
            </div>
            <p className='text-gray-800 text-xl'>{sourceText}</p>
        </section>
    )
}