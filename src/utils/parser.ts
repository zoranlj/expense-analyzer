import { parse } from 'date-fns';
import { Transaction } from '../types';
import { getCategories } from './categories';

// Fixed exchange rates
export const EUR_RATE = 117.2;
export const USD_RATE = 107.5;
export const HUF_RATE = 0.3;

function parseCreditCardAmount(amount: string): { value: number; currency: string } {
  const cleanAmount = amount.trim().replace(/\s/g, '');
  const matches = cleanAmount.match(/([-\d.,]+)\s*([A-Z]+)/);
  
  if (!matches) return { value: 0, currency: 'RSD' };
  
  const [, numStr, currency] = matches;
  const value = parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
  
  return { value, currency };
}

function convertToRSD(amount: number, currency: string): number {
  switch (currency) {
    case 'EUR':
      return amount * EUR_RATE;
    case 'USD':
      return amount * USD_RATE;
    case 'HUF':
      return amount * HUF_RATE;
    default:
      return amount;
  }
}

export function parseTransactions(rawData?: string): Transaction[] {
  console.log('Starting transaction parsing');
  const transactions: Transaction[] = [];

  if (!rawData) {
    console.log('No raw data provided');
    return transactions;
  }

  // Split the CSV data into lines and remove empty lines
  const lines = rawData.split('\n').filter(line => line.trim());


  // Skip the header row if it exists
  const startIndex = lines[0].includes('Datum') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      // Split by comma (CSV format) or tab
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');

      // Extract data from parts
      const date = parts[0]?.trim();
      const type = parts[1]?.trim();
      const description = parts[2]?.trim();
      const amount = parts[3]?.trim();

      if (!date || !description || !amount) {
        console.log('Skipping invalid line - missing required fields:', {
          date,
          type,
          description,
          amount
        });
        continue;
      }

      // Parse date considering different formats
      let parsedDate: Date;
      try {
        // Try DD.MM.YYYY format
        const [day, month, year] = date.split('.');
        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } catch (error) {
        console.error('Error parsing date:', date);
        continue;
      }

      // Parse amount
      const cleanAmount = amount
        .replace(' RSD', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

      const parsedAmount = parseFloat(cleanAmount);

      if (isNaN(parsedAmount)) {
        console.log('Invalid amount:', amount);
        continue;
      }

      const transaction: Transaction = {
        date: parsedDate,
        type: type || 'Unknown',
        description,
        amount: parsedAmount,
        amountEur: parsedAmount / EUR_RATE,
        category: categorizeTransaction(description)
      };

      console.log('Successfully parsed transaction:', {
        date: transaction.date.toISOString(),
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category
      });

      transactions.push(transaction);
    } catch (error) {
      console.error('Error parsing transaction:', {
        line,
        error: error.message,
        stack: error.stack
      });
    }
  }

  console.log(`Successfully parsed ${transactions.length} transactions`);

  return transactions;
}

function categorizeTransaction(description: string): string {
  const upperDesc = description.toUpperCase();
  const categories = getCategories();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => upperDesc.includes(keyword))) {
      return category;
    }
  }
  
  return 'Razno';
}