import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import recipes from '../data/data';

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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
 
  const recipe = recipes.find(recipe => recipe.id === Number(id));

  if (!recipe) {
    return (
     <div className="text-center py-20 text-gray-600">
      Recept nije pronađen.
     </div>
    );
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('Novi komentar:', newComment);
    setNewComment('');
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
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full transition ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-red-500 hover:bg-red-50'
              }`}
            >
              ❤️
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
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
 
        {/* sekcija ispod slike */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          
          {/* naslov */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {recipe.title}
          </h1>
          <p className="text-gray-600 mb-6">
            Autor: <span className="font-semibold text-gray-900">{recipe.author}</span>
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
                <div className="font-bold text-lg">{recipe.likes}</div>
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
                Komentari ({recipe.comments.length || 0})
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
                  <div key={comment.id} className="pb-6 border-b last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{comment.author}</h3>
                      <span className="text-sm text-gray-600">{comment.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < comment.rating ? '★' : '☆'}>
                          {i < comment.rating ? '★' : '☆'}
                        </span>
                      ))}
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