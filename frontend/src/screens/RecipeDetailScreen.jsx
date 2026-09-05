import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken, getUser } from '../services/authService';

export default function RecipeDetail() {

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Lako':
        return 'bg-green-100 text-green-800';
      case 'Srednje':
        return 'bg-yellow-100 text-yellow-800';
      case 'Teško':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();
  
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  // da li je recept sacuvan

  useEffect(() => {
    const checkIfSaved = async () => {
        try {
          const token = getToken();

          if (!token || !recipe?._id) {
            return;
          }

          const response = await fetch(
            'http://localhost:5000/api/users/me/saved-recipes',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (!response.ok) {
            throw new Error('Greška pri učitavanju sačuvanih recepata');
          }

          const savedRecipes = await response.json();

          const alreadySaved = savedRecipes.some(
            savedRecipe => savedRecipe._id === recipe._id
          );

          setIsSaved(alreadySaved);

        } catch (error) {
            console.error('Greška pri proveri sačuvanog recepta:', error);
        }
    };
    checkIfSaved();
  }, [recipe]);

  // ucitavanje recepta
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/recipes/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Recept nije pronađen');
        }

        return response.json();
      })
      .then(data => {
        setRecipe(data);
        setLikesCount(data.likes?.length || 0);
        setLoading(false);

        const user = getUser();

        if (user) {
            const userId = user.id || user._id;

            const alreadyLiked = data.likes?.some(
                id => id.toString() === userId.toString()
            );
            
            setIsLiked(alreadyLiked);

            const userRatingData = data.ratings?.find(
                rating => rating.user.toString() === userId.toString()
            );

            if (userRatingData) {
                setUserRating(userRatingData.value);
            }
        }
      })
      .catch(error => {
        console.error('Greška pri učitavanju recepta:', error);
        setLoading(false);
      });
  }, [id]);

  // uzima ulogovaog korisnika

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = getToken();

        if (!token) {
          return;
        }

        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Greška pri učitavanju korisnika');
        }

        const data = await response.json();

        setCurrentUser(data);

      } catch (error) {
        console.error('Greška pri učitavanju korisnika:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  //loading

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Učitavanje recepta...
      </div>
    );
  }

  if (!recipe) {
    return (
     <div className="text-center py-20 text-gray-600">
      Recept nije pronađen.
     </div>
    );
  }

  const isAuthor =
  currentUser &&
  recipe.author &&
  currentUser._id === recipe.author._id;

  const handleSave = async () => {
    try {
      const token = getToken();

      if (!token) {
          alert('Morate biti prijavljeni da biste sačuvali recept.');
          return;
      }

      setSaving(true);

      const method = isSaved ? 'DELETE' : 'POST';

      const response = await fetch(
        `http://localhost:5000/api/users/me/saved-recipes/${recipe._id}`,
          {
            method,
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Greška pri čuvanju recepta'
        );
      }

      setIsSaved(!isSaved);

      setRecipe(prev => ({
      ...prev,
      saves: data.saves
    }));

    } catch (error) {
        console.error('Greška:', error);
        alert(error.message);
    } finally {
        setSaving(false);
    }
  };

  //lajkovanje
  const handleLike = async () => {
    const token = getToken();

    if (!token) {
        alert('Morate biti prijavljeni da biste lajkovali recept.');
        return;
    }

    try {
        setLoadingLike(true);

        const method = isLiked ? 'DELETE' : 'POST';

        const response = await fetch(
            `http://localhost:5000/api/recipes/${id}/like`,
            {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Greška pri lajkovanju recepta');
        }

        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);

    } catch (error) {
        console.error('Greška pri lajkovanju:', error);
        alert(error.message);
    } finally {
        setLoadingLike(false);
    }
  };

  //rejting
  const handleRating = async (ratingValue) => {
    const token = getToken();

    if (!token) {
        alert('Morate biti prijavljeni da biste ocenili recept.');
        return;
    }

    try {
        setRatingLoading(true);

        const response = await fetch(
            `http://localhost:5000/api/recipes/${id}/rating`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating: ratingValue
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Greška pri ocenjivanju recepta'
            );
        }

        // cuvamo korisnikovu ocenu
        setUserRating(data.userRating);

        // azuriramo prosecnu ocenu
        setRecipe(prev => ({
            ...prev,
            rating: data.rating
        }));

    } catch (error) {
        console.error('Greška pri ocenjivanju:', error);
        alert(error.message);
    } finally {
        setRatingLoading(false);
    }
  };

  //brisanje recepta - korisnik ciji je recept
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Da li ste sigurni da želite da obrišete ovaj recept?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert('Morate biti prijavljeni.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/recipes/${recipe._id}`,
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
          data.message || 'Greška pri brisanju recepta'
        );
      }

      alert('Recept je uspešno obrisan.');

      navigate('/recipes');

    } catch (error) {
      console.error('Greška pri brisanju recepta:', error);
      alert(error.message);
    }
  };

  //komentarisanje
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Komentar ne može biti prazan.');
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert('Morate biti prijavljeni da biste ostavili komentar.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            text: newComment
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Greška pri dodavanju komentara'
        );
      }

      setRecipe(data);

      setNewComment('');

    } catch (error) {
      console.error('Greška pri dodavanju komentara:', error);
      alert(error.message);
    }
  };

  // brisanje komentara
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
        'Da li ste sigurni da želite da obrišete ovaj komentar?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const token = getToken();

        const response = await fetch(
          `http://localhost:5000/api/recipes/${recipe._id}/comments/${commentId}`,
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
                data.message || 'Greška pri brisanju komentara.'
            );
        }

        setRecipe(prev => ({
            ...prev,
            comments: prev.comments.filter(
                comment => comment._id !== commentId
            )
        }));

    } catch (error) {
        console.error('Greška pri brisanju komentara:', error);
        alert(error.message);
    }
  };
 
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* dugme za nazad */}
        <button
          onClick={() => navigate('/recipes')}
          className="text-primary hover:text-primarydark font-semibold mb-6 flex items-center gap-2"
        >
          ← Nazad na recepte
        </button>
 
        {/* slika */}
        <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-96 object-cover"
          />
          
          {/* Like i save */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={`p-3 rounded-full transition ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-red-500 hover:bg-red-50'
              }`}
            >
              ❤️
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`p-3 rounded-full transition ${
                isSaved
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 hover:bg-blue-50'
              }`}
            >
              🔖
            </button>
          </div>
        </div>

        {isAuthor && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigate(`/recipes/${recipe._id}/edit`)}
              className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primarydark transition"
            >
              ✏️ Izmeni recept
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              🗑️ Obriši recept
            </button>
          </div>
        )}
 
        {/* sekcija ispod slike */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          
          {/* naslov */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {recipe.title}
          </h1>
          <p className="text-gray-600 mb-6">
            Autor: <Link to={`/profile/${recipe.author?._id}`} className="font-semibold text-gray-900 hover:text-[#668363] transition">
              {recipe.author?.firstName} {recipe.author?.lastName}
            </Link>
          </p>
 
          {/* lajkovi, saveovi,... */}
          <div className="flex gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
            </span>

            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
              {recipe.mealType}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-bold text-lg">{recipe.rating}/5</div>
                <div className="text-sm text-gray-600">Ocena</div>
              </div>
            </div>
 
            <div className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <div>
                <div className="font-bold text-lg">{likesCount}</div>
                <div className="text-sm text-gray-600">Lajkovi</div>
              </div>
            </div>
 
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔖</span>
              <div>
                <div className="font-bold text-lg">{recipe.saves}</div>
                <div className="text-sm text-gray-600">Sačuvano</div>
              </div>
            </div>
 
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-bold text-lg">{recipe.cookTime} min</div>
                <div className="text-sm text-gray-600">Vreme pripreme</div>
              </div>
            </div>
 
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <div>
                <div className="font-bold text-lg">{recipe.servings}</div>
                <div className="text-sm text-gray-600">Broj porcija</div>
              </div>
            </div>
          </div>
 
          <p className="text-gray-700 mb-6 text-lg">
            {recipe.description}
          </p>
          
        </div>

        {/* Ocena korisnika */}
        <div className=" mb-7">
          <h3 className="font-semibold text-gray-900 mb-2">
            Vaša ocena
          </h3>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={ratingLoading}
                className={`text-3xl transition ${
                  star <= userRating
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {userRating > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Vaša ocena: {userRating}/5
            </p>
          )}
        </div>
 
        {/* grid sa dve sekcije */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* leva sekcija */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* uputstvo zapripremu */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Način pripreme
              </h2>
 
              <div className="space-y-6">
                {recipe.instructions?.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-700">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* komentari */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Komentari ({recipe.comments?.length || 0})
              </h2>
 
              {/* forma za novi */}
              <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                  placeholder="Napišite komentar..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarydark outline-none resize-none"
                />
                <button
                  type="submit"
                  className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primarydark transition"
                >
                  Objavi komentar
                </button>
              </form>
 
              {/* svi komentari */}
              <div className="space-y-6">
                {recipe.comments?.map(comment => (
                  <div key={comment._id} className="pb-6 border-b last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">
                        {comment.author?.firstName} {comment.author?.lastName}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {new Date(comment.date).toLocaleDateString('sr-RS')}
                        </span>

                        {(
                            user?.role === 'admin' ||
                            (comment.author?._id || comment.author)?.toString() ===
                            (user?.id || user?._id)?.toString()
                          ) && (
                            <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                                Obriši
                            </button>
                        )}
                      
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* desna sekcija */}
          <aside>
            {/* sastojci */}
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sastojci
              </h2>
 
              <div className="space-y-3 mb-6">
                {recipe.ingredients?.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <input
                      type="checkbox"
                      id={`ingredient-${index}`}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <label htmlFor={`ingredient-${index}`} className="cursor-pointer">
                      {ingredient}
                    </label>
                  </div>
                ))}
              </div>
 
              {/* print i save */}
              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition font-semibold mb-4">
                📥 Preuzmi recept
              </button>
 
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                🖨️ Štampaj recept
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}