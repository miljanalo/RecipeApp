import { useEffect, useState } from 'react';
import { getToken } from '../../services/authService';

export default function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        recipes: 0,
        comments: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = getToken();

                const response = await fetch(
                    'http://localhost:5000/api/admin/stats',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Greška pri učitavanju statistike.');
                }

                setStats(data);

            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
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

        </div>
    );
}