import clsx from "clsx"
import { ClipboardPaste, HeartHandshake } from "lucide-react"

export default function SourceTextSection(
    { sourceText, onPaste, onHelp }:
    { sourceText: string, onPaste: (text: string) => void, onHelp: () => void }
) {
    return (
        <section className={clsx([
            'bg-white/40', 'backdrop-blur-md', 'border', 'border-white/60',
            'rounded-3xl', 'p-8', 'shadow-lg', 'mb-6'
        ])}>
            <div className={clsx(['flex', 'items-start', 'justify-between'])}>
                <h3 className='text-lg font-bold text-gray-500 mb-3'>Source Text</h3>
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={onHelp}
                        title="Show Hints"
                        className="cursor-pointer"
                    >
                        <HeartHandshake className="text-green-600 hover:text-green-700"  />
                    </button>
                    <button
                        onClick={async () => {
                            const text = await navigator.clipboard.readText()
                            if (onPaste) onPaste(text)
                        }}
                        title="Copy to clipboard"
                        className="cursor-pointer"
                    >
                        <ClipboardPaste className="text-gray-500 hover:text-black"  />
                    </button>
                </div>
            </div>
            <p className='text-gray-800 text-lg'>{sourceText}</p>
        </section>
    )
}