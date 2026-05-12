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
    rating: 4.8,
    difficulty: 'Srednje',
    cookTime: 20
  },
  {
    id: 2,
    title: 'Riblja Čorba',
    image: corbaImg,
    author: 'Jelena Jelenković',
    rating: 4.9,
    difficulty: 'Teško',
    cookTime: 45
  },
  {
    id: 3,
    title: 'Tiramisu',
    image: tiramisuImg,
    author: 'Milan Milić',
    rating: 4.7,
    difficulty: 'Srednje',
    cookTime: 30
  },
  {
    id: 4,
    title: 'Piletina sa Povrćem',
    image: piletinaImg,
    author: 'Petra Petrović',
    rating: 4.6,
    difficulty: 'Lako',
    cookTime: 35
  }
];

export default recipes;