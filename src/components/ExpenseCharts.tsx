import { IonChip } from '@ionic/react';
import { Transaction, CategoryTotal, Settings } from '../types';
import { shouldExcludeTransaction } from '../utils/settings';
import { getDateRange } from '../utils/dates';

interface Props {
  transactions: Transaction[];
  settings: Settings;
}

export default function ExpenseCharts({ transactions, settings }: Props) {
  const expenseTransactions = transactions.filter(t => 
    t.amount < 0 && 
    !shouldExcludeTransaction(t.description, settings)
  );

  // Calculate date range for monthly average using consistent end date
  const expenseDates = expenseTransactions.map(t => t.date);
  const { monthsDiff: expenseMonthsDiff } = getDateRange(expenseDates);

  const categoryTotals = expenseTransactions.reduce((acc: CategoryTotal[], curr) => {
    const existingCategory = acc.find(c => c.category === curr.category);
    if (existingCategory) {
      existingCategory.total += Math.abs(curr.amount);
      existingCategory.totalEur += Math.abs(curr.amountEur);
    } else {
      acc.push({
        category: curr.category,
        total: Math.abs(curr.amount),
        totalEur: Math.abs(curr.amountEur),
        percentage: 0
      });
    }
    return acc;
  }, []);

  // Calculate monthly averages and percentages
  const total = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);
  categoryTotals.forEach(cat => {
    cat.totalEur = cat.totalEur / expenseMonthsDiff; // Convert to monthly average
    cat.percentage = (cat.total / total) * 100;
  });

  // Sort categories by percentage in descending order
  categoryTotals.sort((a, b) => b.percentage - a.percentage);

  // Calculate total monthly average
  const totalMonthlyAverageEur = categoryTotals.reduce((sum, cat) => sum + cat.totalEur, 0);

  const colors = [
    'bg-blue-500',   // blue
    'bg-green-500',  // green
    'bg-yellow-500', // yellow
    'bg-red-500',    // red
    'bg-purple-500', // purple
    'bg-pink-500',   // pink
    'bg-indigo-500', // indigo
    'bg-teal-500',   // teal
    'bg-orange-500', // orange
  ];

  return (
    <div className="px-4 mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Average Monthly Expenses by Category</h2>
      <div className="bg-gray-800 p-8 rounded-xl">
        <div className="flex flex-wrap gap-3">
          <IonChip
            className="bg-gray-600 text-white font-medium"
            style={{ '--background': 'none' }}
          >
            <span className="px-1">
              Total: {totalMonthlyAverageEur.toLocaleString('en-US', { maximumFractionDigits: 2 })}€/mo.
            </span>
          </IonChip>
          {categoryTotals.map((cat, index) => (
            <IonChip
              key={cat.category}
              className={`${colors[index % colors.length]} text-white font-medium`}
              style={{ '--background': 'none' }}
            >
              <span className="px-1">
                {cat.category} ({cat.percentage.toFixed(1)}%) - {cat.totalEur.toLocaleString('en-US', { maximumFractionDigits: 2 })}€/mo.
              </span>
            </IonChip>
          ))}
        </div>
      </div>
    </div>
  );
}