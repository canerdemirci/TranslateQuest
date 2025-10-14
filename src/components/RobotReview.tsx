import React from "react"
import { motion } from "framer-motion"

const RobotReview: React.FC = () => {
    const sparkles = [
        { cx: 40, cy: 30 },
        { cx: 160, cy: 50 },
        { cx: 50, cy: 150 },
        { cx: 150, cy: 140 },
        { cx: 100, cy: 170 },
    ]

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 220 220"
                width="220"
                height="220"
                initial={{ y: -10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <defs>
                    <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#90e0ef" />
                        <stop offset="100%" stopColor="#0077b6" />
                    </linearGradient>

                    <radialGradient id="antennaGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffb703" stopOpacity="1" />
                        <stop offset="100%" stopColor="#fb8500" stopOpacity="0" />
                    </radialGradient>

                    <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Orbiting rings */}
                <motion.ellipse
                    cx="100"
                    cy="100"
                    rx="90"
                    ry="40"
                    stroke="#48cae4"
                    strokeWidth="2"
                    fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                />
                <motion.ellipse
                    cx="100"
                    cy="100"
                    rx="70"
                    ry="25"
                    stroke="#ade8f4"
                    strokeWidth="2"
                    fill="none"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                />

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
                    filter="url(#shadow)"
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
                <motion.circle
                    cx="100"
                    cy="40"
                    r="8"
                    fill="url(#antennaGlow)"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                />

                {/* Eyes */}
                <g>
                    <motion.circle
                        cx="75"
                        cy="100"
                        r="12"
                        fill="#03045e"
                        animate={{ cy: [100, 102, 100] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <circle cx="70" cy="95" r="4" fill="#caf0f8" />
                </g>
                <g>
                    <motion.circle
                        cx="125"
                        cy="100"
                        r="12"
                        fill="#03045e"
                        animate={{ cy: [100, 102, 100] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                    />
                    <circle cx="120" cy="95" r="4" fill="#caf0f8" />
                </g>

                {/* Mouth */}
                <motion.path
                    d="M80 130 Q100 145 120 130"
                    stroke="#023047"
                    strokeWidth="4"
                    fill="transparent"
                    animate={{ d: ["M80 130 Q100 145 120 130", "M80 130 Q100 135 120 130"] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />

                {/* Sparkles */}
                {sparkles.map((s, i) => (
                    <motion.circle
                        key={i}
                        cx={s.cx}
                        cy={s.cy}
                        r="3"
                        fill="#fff"
                        stroke="#ffd60a"
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                    />
                ))}
            </motion.svg>

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
                AI is reviewing your translation...
            </motion.div>
        </div>
    )
}

export default RobotReview
