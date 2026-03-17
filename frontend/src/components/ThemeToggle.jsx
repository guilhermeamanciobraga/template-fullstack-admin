import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        return document.documentElement.classList.contains("dark")
    })

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [dark])

    return (
        <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-600 transition"
        >
            {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
    )
}