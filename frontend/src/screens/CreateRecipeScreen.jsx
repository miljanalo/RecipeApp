import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/cloudinaryService';
import { getToken } from '../services/authService';

export default function AddRecipe() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookTime: '',
    servings: '',
    difficulty: 'Srednje',
    mealType: 'Obroci',
    image: null,
    imagePreview: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, value) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index, value) => {
    setFormData(prev => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = value;
      return { ...prev, instructions: newInstructions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Naslov recepta je obavezan!');
      return;
    }

    setLoading(true);

    try {
      const token = getToken();

      if (!token) {
        setError('Morate biti prijavljeni da biste dodali recept.');
        return;
      }

      let imageUrl = '';

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const recipeData = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        cookTime: Number(formData.cookTime),
        servings: Number(formData.servings),
        difficulty: formData.difficulty,
        mealType: formData.mealType,
        image: imageUrl
      };

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Greška pri dodavanju recepta');
      }
      
      console.log('Uspešno dodat recept:', data);

      navigate('/recipes');

    } catch (err) {
      console.error('Greška pri dodavanju recepta:', err);
      setError(err.message || 'Greška pri dodavanju recepta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Naslov */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          ➕ Dodaj novi recept
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          💡 Savet:
          Navedite tačne količine sastojaka i jasne korake kako bi drugi korisnici lakše pratili recept.
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Osnovne informacije
            </h2>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Naslov recepta
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Unesite naziv recepta..."
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Opis
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Unesite opis recepta..."
              />
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Slika
              </label>
              <div className="flex gap-4">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Detalji */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Vreme pripreme (min)
                </label>
                <input
                  id="cookTime"
                  name="cookTime"
                  type="number"
                  value={formData.cookTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="30"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                  Broj Porcija
                </label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="4"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Težina
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option>Lako</option>
                  <option>Srednje</option>
                  <option>Teško</option>
                </select>
              </div>

              <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
                  Vrsta Obroka
                </label>
                <select
                  id="mealType"
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option>Glavna jela</option>
                  <option>Predjela</option>
                  <option>Supe i čorbe</option>
                  <option>Salate</option>
                  <option>Deserti</option>
                  <option>Doručak</option>
                  <option>Pića</option>
                </select>
              </div>
            </div>
          </section>

          {/* SASTOJCI */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Sastojci
            </h2>

            <div className="space-y-3 mb-4">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Sastojak ${index + 1}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Ukloni
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addIngredient}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              + Dodaj sastojak
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Način pripreme
            </h2>

            <div className="space-y-3 mb-4">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    rows="2"
                    placeholder={`Korak ${index + 1}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition self-start"
                    >
                      Ukloni
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addInstruction}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              + Dodaj korak
            </button>
          </section>

          <div className="flex gap-4 pt-8 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primarydark transition disabled:opacity-50"
            >
              {loading ? 'Objavljivanje...' : 'Objavi Recept'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}