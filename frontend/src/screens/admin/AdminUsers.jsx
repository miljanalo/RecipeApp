import { useEffect, useState } from 'react';
import { getToken } from '../../services/authService';

export default function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = getToken();

            const response = await fetch(
                'http://localhost:5000/api/admin/users',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Greška pri učitavanju korisnika.'
                );
            }

            setUsers(data);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (userId) => {

        const confirmed = window.confirm(
            'Da li ste sigurni da želite da obrišete ovog korisnika?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = getToken();

            const response = await fetch(
                `http://localhost:5000/api/admin/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Greška pri brisanju korisnika.'
                );
            }

            setUsers(prevUsers =>
                prevUsers.filter(user => user._id !== userId)
            );

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };


    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Korisnici
                </h1>

                <p className="text-gray-500">
                    Učitavanje korisnika...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Korisnici
                </h1>

                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div>

            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Korisnici
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Pregled registrovanih korisnika.
                    </p>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-500">
                        Ukupno:
                    </span>

                    <span className="font-bold text-gray-800 ml-2">
                        {users.length}
                    </span>
                </div>

            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Ime i prezime
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Username
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Email
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Uloga
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Akcija
                                </th>
                            </tr>

                        </thead>


                        <tbody>

                            {users.map(user => (

                                <tr
                                    key={user._id}
                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </td>


                                    <td className="px-6 py-4 text-gray-600">
                                        @{user.username}
                                    </td>


                                    <td className="px-6 py-4 text-gray-600">
                                        {user.email}
                                    </td>


                                    <td className="px-6 py-4">

                                        {user.role === 'admin' ? (
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Korisnik
                                            </span>
                                        )}

                                    </td>


                                    <td className="px-6 py-4">

                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            disabled={user.role === 'admin'}
                                            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Obriši
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}