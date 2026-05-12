import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* O Nama */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">RecipeApp</h4>
            <p className="text-sm">
              Vaša omljena platforma za deljenje i pronalaženje najboljih recepata iz celog sveta.
            </p>
          </div>

          {/* Linkovi */}
          <div>
            <h4 className="text-white font-bold mb-4">Navigacija</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Početna</Link></li>
              <li><Link to="/recipes" className="hover:text-white transition">Recepti</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Registracija</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Prijava</Link></li>
            </ul>
          </div>

          {/* Pomoć */}
          <div>
            <h4 className="text-white font-bold mb-4">Pomoć</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="#" className="hover:text-white transition">Kontakt</Link></li>
              <li><Link to="#" className="hover:text-white transition">Politika Privatnosti</Link></li>
              <li><Link to="#" className="hover:text-white transition">Uslovi Korišćenja</Link></li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2026 RecipeApp
          </p>
        </div>
      </div>
    </footer>
  );
}