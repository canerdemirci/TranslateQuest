import { motion } from "motion/react"
import Modal from "./modal"
import clsx from "clsx"
import { LoaderPinwheel } from "lucide-react"
import { useEffect, useState } from "react"

export default function TextGenerationAnimation(
    { open }: { open: boolean }
) {
    const [closing, setClosing] = useState<boolean>(false)
    const [isClosed, setIsClosed] = useState<boolean>(false)

    useEffect(() => {
        if (!open) {
            setClosing(true)

            const timer = setTimeout(() => {
                setIsClosed(true)
            }, 500)

            return () => clearTimeout(timer)
        } else {
            setIsClosed(false)
            setClosing(false)
        }
    }, [open])

    if (isClosed) return null

    return (
        <Modal>
            <motion.div
                className={clsx([
                    "m-auto", "bg-transparent",
                ])}
                animate={{ opacity: closing ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className={clsx([
                    "flex", "flex-col", "items-center", "justify-center", "gap-1", "m-auto"
                ])}>
                    <motion.div
                        animate={{
                            rotate: 360,
                            color: [
                                "#ff0000",
                                "#00ff00",
                                "#0000ff",
                                "#ffff00",
                                "#ff00ff",
                                "#00ffff",
                                "#ff0000",
                            ]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    >
                        <LoaderPinwheel className="w-20 h-20 m-auto p-4" />
                    </motion.div>
                    <p className="text-center text-white text-sm">Generating...</p>
                </div>
            </motion.div>
        </Modal>
    )
}