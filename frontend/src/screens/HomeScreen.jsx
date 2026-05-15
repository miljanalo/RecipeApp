import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import recipes from '../data/data';
import { motion } from 'framer-motion';


export default function Home({user}) {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* pocetni panel */}
        <section className="bg-gradient-to-r from-primary to-primarydark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Tekst */}
              <div>
                <h1 className="text-5xl font-bold mb-4">
                  {
                    user ? `Dobrodošli nazad, ${user.username}!`
                    : 'Inspiracija za vaš sledeći obrok'
                  }
                </h1>
                <p className="text-xl mb-6 text-textsiva">
                  {
                    user ? 'Šta danas kuvamo?'
                    : 'Pronađi proverene recepte, sačuvaj favorite i istraži nove ukuse zajedno sa zajednicom ljubitelja hrane.'
                  }
                </p>

                <div className="flex gap-4">
                  <Link 
                    to="/recipes"
                    className="bg-white text-primarydark px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                  >
                    Pretraži recepte
                  </Link>

                  {
                    user ? (
                      <Link 
                        to="/add-recipe"
                        className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primarydark transition border-2 border-white"
                      >
                        Dodaj novi recept
                      </Link>
                    ) : (
                      <Link 
                        to="/register"
                        className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primarydark transition border-2 border-white"
                      >
                        Kreiraj nalog
                      </Link>
                    )
                  }
                  
                </div>
              </div>

              {/* ovde posle smisliti nesto */}
              <div className="text-center">
                <div className="text-8xl">🍽️</div>
                <p className="text-lg mt-4 text-orange-100">npr logo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Kartice */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-textsiva">
              Sve na jednom mestu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* 1 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-3 text-textsiva">Pronađi nove recepte</h3>
                <p className="text-textsvetlosiva">
                  Pronađi jela za svaki dan, posebne prilike ili brze obroke kada nemaš mnogo vremena.
                </p>
              </div>

              {/* 2 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-5xl mb-4">👩‍🍳</div>
                <h3 className="text-xl font-bold mb-3 text-textsiva">Podeli svoje ideje</h3>
                <p className="text-textsvetlosiva">
                  Objavi svoje omiljene recepte i inspiriši druge ljubitelje kuvanja.
                </p>
              </div>

              {/* 3 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-xl font-bold mb-3 text-textsiva">Sačuvaj favorite</h3>
                <p className="text-textsvetlosiva">
                  Kreiraj svoju kolekciju recepata kojima ćeš se uvek vraćati.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* recepti */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-textsiva">
              Istaknuti recepti
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                to="/recipes"
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primarydark transition"
              >
                Pogledaj Sve Recepte →
              </Link>
            </div>
          </div>
        </section>

        {/* --------------------- */}
        <section className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Počni da istražuješ nove ukuse</h2>
            <p className="text-xl mb-8 text-textsiva">
              Sačuvaj favorite, pronađi inspiraciju i podeli svoje recepte.
            </p>
            <Link 
              to="/register"
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primarydark transition inline-block"
            >
              Registruj se sada
            </Link>
          </div>
        </section>
    </motion.div>
  );
}