import { motion } from "motion/react"
import Modal from "./modal"
import { useEffect, useState } from "react"
import RobotReview from "./RobotReview"

export default function AIReviewAnimation(
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
                className="w-11/12 sm:w-6/12 m-auto"
                animate={{ opacity: closing ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <RobotReview />
            </motion.div>
        </Modal>
    )
}