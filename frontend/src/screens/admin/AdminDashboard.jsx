import { useEffect, useState } from 'react';
import { getToken } from '../../services/authService';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        recipes: 0,
        comments: 0
    });

    const [recentUsers, setRecentUsers] = useState([]);
    const [recentRecipes, setRecentRecipes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = getToken();

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [statsResponse, usersResponse, recipesResponse] =
                    await Promise.all([
                        fetch('http://localhost:5000/api/admin/stats', {
                            headers
                        }),
                        fetch('http://localhost:5000/api/admin/users', {
                            headers
                        }),
                        fetch('http://localhost:5000/api/admin/recipes', {
                            headers
                        })
                    ]);

                const statsData = await statsResponse.json();
                const usersData = await usersResponse.json();
                const recipesData = await recipesResponse.json();

                if (!statsResponse.ok) {
                    throw new Error(
                        statsData.message || 'Greška pri učitavanju statistike.'
                    );
                }

                if (!usersResponse.ok) {
                    throw new Error(
                        usersData.message || 'Greška pri učitavanju korisnika.'
                    );
                }

                if (!recipesResponse.ok) {
                    throw new Error(
                        recipesData.message || 'Greška pri učitavanju recepata.'
                    );
                }

                setStats(statsData);

                setRecentUsers(usersData.slice(0, 5));
                setRecentRecipes(recipesData.slice(0, 5));

            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);


    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Dashboard
                </h1>

                <p className="text-gray-500">
                    Učitavanje podataka...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Dashboard
                </h1>

                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard
            </h1>

            <p className="text-gray-500 mb-8">
                Dobrodošli u administratorski panel!
            </p>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Korisnici */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">
                        Ukupno korisnika
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.users}
                    </p>
                </div>


                {/* Recepti */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">
                        Ukupno recepata
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.recipes}
                    </p>
                </div>


                {/* Komentari */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">
                        Ukupno komentara
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.comments}
                    </p>
                </div>

            </div>

            {/* Nedavno registrovani korisnici */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-10">

                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Nedavno registrovani korisnici
                    </h2>
                </div>

                <div className="divide-y divide-gray-100">

                    {recentUsers.length === 0 ? (
                        <p className="px-6 py-5 text-gray-500">
                            Nema registrovanih korisnika.
                        </p>
                    ) : (
                        recentUsers.map(user => (
                            <Link
                                key={user._id}
                                to={`/profile/${user._id}`}
                                className="px-6 py-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium text-gray-800 hover:text-orange-600 transition">
                                        {user.firstName} {user.lastName}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        @{user.username}
                                    </p>
                                </div>

                                <span className="text-sm text-gray-500">
                                    {user.role === 'admin'
                                        ? 'Admin'
                                        : 'Korisnik'}
                                </span>
                            </Link>
                        ))
                    )}

                </div>
            </div>


            {/* Nedavno dodati recepti */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">

                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Nedavno dodati recepti
                    </h2>
                </div>

                <div className="divide-y divide-gray-100">

                    {recentRecipes.length === 0 ? (
                        <p className="px-6 py-5 text-gray-500">
                            Nema dodatih recepata.
                        </p>
                    ) : (
                        recentRecipes.map(recipe => (
                            <Link
                                key={recipe._id}
                                to={`/recipes/${recipe._id}`}
                                className="px-6 py-4 flex items-center justify-between"
                            >

                                <div className="flex items-center gap-4">

                                    {recipe.image ? (
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                            🍳
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-medium text-gray-800 hover:text-orange-600 transition">
                                            {recipe.title}
                                        </p>

                                        {recipe.author && (
                                            <p className="text-sm text-gray-500">
                                                @{recipe.author.username}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <span className="text-sm text-gray-500">
                                    {recipe.cookTime} min
                                </span>

                            </Link>
                        ))
                    )}

                </div>
            </div>

        </div>
    );
}