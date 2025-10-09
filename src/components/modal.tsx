import clsx from "clsx"

export default function Modal({ children }: { children: React.ReactNode }) {
    return (
        <div className={clsx([
            "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        ])}>
            {children}
        </div>
    )
}