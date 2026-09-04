import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './screens/HomeScreen';
import Recipes from './screens/RecipesScreen';
import AddRecipe from './screens/CreateRecipeScreen';
import RecipeDetail from './screens/RecipeDetailScreen';
import Login from './screens/auth/LoginScreen';
import Register from './screens/auth/RegisterScreen';
import Profile from './screens/ProfileScreen';
import Admin from './screens/admin/AdminDashboard';
import EditRecipe from './screens/EditRecipeScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import { useEffect, useState } from 'react';
import { getToken, getUser, saveUser, clearAuthStorage } from './services/authService';

function App() {

  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const token = getToken();

    if (!token) {
        return;
    }

    fetch('http://localhost:5000/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token nije validan');
            }

            return response.json();
        })
        .then(data => {
            setUser(data);
            saveUser(data);
        })
        .catch(error => {
            console.error('Greška pri proveri korisnika:', error);

            clearAuthStorage();
            setUser(null);
        });
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser}/>
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user}/>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/add-recipe" element={<ProtectedRoute user={user}> <AddRecipe /> </ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>}/>
            <Route path="/admin" element={<ProtectedRoute user={user}><Admin /></ProtectedRoute>}/>
            <Route path="/recipes/:id/edit" element={<ProtectedRoute user={user}><EditRecipe /></ProtectedRoute>}/>
            <Route path="/profile/:id" element={<UserProfileScreen />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
