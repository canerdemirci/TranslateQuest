import clsx from "clsx"
import { AnimatePresence, motion, useCycle } from "motion/react"
import TranslationLogo from "./TranslationLogo"

const GREETINGS = [
    { lang: 'English', text: 'Welcome' },
    { lang: 'Spanish', text: '¡Hola!' },
    { lang: 'French', text: 'Bienvenue' },
    { lang: 'German', text: 'Willkommen' },
    { lang: 'Italian', text: 'Benvenuto' },
    { lang: 'Portuguese', text: 'Bem-vindo' },
    { lang: 'Japanese', text: 'ようこそ (Yōkoso)' },
    { lang: 'Chinese', text: '欢迎 (Huānyíng)' },
    { lang: 'Russian', text: 'Добро пожаловать (Dobro pozhalovat\')' },
    { lang: 'Arabic', text: 'مرحباً (Marhaban)' },
    { lang: 'Hindi', text: 'नमस्ते (Namaste)' },
    { lang: 'Korean', text: '환영합니다 (Hwan-yeonghamnida)' },
    { lang: 'Swedish', text: 'Välkommen' },
    { lang: 'Greek', text: 'Καλώς ορίσατε (Kalós orísate)' },
    { lang: 'Swahili', text: 'Karibu' },
]

export default function GameLoading() {
    const [x, cycleX] = useCycle(...GREETINGS)

    return (
        <main className={clsx([
            'w-screen', 'h-screen', 'overflow-hidden', 'py-12'
        ])}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
            >
                <TranslationLogo />
            </motion.div>
            <div className="flex items-center justify-center flex-col gap-20 mt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={x.lang}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onAnimationComplete={() => {
                            setTimeout(() => cycleX(), 400);
                        }}
                        style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
                    >
                        {x.text}
                    </motion.div>
                </AnimatePresence>
                <ContinuousWavyText text="Loading..." />
            </div>
        </main>
    )
}

const ContinuousWavyText = ({ text }: { text: string }) => {
    const letters = Array.from(text)

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    style={{
                        display: "inline-block",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.25,
                        delay: index * 0.1,
                        ease: "easeInOut",
                        repeatType: "mirror",
                        repeatDelay: letters.length * 0.1,
                    }}
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </div>
    )
}