import { Link } from 'react-router-dom';

export default function RecipeCard({ _id, title, image, author, rating, difficulty, cookTime }) {

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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full">    
      {/* Slika recepta */}
      <Link to={`/recipes/${_id}`}>
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src={image || 'https://via.placeholder.com/300x200?text=Recept'} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        

          {/* Težina pripreme */}
          <div className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </div>
        </div>
      </Link>

      {/* Sadržaj */}
      <div className="p-4">
        {/* Naslov */}
        <Link to={`/recipes/${_id}`}>
          <h3 className="font-bold text-lg text-textsiva mb-2 line-clamp-2 hover:text-orange-600">
            {title}
          </h3>
        </Link>
        

        {/* Autor */}
        <p className="text-sm text-textsvetlosiva mb-3">
          Autor:{' '}
          <Link
            to={`/profile/${author?._id}`}
            className="font-semibold hover:text-[#668363] transition"
          >
            {author?.firstName} {author?.lastName}
          </Link>
        </p>

        {/* Rating i Vreme */}
        <div className="flex justify-between items-center mb-3 pb-3 border-b">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-semibold text-textsiva">{rating}</span>
            <span className="text-sm text-textsvetlosiva">/5</span>
          </div>

          {/* Vreme pripreme */}
          <div className="flex items-center gap-1 text-sm text-textsvetlosiva">
            <span>⏱️</span>
            <span>{cookTime} min</span>
            </div>
          </div>

          {/* Dugme za pregled */}
          <Link 
            to={`/recipes/${_id}`}
            className="block w-full bg-[#668363] text-white py-2 rounded-lg hover:bg-[#556f53] transition font-semibold text-center"
          >
            Pogledaj recept →
          </Link>
        </div>
      </div>
  );
}