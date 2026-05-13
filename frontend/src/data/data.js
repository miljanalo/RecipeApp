import tiramisuImg from '../assets/images/tiramisuImg.jpg'
import corbaImg from '../assets/images/corbaImg.jpg'
import piletinaImg from '../assets/images/piletinaImg.jpg'
import spageteImg from '../assets/images/spageteImg.jpg'


const recipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    image: spageteImg,
    author: 'Marko Marković',
    description: 'Kremasta pasta sa hrskavom pancetom, sirom i bogatim ukusom italijanske kuhinje. Brz i ukusan klasik savršen za svaki dan.',
    rating: 4.8,
    difficulty: 'Srednje',
    mealType: 'Pasta',
    likes: 234,
    saves: 23,
    cookTime: 20,
    servings: 4,
    ingredients: [
      '400g špageta',
      '200g guanciale ili pancete',
      '4 jaja',
      '100g Pecorino Romano sira',
      'crni biber',
      'so'
    ],
    instructions: [
      'Skuvajte špagete u posoljenoj vodi prema uputstvu sa pakovanja, dok ne budu al dente.',
  
      'Guanciale ili pancetu isecite na manje komade i pržite na srednjoj temperaturi dok ne postane hrskavo.',
  
      'U posebnoj posudi umutite jaja, rendani Pecorino Romano sir i malo crnog bibera.',
  
      'Kada su špagete gotove, sačuvajte malo vode od kuvanja, a zatim ih ocedite.',
  
      'Dodajte špagete u tiganj sa guancialeom i kratko promešajte.',
  
      'Sklonite tiganj sa vatre pa dodajte mešavinu jaja i sira. Brzo mešajte kako biste dobili kremasti sos.',
  
      'Po potrebi dodajte malo vode od kuvanja kako bi sos bio svilenkast i kremast.',
  
      'Poslužite odmah uz dodatni sir i sveže mleveni crni biber.'
    ],
    comments: [
      {
        id: 1,
        author: 'Ana Anić',
        text: 'Odličan recept!',
        date: '2024-01-15',
        rating: 5
      },
      {
        id: 2,
        author: 'Petar Perović',
        text: 'Veoma brzo i jednostavno!',
        date: '2024-01-14',
        rating: 4
      }
    ]
  },

  {
    id: 2,
    title: 'Riblja Čorba',
    image: corbaImg,
    author: 'Jelena Jelenković',
    rating: 4.9,
    difficulty: 'Teško',
    cookTime: 45,
    ingredients:[],
    instructions: [],
    comments: []
  },
  {
    id: 3,
    title: 'Tiramisu',
    image: tiramisuImg,
    author: 'Milan Milić',
    rating: 4.7,
    difficulty: 'Srednje',
    cookTime: 30,
    ingredients:[],
    instructions: [],
    comments: []
  },
  {
    id: 4,
    title: 'Piletina sa Povrćem',
    image: piletinaImg,
    author: 'Petra Petrović',
    rating: 4.6,
    difficulty: 'Lako',
    cookTime: 35,
    ingredients:[],
    instructions: [],
    comments: []
  }
];

export default recipes;