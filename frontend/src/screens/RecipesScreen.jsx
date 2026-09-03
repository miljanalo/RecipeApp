import RecipeCard from '../components/RecipeCard';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [mealType, setMealType] = useState('Sve');
  const [difficulty, setDifficulty] = useState('Sve');

  const [sortBy, setSortBy] = useState('najnoviji');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
  fetch('http://localhost:5000/api/recipes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Greška pri učitavanju recepata');
      }

      return response.json();
    })
    .then(data => {
      setRecipes(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Greška:', error);
      setLoading(false);
    });
  }, []);

  // brze kategorije
  const handleMealTypeChange = (type) => {
    setMealType(type);
    setVisibleCount(6);
  };

  //filtriranje i sortiranje
  const filteredRecipes = recipes
    .filter(recipe => {
      // pretraga po naslovu i sastojcima
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        recipe.title?.toLowerCase().includes(searchTerm) ||
        recipe.description?.toLowerCase().includes(searchTerm) ||
        recipe.ingredients?.some(ingredient =>
          ingredient.toLowerCase().includes(searchTerm)
        );

      // filter po tipu obroka
      const matchesMealType =
        mealType === 'Sve' || recipe.mealType === mealType;

      // filter po tezini
      const matchesDifficulty =
        difficulty === 'Sve' || recipe.difficulty === difficulty;

      return matchesSearch && matchesMealType && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'najnoviji':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

        case 'najbolje':
          return (b.rating || 0) - (a.rating || 0);

        case 'najkrace':
          return (a.cookTime || 0) - (b.cookTime || 0);

        case 'az':
          return a.title.localeCompare(b.title);

        case 'za':
          return b.title.localeCompare(a.title);

        default:
          return 0;
      }
    });

  const visibleRecipes = filteredRecipes.slice(0, visibleCount);

  // resetovanje filtera
  const resetFilters = () => {
    setSearch('');
    setMealType('Sve');
    setDifficulty('Sve');
    setSortBy('najnoviji');
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Učitavanje recepata...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-200px)] bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Naslov */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Istražite recepte
          </h1>

        <p className="text-gray-600">
            Pronađite recept koji odgovara vašem ukusu
          </p>
        </div>

        {/* Brze kategorije */}
        <div className="mb-8">

          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Kategorije
          </h2>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => handleMealTypeChange('Sve')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                mealType === 'Sve'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🍽️ Svi obroci
            </button>

            <button
              onClick={() => handleMealTypeChange('Doručak')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                mealType === 'Doručak'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🍳 Doručak
            </button>

            <button
              onClick={() => handleMealTypeChange('Ručak')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                mealType === 'Glavna jela'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🍝 Ručak
            </button>

            <button
              onClick={() => handleMealTypeChange('Večera')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                mealType === 'Supe i čorbe'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🍲 Supe i čorbe
            </button>

            <button
              onClick={() => handleMealTypeChange('Dezert')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                mealType === 'Deserti'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🍰 Dezert
            </button>

            <button
              onClick={() => handleMealTypeChange('Užina')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                mealType === 'Pića'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🍹 Pića
            </button>

          </div>
        </div>

        {/* Pretraga */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔍
            </span>

            <input
              type="text"
              placeholder="Pretražite recepte po nazivu, opisu ili sastojku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>

          {/* filteri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

            {/* tip obroka */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip obroka
              </label>

              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Sve">Svi obroci</option>
                <option value="Glavna jela">Glavna jela</option>
                <option value="Predjela">Predjela</option>
                <option value="Supe i čorbe">Supe i čorbe</option>
                <option value="Salate">Salate</option>
                <option value="Deserti">Deserti</option>
                <option value="Doručak">Doručak</option>
                <option value="Pića">Pića</option>
              </select>
            </div>

            {/* tezina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Težina
              </label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Sve">Sve težine</option>
                <option value="Lako">Lako</option>
                <option value="Srednje">Srednje</option>
                <option value="Teško">Teško</option>
              </select>
            </div>

            {/* sortiranje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sortiraj
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="najnoviji">Najnoviji</option>
                <option value="najbolje">Najbolje ocenjeni</option>
                <option value="najkrace">Najkraće vreme pripreme</option>
                <option value="az">Naziv A-Z</option>
                <option value="za">Naziv Z-A</option>
              </select>
            </div>

          </div>

          {/* reset */}
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-primary font-semibold transition"
            >
              ↻ Resetuj filtere
            </button>
          </div>

        </div>

        {/* rezultati */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Pronađeno:{' '}
            <span className="font-bold text-gray-900">
              {filteredRecipes.length}
            </span>{' '}
            {filteredRecipes.length === 1 ? 'recept' : 'recepata'}
          </p>
        </div>

        {/* nema rezultata */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm py-16 text-center">
            <div className="text-5xl mb-4">🍽️</div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nema pronađenih recepata
            </h2>

            <p className="text-gray-600 mb-6">
              Pokušajte da promenite kriterijume pretrage.
            </p>

            <button
              onClick={resetFilters}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primarydark transition"
            >
              Resetuj filtere
            </button>
          </div>
        ) : (
          <>
          {/* grid recepata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRecipes.map(recipe => (
              <RecipeCard
                key={recipe._id}
                {...recipe}
              />
            ))}
          </div>

          {visibleCount < filteredRecipes.length && (
              <div className="flex justify-center mt-10">

                <button
                  onClick={loadMore}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primarydark transition"
                >
                  Učitaj još
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </motion.div>
  );
}