import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import profilePlaceholder from '../assets/images/blank-profile-picture-973460-1-1-1024x1024-1.png';
import { getUser, getToken } from '../services/authService';

export default function UserProfileScreen() {
    const { id } = useParams();

    const loggedInUser = getUser();
    const loggedInUserId = loggedInUser?.id || loggedInUser?._id;
    const isOwnProfile = loggedInUserId === id;

    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserProfile();
        checkFollowStatus();
    }, [id]);

    const fetchUserProfile = async () => {
        try {
        const response = await fetch(
            `http://localhost:5000/api/users/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Greška pri učitavanju profila');
        }

        setUser(data.user);
        setRecipes(data.recipes);

        } catch (error) {
        console.error('Greška:', error);
        setError(error.message);
        } finally {
        setLoading(false);
        }
    };

    const checkFollowStatus = async () => {
        try {
        const token = getToken();

        if (!token) {
            return;
        }

        const response = await fetch(
            `http://localhost:5000/api/users/${id}/follow-status`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await response.json();

        if (response.ok) {
            setIsFollowing(data.isFollowing);
        }

        } catch (error) {
        console.error('Greška pri proveri praćenja:', error);
        }
    };

    const handleFollow = async () => {
        try {
        const token = getToken();

        if (!token) {
            alert('Morate biti prijavljeni.');
            return;
        }

        const method = isFollowing ? 'DELETE' : 'POST';

        const response = await fetch(
            `http://localhost:5000/api/users/${id}/follow`,
            {
            method,
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Greška pri promeni praćenja');
        }

        setIsFollowing(!isFollowing);

        setUser(prev => ({
            ...prev,
            followers: isFollowing
            ? prev.followers.filter(follower => follower._id !== loggedInUser)
            : [...prev.followers, { _id: loggedInUserId }]
        }));

        } catch (error) {
        console.error('Greška:', error);
        alert(error.message);
        }
    };

    if (loading) {
        return (
        <div className="text-center py-20">
            <p className="text-xl text-gray-600">
            Učitavanje profila...
            </p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="text-center py-20">
            <p className="text-red-600 text-xl">
            {error}
            </p>
        </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">

                {/* PROFIL */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                        {/* Profilna slika */}
                        <div className="flex-shrink-0">
                            <img
                                src={user.profilePicture || profilePlaceholder}
                                alt={user.username}
                            className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                            />
                        </div>

                        {/* Podaci */}
                        <div className="flex-1 text-center md:text-left">

                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h1>

                            <p className="text-gray-500 mt-1">
                                @{user.username}
                            </p>

                            {user.bio && (
                                <p className="text-gray-700 mt-4 max-w-xl">
                                    {user.bio}
                                </p>
                            )}

                            {/* Statistika */}
                            <div className="flex justify-center md:justify-start gap-8 mt-6">

                                <div className="text-center">
                                    <p className="text-2xl font-bold">
                                        {recipes.length}
                                    </p>
                                    <p className="text-gray-500">
                                        Recepti
                                    </p>
                                </div>

                            <div className="text-center">
                                <p className="text-2xl font-bold">
                                    {user.followers.length}
                                </p>
                                <p className="text-gray-500">
                                    Pratioci
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-2xl font-bold">
                                    {user.following.length}
                                </p>
                                <p className="text-gray-500">
                                    Prati
                                </p>
                            </div>


                            {/* Follow dugme */}
                            {!isOwnProfile && (
                                <button
                                    onClick={handleFollow}
                                    className={`px-6 py-3 rounded-lg font-bold transition ${
                                    isFollowing
                                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        : 'bg-[#668363] text-white hover:bg-[#556f53]'
                                    }`}
                                >
                                    {isFollowing ? '✓ Pratim' : '+ Prati'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* RECEPTI */}
            <div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Recepti korisnika
                </h2>

                {recipes.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center">
                    <p className="text-gray-500 text-lg">
                        Ovaj korisnik još nema objavljenih recepata.
                    </p>
                </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map(recipe => (
                                <RecipeCard
                                    key={recipe._id}
                                    {...recipe}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}