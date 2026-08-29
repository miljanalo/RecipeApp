import RecipeCard from '../components/RecipeCard';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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
            Ukupno recepata: {recipes.length}
          </p>
        </div>

        {/* Grid recepata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe._id} {...recipe} />
          ))}
        </div>

      </div>
    </motion.div>
  );
}