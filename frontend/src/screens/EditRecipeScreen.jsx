import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '../services/cloudinaryService';

export default function EditRecipe() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookTime: '',
    servings: '',
    difficulty: 'Srednje',
    mealType: 'Glavna jela',
    image: null,
    imagePreview: null
  });

  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // učitavanje postojećeg recepta
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/recipes/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Greška pri učitavanju recepta'
          );
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          ingredients: data.ingredients?.length
            ? data.ingredients
            : [''],
          instructions: data.instructions?.length
            ? data.instructions
            : [''],
          cookTime: data.cookTime || '',
          servings: data.servings || '',
          difficulty: data.difficulty || 'Srednje',
          mealType: data.mealType || 'Glavna jela',
          image: null,
          imagePreview: data.image || null
        });

        setLoadingRecipe(false);

      } catch (error) {
        console.error(
          'Greška pri učitavanju recepta:',
          error
        );

        setError(error.message);
        setLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // promena slike
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

  const updateIngredient = (index, value) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];

      newIngredients[index] = value;

      return {
        ...prev,
        ingredients: newIngredients
      };
    });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        ''
      ]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(
        (_, i) => i !== index
      )
    }));
  };

  const updateInstruction = (index, value) => {
    setFormData(prev => {
      const newInstructions = [...prev.instructions];

      newInstructions[index] = value;

      return {
        ...prev,
        instructions: newInstructions
      };
    });
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        ''
      ]
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter(
        (_, i) => i !== index
      )
    }));
  };

  // čuvanje izmena
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error(
          'Morate biti prijavljeni.'
        );
      }

      // postojeća slika
      let imageUrl = formData.imagePreview || '';

      // ako je korisnik izabrao novu sliku,
      // uploadujemo je na Cloudinary
      if (formData.image) {
        imageUrl = await uploadImage(
          formData.image
        );
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

      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(recipeData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Greška pri izmeni recepta'
        );
      }

      console.log(
        'Recept uspešno izmenjen:',
        data
      );

      navigate(`/recipes/${id}`);

    } catch (error) {
      console.error(
        'Greška pri izmeni recepta:',
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  if (loadingRecipe) {
    return (
      <div className="text-center py-20 text-gray-600">
        Učitavanje recepta...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          ✏️ Izmeni recept
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8 space-y-8"
        >

          {/* osnovne informacije */}

          <section>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Osnovne informacije
            </h2>

            <div className="mb-6">

              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Naslov recepta
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />

            </div>

            <div className="mb-6">

              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Opis
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />

            </div>

            {/* slika */}

            <div className="mb-6">

              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Slika
              </label>

              <div className="flex gap-4 items-center">

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

            {/* detalji */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div>

                <label
                  htmlFor="cookTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vreme pripreme (min)
                </label>

                <input
                  id="cookTime"
                  name="cookTime"
                  type="number"
                  value={formData.cookTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />

              </div>

              <div>

                <label
                  htmlFor="servings"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Broj porcija
                </label>

                <input
                  id="servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />

              </div>

              <div>

                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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

                <label
                  htmlFor="mealType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vrsta obroka
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

          {/* sastojci */}

          <section>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Sastojci
            </h2>

            <div className="space-y-3 mb-4">

              {formData.ingredients.map(
                (ingredient, index) => (

                  <div
                    key={index}
                    className="flex gap-2"
                  >

                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Sastojak ${index + 1}...`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />

                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeIngredient(index)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Ukloni
                      </button>
                    )}

                  </div>

                )
              )}

            </div>

            <button
              type="button"
              onClick={addIngredient}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              + Dodaj sastojak
            </button>

          </section>

          {/* instrukcije */}

          <section>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Način pripreme
            </h2>

            <div className="space-y-3 mb-4">

              {formData.instructions.map(
                (instruction, index) => (

                  <div
                    key={index}
                    className="flex gap-2"
                  >

                    <span className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </span>

                    <textarea
                      value={instruction}
                      onChange={(e) =>
                        updateInstruction(
                          index,
                          e.target.value
                        )
                      }
                      rows="2"
                      placeholder={`Korak ${index + 1}...`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />

                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeInstruction(index)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition self-start"
                      >
                        Ukloni
                      </button>
                    )}

                  </div>

                )
              )}

            </div>

            <button
              type="button"
              onClick={addInstruction}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              + Dodaj korak
            </button>

          </section>

          {/* dugmad */}

          <div className="flex gap-4 pt-8 border-t">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primarydark transition disabled:opacity-50"
            >
              {loading
                ? 'Čuvanje izmena...'
                : 'Sačuvaj izmene'}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/recipes/${id}`)
              }
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
