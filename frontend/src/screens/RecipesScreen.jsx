import RecipeCard from '../components/RecipeCard';
import recipes from '../data/data';

export default function Recipes() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Naslov */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Istražite recepte
          </h1>

          <p className="text-gray-600">
            Ukupno recepata: {recipes.length}
          </p>
        </div>

        {/* Grid recepata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

      </div>
    </div>
  );
}