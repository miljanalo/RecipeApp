import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <Link to="/" className="flex items-center">
            <span className="text-white text-2xl font-bold">RecipeBook</span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-white hover:bg-primarydark px-3 py-2 rounded-md transition">
              Početna
            </Link>

            <Link to="/recipes" className="text-white hover:bg-primarydark px-3 py-2 rounded-md transition">
              Recepti
            </Link>

            <Link to="/profile" className="block text-white hover:bg-primarydark px-3 py-2 rounded-md transition">
              Profil
            </Link>
            
          </div>

          {/* Dugme za meni na manjem ekranu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primarydark focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Padajuca lista za meni na manjem ekranu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-white hover:bg-primarydark px-3 py-2 rounded-md">
              Početna
            </Link>
            <Link to="/recipes" className="block text-white hover:bg-primarydark px-3 py-2 rounded-md">
              Recepti
            </Link>
            <Link to="/profile" className="block text-white hover:bg-primarydark px-3 py-2 rounded-md">
              Profil
            </Link>
            
          </div>
        )}
      </div>
    </nav>
  );
}