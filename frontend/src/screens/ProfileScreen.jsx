import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import profilePlaceholder from '../assets/images/blank-profile-picture-973460-1-1-1024x1024-1.png';
import { uploadImage } from '../services/cloudinaryService';

export default function Profile() {
  
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);  
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profilePicture: ''
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingSavedRecipes, setLoadingSavedRecipes] = useState(true);

  const [activeTab, setActiveTab] = useState('recipes');
  
 //ucitavanje profila

  useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    setLoadingProfile(false);
    return;
  }

  fetch('http://localhost:5000/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Greška pri učitavanju profila');
      }

      return data;
    })
    .then(data => {
      setProfileData(data);
      setFormData(data);
      setLoadingProfile(false);
    })
    .catch(error => {
      console.error('Greška pri učitavanju profila:', error);
      setLoadingProfile(false);
    });
  }, []);

  //ucitavanje korisnikovih recepata

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoadingRecipes(false);
      return;
    }
  
    fetch('http://localhost:5000/api/users/me/recipes', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    })
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Greška pri učitavanju recepata');
      }

      return data;
    })
    .then(data => {
      setRecipes(data);
      setLoadingRecipes(false);
    })
    .catch(error => {
      console.error('Greška pri učitavanju recepata:', error);
      setLoadingRecipes(false);
    });
  }, []);

  //ucitavanje savuvanih recepata

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoadingSavedRecipes(false);
      return;
    }
    
    fetch('http://localhost:5000/api/users/me/saved-recipes', { 
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || 'Greška pri učitavanju sačuvanih recepata'
        ); 
      } 
      return data; 
    }) 
    .then(data => {
      setSavedRecipes(data);
      setLoadingSavedRecipes(false);
    })
    .catch(error => {
      console.error(
        'Greška pri učitavanju sačuvanih recepata:',
        error
      );
      setLoadingSavedRecipes(false);
    });
  },[]);

  //izmena profila

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //cuvanje profila
 
  const handleSave = async () => {
    try {
      setSavingProfile(true);

      const token = localStorage.getItem('token');

      let profilePictureUrl = formData.profilePicture;
        
      if (profileImage) {
        profilePictureUrl = await uploadImage(profileImage);
      }

      const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              bio: formData.bio,
              profilePicture: profilePictureUrl
          })
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Greška pri izmeni profila');
      }

      setProfileData(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        bio: data.bio || '',
        profilePicture: data.profilePicture || ''
      });

      setProfileImage(null);
      setProfileImagePreview('');

      localStorage.setItem('user', JSON.stringify(data));

      setIsEditing(false);

    } catch (error) {
      console.error('Greška pri izmeni profila:', error);
    }
  };

  // izbor profilne slike

  const handleProfileImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setProfileImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  }
};

  //loadng

  if (loadingProfile) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Učitavanje profila...
        </p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">
          Nije moguće učitati profil.
        </p>
      </div>
    );
  }

  //render

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* prvi div */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* profilna */}
            <div className="flex-shrink-0">
              <img
                src={profileData.profilePicture || profilePlaceholder}
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
                  <div className="text-2xl font-bold text-primary">{recipes.length}</div>
                  <div className="text-sm text-gray-600">Recepti</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{savedRecipes.length}</div>
                  <div className="text-sm text-gray-600">Sačuvano</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.followers?.length || 0}</div>
                  <div className="text-sm text-gray-600">Pratioci</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData.following?.length || 0}</div>
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
                  disabled={savingProfile}
                  className="bg-svetlija text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                >
                  {savingProfile 
                    ? 'Čuvanje...'
                    : '✅ Sačuvaj'
                  }
                </button>
                
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ 
                      firstName: profileData.firstName || '',
                      lastName: profileData.lastName || '',
                      bio: profileData.bio || '',
                      profilePicture: profileData.profilePicture || '' 
                    });
                    setProfileImage(null);
                    setProfileImagePreview('');
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

                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2" >
                    Profilna slika
                  </label>
                  <div className="flex items-center gap-6">
                      <img
                        src={
                          profileImagePreview ||
                          profileData.profilePicture ||
                          profilePlaceholder
                        }
                        alt="Profilna slika"
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                      />
                      <div>
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                        />

                        <label
                          htmlFor="profileImage"
                          className="inline-block bg-gray-200 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
                        >
                          📷 Izaberi sliku
                        </label>

                      </div>
                    </div>
                </div>
              </div>
            )}        
        </div>
 
        {/* treci div */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b flex gap-4 px-8">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-4 font-semibold ${
                activeTab === 'recipes'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gary-gray-900'}`}
            >
              Moji Recepti
            </button>
            
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 font-semibold ${
                activeTab === 'saved' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900' }`}
            >
              Sačuvano
            </button>

            <button className="py-4 font-semibold text-gray-600 hover:text-gray-900">
              Aktivnost
            </button>
          </div>
 
          {/* mojii recepti */}
          
          {activeTab === 'recipes' &&(
            <div className="p-8">
              {loadingRecipes ? (
                <p className="text-gray-600"> Učitavanje recepata...
                </p>
              ) : recipes.length === 0 ? (
              
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">
                    Još uvek nemate nijedan recept.
                  </p>
                  <button
                    onClick={() => navigate('/add-recipe')}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primarydark transition" >
                      ➕ Dodaj prvi recept
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map(recipe => (
                    <RecipeCard
                      key={recipe._id}
                      {...recipe}
                    />
                  ))}
                </div> 
              )}
            </div>
          )}

          {/* sacuvani recepti  */}

          {activeTab === 'saved' && (
            <div className="p-8">
              {loadingSavedRecipes ? (
                <p className="text-gray-600">
                  Učitavanje sačuvanih recepata...
                </p>
              ) : savedRecipes.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600">
                    Još uvek nemate sačuvane recepte.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe._id}
                      {...recipe}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}