import { useEffect, useState } from 'react';
import { getToken } from '../../services/authService';
import { Link } from 'react-router-dom';

export default function AdminRecipes() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const token = getToken();

            const response = await fetch(
                'http://localhost:5000/api/admin/recipes',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Greška pri učitavanju recepata.'
                );
            }

            setRecipes(data);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (recipeId) => {

        const confirmed = window.confirm(
            'Da li ste sigurni da želite da obrišete ovaj recept?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = getToken();

            const response = await fetch(
                `http://localhost:5000/api/admin/recipes/${recipeId}`,
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
                    data.message || 'Greška pri brisanju recepta.'
                );
            }

            setRecipes(prevRecipes =>
                prevRecipes.filter(recipe => recipe._id !== recipeId)
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
                    Recepti
                </h1>

                <p className="text-gray-500">
                    Učitavanje recepata...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Recepti
                </h1>

                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div>

            {/* Naslov */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Recepti
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Pregled svih recepata na platformi.
                    </p>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-500">
                        Ukupno:
                    </span>

                    <span className="font-bold text-gray-800 ml-2">
                        {recipes.length}
                    </span>
                </div>

            </div>


            {/* Tabela */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Recept
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Autor
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Težina
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Vreme
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Akcija
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {recipes.map(recipe => (

                                <tr
                                    key={recipe._id}
                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                >

                                    {/* Recept */}
                                    <td className="px-6 py-4">

                                        <Link
                                            to={`/recipes/${recipe._id}`}
                                            className="flex items-center gap-4"
                                        >

                                            {recipe.image ? (
                                                <img
                                                    src={recipe.image}
                                                    alt={recipe.title}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                                    🍳
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium text-gray-800 hover:text-orange-600 transition">
                                                    {recipe.title}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {recipe.mealType || ' '}
                                                </p>
                                            </div>

                                        </Link>

                                    </td>


                                    {/* Autor */}
                                    <td className="px-6 py-4">

                                        {recipe.author ? (
                                            <Link
                                                to={`/profile/${recipe.author._id}`}
                                                className="block"
                                            >
                                                <p className="font-medium text-gray-800 hover:text-orange-600 transition">
                                                    {recipe.author.firstName} {recipe.author.lastName}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    @{recipe.author.username}
                                                </p>
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">
                                                Nepoznat autor
                                            </span>
                                        )}

                                    </td>


                                    {/* Tezina */}
                                    <td className="px-6 py-4">

                                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {recipe.difficulty}
                                        </span>

                                    </td>


                                    {/* Vreme */}
                                    <td className="px-6 py-4 text-gray-600">
                                        {recipe.cookTime} min
                                    </td>


                                    {/* Brisanje */}
                                    <td className="px-6 py-4">

                                        <button
                                            onClick={() => handleDelete(recipe._id)}
                                            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
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