import { motion } from "motion/react"
import Modal from "./modal"
import clsx from "clsx"
import { useEffect, useState } from "react"
import RobotGeneration from "./RobotGeneration"

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

    if (isClosed || (!open && !isClosed))  return null

    return (
        <Modal>
            <motion.div
                className={clsx([
                    "m-auto", "bg-transparent",
                ])}
                animate={{ opacity: closing ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <RobotGeneration />
            </motion.div>
        </Modal>
    )
}