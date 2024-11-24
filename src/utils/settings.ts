import { Settings, ExclusionRule, IncomeSource } from '../types';

const SETTINGS_KEY = 'troskovi_settings';

const DEFAULT_EXCLUSION_RULES: ExclusionRule[] = [
  { pattern: 'dušan kuzmanov', enabled: true },
  { pattern: 'dejan ljubinković', enabled: true },
  { pattern: 'kupovina eur', enabled: true },
  { pattern: 'prodaja eur', enabled: true },
  { pattern: '160510010097766726', enabled: true },
  { pattern: '160070010009628724', enabled: true },
  { pattern: 'air serbia', enabled: true },
  { pattern: 'dvorana doma', enabled: true },
  { pattern: 'eurobank', enabled: true }
];

const DEFAULT_INCOME_SOURCES: IncomeSource[] = [
  { name: 'Zencode', pattern: 'zencode', enabled: true },
  { name: 'Lidija Preduzetnik', pattern: 'lidija kuzmanov preduzetnik', enabled: true }
];

export const getSettings = (): Settings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  return {
    exclusionRules: DEFAULT_EXCLUSION_RULES,
    incomeSources: DEFAULT_INCOME_SOURCES
  };
};

export const saveSettings = (settings: Settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const shouldExcludeTransaction = (description: string, settings: Settings): boolean => {
  const lowerDesc = description.toLowerCase();
  return settings.exclusionRules
    .filter(rule => rule.enabled)
    .some(rule => lowerDesc.includes(rule.pattern.toLowerCase()));
};

export const isIncomeFromSource = (description: string, source: IncomeSource): boolean => {
  return source.enabled && description.toLowerCase().includes(source.pattern.toLowerCase());
};