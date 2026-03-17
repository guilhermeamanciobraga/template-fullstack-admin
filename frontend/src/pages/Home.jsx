import MainLayout from "../layouts/MainLayout"

export default function Home() {
    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-[60vh]">

                <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md text-center">

                    <h2 className="text-2xl font-semibold text-gray-800">
                        Sistema Base 🚀
                    </h2>

                    <p className="mt-4 text-gray-500">
                        Template clean para iniciar qualquer projeto.
                    </p>

                </div>

            </div>
        </MainLayout>
    )
}