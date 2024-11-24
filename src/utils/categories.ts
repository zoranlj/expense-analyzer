import { CategoryData } from '../types';
import { cloneDeep } from 'lodash';

const CATEGORIES_KEY = 'troskovi_categories';

const DEFAULT_CATEGORIES: CategoryData = {
  'Radnje': ['RADNJA', 'UNIVEREXPORT', 'MAXI', 'IDEA', 'LIDL', 'MARKET', 'CITY', 'MASARIKOVA 4', 'NPANCEVO', 'DADO', 'MILOVANOVIC', 'TASIN KUTAK', 'TAMPA', 'PEKARA', 'OLEA', 'MILOSA OBRENOVICA 10', ' MP'],
  'Restorani': ['RESTORAN', 'RESTAURANT', 'CAFE', 'PIZZA', 'MCDONALDS', 'BURGER', 'COFFEE', 'KUTKO', 'GLOVOAPP', 'BORNEO', 'LALINSKI', 'NARCIS', 'DVORISTE', 'TRECI', 'NICEFOODS', 'WALTER', 'TRGOCENTAR', 'PORTO', 'SAVSKA PIVNICA', 'AMBASADOR'],
  'Računi': ['EPS', 'VODOVOD', 'TELEKOM', 'HIGIJENA', 'JKP', 'SRPSKE KABLOVSKE MREZE', 'YETTEL', 'NAKN', 'POREZ', 'BELEZNIK', 'IFIX'],
  'Benzin': ['GAZPROM', 'MOL', 'SHELL', 'EKO', 'PARKING', 'PLINARA', 'OMV'],
  'Insignija': ['ZOKI', 'NIKI', ' PG ', 'BAGRDAN', 'KRNJESEVCI', 'PREDUZBEOGRAD', 'GARAZA', 'VEPP'],
  'Šoping': ['SPORT', 'FASHION', 'KIDS', 'FOOT LOCKER', 'ALIEXPRESS', 'TEMU', 'AVIVA PARK', 'ETSY', 'BIG', 'NEW SHANGHA', 'DECATHLON', 'URADI SAM', 'SINSAY', 'DEICHMANN', 'TEHNOMEDIA', 'OUTLET', 'DEXY', 'IRIS 8888', 'JYSK', 'WOBY', 'AVIV', 'ZEMUN PARK', 'PREMAZ', 'OVS', ' PS ', 'RESERVED', 'METRO', 'NEW YORKER', 'OBUCA', 'LPP', 'ĆALIĆ', ' RP ', 'DELI', 'LCWAIKIKI', 'DDARCH'],
  'Zdravlje': ['DRMAX', 'APOTEKA', 'BEO-LAB', 'TILIA', 'BIOMEDICA', 'BENU', 'ORDINA', 'STOMATOLOG', 'FARMANEA', 'MAELIA', 'HIRUR', 'VALERIJANA'],
  'Higijena': ['PARFIMERIJA', 'DM FILIJALA', 'LILY'],
  'Zabava': ['UPLATA NA KREDITNU KARTICU', 'GOOGLE', '544358******8011'],
  'Bankomati': ['ATM', 'POS-U', 'MICROSOFT*SKYPE'],
  'Putovanja': ['BOOKING', ' ME ', ' HR ', ' AT ', ' SK ', ' BA ', ' RO ', ' HU ', 'SKIJALISTA', 'JP PUTEVI'],
  'Blamike': ['FACEBK', 'ĆIRIĆ', 'STAKIĆ', 'GOJKOVIĆ', 'STYLISH', 'POZAMANTERIJA', 'VELUR', 'MIHAILOVIĆ', 'KOTON', 'SARAH DREAM'],
  'Ikea': ['IKEA'],
  'Deca': ['RUSLANA', 'STATOVAC', 'SKOLA', 'KNJIZARA', 'BIROELEKTRONIK', 'WIZARD', 'BARBUS', 'M&G', 'BOJ KOMERC', 'CDR', 'ALDI', 'ZMAJ', 'MACURA', 'KOLAROV', 'ROBLOX'],
  'Nije trošak': ['AIR SERBIA', 'DVORANA DOMA SIN', 'EUROBANK']
};

let categoriesData: CategoryData = loadCategories();

function loadCategories(): CategoryData {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
  return DEFAULT_CATEGORIES;
}

function saveCategories(categories: CategoryData) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    categoriesData = categories;
  } catch (error) {
    console.error('Error saving categories:', error);
  }
}

export const getCategories = (): CategoryData => categoriesData;

export const updateCategories = (categories: CategoryData) => {
  saveCategories(categories);
};

export const moveKeyword = (keyword: string, fromCategory: string, toCategory: string): CategoryData => {
  const updatedCategories = cloneDeep(categoriesData);
  
  // Remove keyword from source category
  const sourceKeywords = updatedCategories[fromCategory];
  const keywordIndex = sourceKeywords.findIndex(k => k.trim() === keyword);
  if (keywordIndex !== -1) {
    sourceKeywords.splice(keywordIndex, 1);
  }

  // Add keyword to target category
  if (!updatedCategories[toCategory].includes(keyword)) {
    updatedCategories[toCategory].push(keyword);
  }

  saveCategories(updatedCategories);
  return updatedCategories;
};