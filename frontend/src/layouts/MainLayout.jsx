import ThemeToggle from "../components/ThemeToggle"

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

            <header className="bg-black text-white dark:bg-gray-800 px-6 py-4 shadow flex justify-between">
                <h1 className="text-lg font-semibold">
                    Meu Template Base 🚀
                </h1>
                <ThemeToggle />
            </header>

            <main className="flex-1 container mx-auto p-6 text-gray-800 dark:text-gray-200">
                {children}
            </main>

            <footer className="bg-gray-200 dark:bg-gray-800 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} - Template Base
            </footer>

        </div>
    )
}