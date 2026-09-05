import { Link,  Outlet } from 'react-router-dom';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Admin header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <Link
                        to="/admin"
                        className="text-2xl font-bold text-gray-800"
                    >
                        🍳 RecipeBook Admin
                    </Link>

                    <Link
                        to="/"
                        className="text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                        ← Nazad na aplikaciju
                    </Link>

                </div>
            </header>


            <div className="max-w-7xl mx-auto flex">

                {/* Sidebar */}
                <aside className="w-60 min-h-[calc(100vh-73px)] bg-white border-r border-gray-200 p-5">

                    <nav className="space-y-2">

                        <Link
                            to="/admin"
                            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                            📊 Dashboard
                        </Link>

                        <Link
                            to="/admin/users"
                            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                            👥 Korisnici
                        </Link>

                        <Link
                            to="/admin/recipes"
                            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                            🍳 Recepti
                        </Link>

                    </nav>

                </aside>


                {/* glavni sadrzzaj */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}