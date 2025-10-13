import clsx from "clsx"
import Modal from "./modal"
import { useEffect, useState } from "react"
import { motion } from "motion/react"

type Choice = 'yes' | 'no'

export default function ConfirmationBox(
    { open, text, onClose }: { open: boolean, text: string, onClose: (result: Choice) => void }
) {
    const [closing, setClosing] = useState<boolean>(false)
    const [isClosed, setIsClosed] = useState<boolean>(false)

    useEffect(() => {
        if (!open) {
            setClosing(true)

            const timer = setTimeout(() => {
                setIsClosed(true)
            }, 300)

            return () => clearTimeout(timer)
        } else {
            setIsClosed(false)
            setClosing(false)
        }
    }, [open])

    function handleChoice(choice: Choice) {
        onClose(choice)
    }

    if (isClosed) return null

    return (
        <Modal>
            <motion.div
                className={clsx([
                    "w-8/12", "sm:w-6/12", "p-4", "rounded-lg", "m-auto", "shadow-lg",
                    "bg-white/40", "backdrop-blur-md", "border", "border-white/60"
                ])}
                animate={{ opacity: closing ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <p className="text-xl font-bold text-gray-700 text-center">{text}</p>
                <div
                    className={clsx([
                        "flex", "justify-center", "items-center", "gap-2", "mt-4"
                    ])}
                >
                    <button
                        className={clsx([
                            "w-20", "p-2", "rounded-sm", "bg-green-600", "text-white",
                            "hover:bg-green-700", "cursor-pointer"
                        ])}
                        onClick={() => handleChoice('yes')}
                    >
                        Yes
                    </button>
                    <button
                        className={clsx([
                            "w-20", "p-2", "rounded-sm", "bg-red-600", "text-white",
                            "hover:bg-red-700", "cursor-pointer"
                        ])}
                        onClick={() => handleChoice('no')}
                    >
                        No
                    </button>
                </div>
            </motion.div>
        </Modal>
    )
}