export interface Transaction {
  date: Date;
  type: string;
  description: string;
  amount: number;
  amountEur: number;
  category: string;
}

export interface CategoryTotal {
  category: string;
  total: number;
  totalEur: number;
  percentage: number;
}

export interface ExclusionRule {
  pattern: string;
  enabled: boolean;
}

export interface IncomeSource {
  name: string;
  pattern: string;
  enabled: boolean;
}

export interface Settings {
  exclusionRules: ExclusionRule[];
  incomeSources: IncomeSource[];
}

export interface CategoryData {
  [key: string]: string[];
}