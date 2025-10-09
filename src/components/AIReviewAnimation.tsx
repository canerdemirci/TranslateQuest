import { AnimatePresence, motion, Variants } from "motion/react"
import Modal from "./modal"
import { useEffect, useState } from "react"
import clsx from "clsx"

// Generate random dashes with different colors and widths
const generateDashLines = () => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F472B6']
    const lines: React.ReactNode[] = []
    const lineCount = Math.floor(Math.random() * 2) + 5 // 5 or 6 lines

    for (let i = 0; i < lineCount; i++) {
        const dashCount = Math.floor(Math.random() * 10) + 10 // 10–20 dashes per line
        const dashes = Array.from({ length: dashCount }, (_) => ({
            color: colors[Math.floor(Math.random() * colors.length)],
            width: Math.random() * 50 + 15, // Random width between 5px and 15px
        }))

        lines.push(
            <div key={i} className="flex space-x-1">
                {dashes.map((dash, j) => (
                    <motion.div
                        key={`${i}-${j}`}
                        style={{
                            display: 'inline-block',
                            backgroundColor: dash.color,
                            width: dash.width,
                            height: '5px',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            borderRadius: '5px',
                            marginBottom: '2px',
                            marginTop: '2px',
                        }}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: j * 0.05 }}
                    />
                ))}
            </div>
        )
    }
    return lines
}


export default function AIReviewAnimation(
    { open, onComplete }: { open: boolean, onComplete: () => void }
) {
    const [isReviewing, setIsReviewing] = useState<boolean>(true)
    const [isComplete, setIsComplete] = useState<boolean>(false)
    const [startClosingAnim, setStartClosingAnim] = useState<boolean>(false)

    useEffect(() => {
        if (open) {
            setStartClosingAnim(true)

            const timer = setTimeout(() => {
                onComplete()
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [onComplete, open])

    useEffect(() => {
        if (isReviewing) {
            const timer = setTimeout(() => {
                setIsReviewing(false)
                setIsComplete(true)
            }, 4000) // Adjust duration based on text length

            return () => clearTimeout(timer)
        }
    }, [isReviewing])

    // Magnifying glass variants: scales and moves
    const glassVariants: Variants = {
        idle: { scale: 1, x: 0 },
        scanning: {
            x: [0, '100%'],
            scale: [1, 1.1, 1],
            transition: { duration: 4, ease: 'easeInOut' },
        },
        complete: { scale: 1.2, rotate: 360, transition: { duration: 0.5 } },
    }

    // Text container: dash lines fade in
    const textVariants: Variants = {
        initial: { opacity: 0.5 },
        reviewing: { opacity: 1 },
        complete: { opacity: 1 },
    }

    return (
        <Modal>
            <motion.div
                className="w-11/12 sm:w-6/12 m-auto bg-gray-800 rounded-xl"
                animate={{ opacity: startClosingAnim ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* Dash Lines Container */}
                <motion.div
                    className={clsx([
                        "relative", "bg-gray-800", "p-4", "rounded-xl", "border",
                        "border-gray-700", "overflow-hidden"
                    ])}
                    variants={textVariants}
                    initial="initial"
                    animate={isReviewing ? 'reviewing' : isComplete ? 'complete' : 'initial'}
                >
                    <div className="space-y-2">{generateDashLines()}</div>
                    {/* Magnifying Glass Overlay (Larger) */}
                    <AnimatePresence>
                        {isReviewing && (
                            <motion.div
                                className="absolute top-2 left-0 w-16 h-16"
                                variants={glassVariants}
                                initial="idle"
                                animate="scanning"
                                exit="complete"
                            >
                                {/* Glass Circle */}
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="24"
                                        stroke="#fff"
                                        strokeWidth="5"
                                        fill="rgba(59, 130, 246, 0.1)"
                                    />
                                    {/* Handle */}
                                    <rect
                                        x="38"
                                        y="38"
                                        width="28"
                                        height="8"
                                        rx="3"
                                        fill="#a63b11"
                                        transform="rotate(45, 38, 38)"
                                    />
                                    {/* Inner glow animation */}
                                    <motion.circle
                                        cx="32"
                                        cy="32"
                                        r="16"
                                        fill="none"
                                        stroke="#60A5FA"
                                        strokeWidth="3"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{
                                            duration: 2, repeat: Infinity, ease: 'linear'
                                        }}
                                    />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Scanned Highlight (underline) */}
                    {isReviewing && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-blue-400 opacity-70"
                            initial={{ width: 0, x: 0 }}
                            animate={{ width: '100%', x: 0 }}
                            transition={{ duration: 4, ease: 'easeInOut' }}
                        />
                    )}
                </motion.div>
                {/* Status Message */}
                <AnimatePresence>
                    {isComplete && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="m-4 text-center text-green-400 font-semibold"
                        >
                            ✅ Review Almost Complete...
                            &nbsp;<span className="text-yellow-400">Good Luck !</span>
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </Modal>
    )
}