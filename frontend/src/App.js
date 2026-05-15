import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import { useState } from 'react';

function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser}/>
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user}/>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
