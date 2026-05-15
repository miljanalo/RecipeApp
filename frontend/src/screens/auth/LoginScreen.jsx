import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginScreen({setUser}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      
      // Privremeno 
      if (formData.email && formData.password) {
        const fakeUser = {
          username: 'markomarkovic',
          email: formData.email
        };

        localStorage.setItem('user', JSON.stringify(fakeUser));

        setUser(fakeUser);

        navigate('/');
      }
      
    } catch (err) {
  console.log(err);
  setError('Greška pri prijavi');
} finally {
      setLoading(false);
    }
  };
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍳</div>
          <h2 className="text-3xl font-bold text-gray-900">RecipeBook</h2>
          <p className="text-gray-600 mt-2">Prijavite se na svoj nalog</p>
        </div>
 
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
 
        {/* forma */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email adresa
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarydark focus:border-transparent outline-none transition"
              placeholder="primer@email.com"
            />
          </div>
 
          {/* lozinka */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Lozinka
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
 
          {/* zapamti me */}
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primarydark border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-textsiva">
              Zapamti me
            </label>
          </div>
 
          {/* dugme za prijavu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primarydark transition disabled:opacity-50"
          >
            {loading ? 'Prijava u toku...' : 'Prijava'}
          </button>
        </form>
 
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">ili</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
 
        {/* alternativne prijave */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <button type="button" className="bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            Google
          </button>
          
        </div>
 
        {/* registracija*/}
        <p className="text-center text-gray-600">
          Nemate nalog?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Registrujte se
          </Link>
        </p>
 
        {/* zaboravljena lozinka */}
        <p className="text-center mt-4">
          <Link to="#" className="text-sm text-primary hover:underline">
            Zaboravili ste lozinku?
          </Link>
        </p>
      </div>
    </motion.div>
  );
}