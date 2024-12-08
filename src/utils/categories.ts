import { CategoryData } from '../types';
import { cloneDeep } from 'lodash';

const CATEGORIES_KEY = 'troskovi_categories';

const DEFAULT_CATEGORIES: CategoryData = {
  'Radnje': ['radnja', 'univerexport', 'maxi', 'idea', 'lidl', 'market', 'city', 'masarikova 4', 'npancevo', 'dado', 'milovanovic', 'tasin kutak', 'tampa', 'pekara', 'olea', 'milosa obrenovica 10', ' mp'],
  'Restorani': ['restoran', 'restaurant', 'cafe', 'pizza', 'mcdonalds', 'burger', 'coffee', 'kutko', 'glovoapp', 'borneo', 'lalinski', 'narcis', 'dvoriste', 'treci', 'nicefoods', 'walter', 'trgocentar', 'porto', 'savska pivnica', 'ambasador'],
  'Računi': ['eps', 'vodovod', 'telekom', 'higijena', 'jkp', 'srpske kablovske mreze', 'yettel', 'nakn', 'porez', 'beleznik', 'ifix'],
  'Benzin': ['gazprom', 'mol', 'shell', 'eko', 'parking', 'plinara', 'omv'],
  'Insignija': ['zoki', 'niki', ' pg ', 'bagrdan', 'krnjesevci', 'preduzbeograd', 'garaza', 'vepp'],
  'Šoping': ['sport', 'fashion', 'kids', 'foot locker', 'aliexpress', 'temu', 'aviva park', 'etsy', 'big', 'new shangha', 'decathlon', 'uradi sam', 'sinsay', 'deichmann', 'tehnomedia', 'outlet', 'dexy', 'iris 8888', 'jysk', 'woby', 'aviv', 'zemun park', 'premaz', 'ovs', ' ps ', 'reserved', 'metro', 'new yorker', 'obuca', 'lpp', 'ćalić', ' rp ', 'deli', 'lcwaikiki', 'ddarch'],
  'Zdravlje': ['drmax', 'apoteka', 'beo-lab', 'tilia', 'biomedica', 'benu', 'ordina', 'stomatolog', 'farmanea', 'maelia', 'hirur', 'valerijana'],
  'Higijena': ['parfimerija', 'dm filijala', 'lily'],
  'Zabava': ['uplata na kreditnu karticu', 'google', '544358******8011'],
  'Bankomati': ['atm', 'pos-u', 'microsoft*skype'],
  'Putovanja': ['booking', ' me ', ' hr ', ' at ', ' sk ', ' ba ', ' ro ', ' hu ', 'skijalista', 'jp putevi'],
  'Blamike': ['facebk', 'ćirić', 'stakić', 'gojković', 'stylish', 'pozamanterija', 'velur', 'mihailović', 'koton', 'sarah dream'],
  'Ikea': ['ikea'],
  'Deca': ['ruslana', 'statovac', 'skola', 'knjizara', 'biroelektronik', 'wizard', 'barbus', 'm&g', 'boj komerc', 'cdr', 'aldi', 'zmaj', 'macura', 'kolarov', 'roblox'],
  'Nije trošak': ['air serbia', 'dvorana doma sin', 'eurobank']
};

let categoriesData: CategoryData = loadCategories();

export const normalizeKeyword = (keyword: string): string => {
  return keyword.trim().toLowerCase();
};

function loadCategories(): CategoryData {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Object.entries(parsed).reduce((acc, [category, keywords]) => {
        acc[category] = (keywords as string[]).map(normalizeKeyword);
        return acc;
      }, {} as CategoryData);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
  return cloneDeep(DEFAULT_CATEGORIES);
}

function saveCategories(categories: CategoryData) {
  try {
    const normalizedCategories = Object.entries(categories).reduce((acc, [category, keywords]) => {
      acc[category] = keywords.map(normalizeKeyword);
      return acc;
    }, {} as CategoryData);

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(normalizedCategories));
    categoriesData = normalizedCategories;
  } catch (error) {
    console.error('Error saving categories:', error);
  }
}

export const getCategories = (): CategoryData => categoriesData;

export const updateCategories = (categories: CategoryData) => {
  saveCategories(categories);
};

export const findCategoryForKeyword = (keyword: string): string => {
  const normalizedKeyword = normalizeKeyword(keyword);
  
  for (const [category, keywords] of Object.entries(categoriesData)) {
    if (keywords.some(k => normalizedKeyword.includes(normalizeKeyword(k)))) {
      return category;
    }
  }
  
  return 'Razno';
};

export const recategorizeTransactions = (transactions: any[]) => {
  return transactions.map(transaction => ({
    ...transaction,
    category: findCategoryForKeyword(transaction.description)
  }));
};