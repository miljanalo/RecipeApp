import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../data/profiledata';
import placeholder from '../assets/images/placeholder.jpg';
import recipes from '../data/data';
import RecipeCard from '../components/RecipeCard';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(profile);
 
  const [formData, setFormData] = useState(profileData);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 
  const handleSave = async () => {
    setProfileData(formData);
    setIsEditing(false);
  };
 
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* prvi div */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* profilna */}
            <div className="flex-shrink-0">
              <img
                src={profileData.profilePicture}
                alt={profileData.username}
                className="w-32 h-32 rounded-full border-4 border-primary object-cover"
              />
            </div>
 
            {/* ime, user */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-textsiva">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-primary text-lg mb-4">
                @{profileData.username}
              </p>
              <p className="text-textsvetlosiva mb-6">
                {profileData.bio}
              </p>
 
              {/* pratioci, recepti,... */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.myRecipes}</div>
                  <div className="text-sm text-gray-600">Recepti</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.savedRecipes}</div>
                  <div className="text-sm text-gray-600">Sačuvano</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.followers}</div>
                  <div className="text-sm text-gray-600">Pratioci</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.following}</div>
                  <div className="text-sm text-gray-600">Pratim</div>
                </div>
              </div>

            </div>
          </div>

        </div>
 
          
        {/* drugi div */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">

          <div className="flex flex-wrap gap-4">
    
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-svetlija text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                >
                  ✏️ Uredi Profil
                </button>
              ) : (
                <>
                <button
                  onClick={handleSave}
                  className="bg-svetlija text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                >
                  ✅ Sačuvaj
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profileData);
                  }}
                  className="bg-svetlija text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                >
                    ❌ Otkaži
                </button>
                </>
                )}
                <button
                  onClick={() => navigate('/add-recipe')}
                  className="bg-svetlija text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                >
                  ➕ Novi Recept
                </button>
            </div>
          </div>

          {/* forma za izmenu profila */}
            {isEditing && (
              <div className="mt-8 pt-8 border-t space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Uredi Profil</h2>
          
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Ime
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
                    />
                  </div>
          
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prezime
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
                    />
                  </div>
                </div>
          
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Biografija
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
                  />
                </div>
              </div>
            )}        
        </div>
 
        {/* treci div */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b flex gap-4 px-8">
            <button className="py-4 font-semibold text-primary border-b-2 border-primary">
              Moji Recepti
            </button>
            <button className="py-4 font-semibold text-gray-600 hover:text-gray-900">
              Sačuvano
            </button>
            <button className="py-4 font-semibold text-gray-600 hover:text-gray-900">
              Aktivnost
            </button>
          </div>
 
          {/* mojii recepti */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </div>

          {/* posle dodati i ostale  */}

        </div>
      </div>
    </div>
  );
}