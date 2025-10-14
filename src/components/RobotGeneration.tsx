import React from "react"
import { motion } from "framer-motion"

const RobotGeneration: React.FC = () => {
    const lines = [0, 1, 2, 3, 4] // represent generated text lines

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                width="180"
                height="180"
                initial={{ y: -10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <defs>
                    <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#90e0ef" />
                        <stop offset="100%" stopColor="#0077b6" />
                    </linearGradient>
                </defs>

                {/* Robot head */}
                <motion.rect
                    x="40"
                    y="60"
                    width="120"
                    height="90"
                    rx="20"
                    fill="url(#headGradient)"
                    stroke="#023047"
                    strokeWidth="4"
                />

                {/* Antenna */}
                <motion.line
                    x1="100"
                    y1="40"
                    x2="100"
                    y2="60"
                    stroke="#023047"
                    strokeWidth="4"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <motion.g
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                >
                    <circle cx="100" cy="40" r="8" fill="#ffb703" />
                </motion.g>

                {/* Eyes */}
                <g>
                    <motion.g
                        animate={{ y: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <circle cx="75" cy="100" r="12" fill="#03045e" />
                        <circle cx="70" cy="95" r="4" fill="#caf0f8" />
                    </motion.g>
                </g>
                <g>
                    <motion.g
                        animate={{ y: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                    >
                        <circle cx="125" cy="100" r="12" fill="#03045e" />
                        <circle cx="120" cy="95" r="4" fill="#caf0f8" />
                    </motion.g>
                </g>

                {/* Mouth typing effect */}
                <motion.rect
                    x="85"
                    y="130"
                    width="30"
                    height="6"
                    rx="3"
                    fill="#023047"
                    animate={{ width: [30, 10, 30] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                />
            </motion.svg>

            {/* Animated text lines appearing below */}
            <div style={{ marginTop: "1rem", width: "200px" }}>
                {lines.map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            height: "12px",
                            background: "#219ebc",
                            borderRadius: "4px",
                            margin: "6px 0",
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: ["0%", "100%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: i * 0.4,
                        }}
                    />
                ))}
            </div>

            <motion.div
                style={{
                    marginTop: "0.5rem",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "center",
                }}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1 }}
            >
                AI is generating a text...
            </motion.div>
        </div>
    )
}

export default RobotGeneration
