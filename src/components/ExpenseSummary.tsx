import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { Transaction, Settings } from '../types';
import { format } from 'date-fns';
import { shouldExcludeTransaction, isIncomeFromSource } from '../utils/settings';
import { getDateRange } from '../utils/dates';

interface Props {
  transactions: Transaction[];
  settings: Settings;
}

export default function ExpenseSummary({ transactions, settings }: Props) {
  const expenses = transactions.filter(t => 
    t.amount < 0 && 
    !shouldExcludeTransaction(t.description, settings)
  );
  const totalExpensesEur = expenses.reduce((sum, t) => sum + Math.abs(t.amountEur), 0);

  // Calculate expenses monthly average using consistent date range
  const expenseDates = expenses.map(t => t.date);
  const { start: oldestExpenseDate, end: newestExpenseDate, monthsDiff: expenseMonthsDiff } = getDateRange(expenseDates);
  const monthlyExpenseAverageEur = totalExpensesEur / expenseMonthsDiff;

  // Calculate income for each source using consistent date range
  const incomeData = settings.incomeSources.map(source => {
    const sourceIncome = transactions.filter(t => isIncomeFromSource(t.description, source));
    const totalIncomeEur = sourceIncome.reduce((sum, t) => sum + t.amountEur, 0);
    const dates = sourceIncome.map(t => t.date);
    const { start: oldestDate, end: newestDate, monthsDiff } = getDateRange(dates);
    const monthlyAverageEur = totalIncomeEur / monthsDiff;

    return {
      source,
      totalIncomeEur,
      monthlyAverageEur,
      oldestDate,
      newestDate,
      monthsDiff
    };
  });

  // Calculate total income
  const totalIncomeEur = incomeData.reduce((sum, data) => sum + data.totalIncomeEur, 0);
  const monthlyIncomeAverageEur = incomeData.reduce((sum, data) => sum + data.monthlyAverageEur, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 px-4">
      <IonCard className="bg-gray-800 rounded-xl shadow-lg overflow-hidden m-0">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Expenses</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="text-3xl font-bold text-red-400">
            {totalExpensesEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} €
          </div>
          <div className="text-sm text-red-300 mt-1">
            Monthly Average: {monthlyExpenseAverageEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} €
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {format(oldestExpenseDate, 'MM/dd/yyyy')} - {format(newestExpenseDate, 'MM/dd/yyyy')}
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard className="bg-gray-800 rounded-xl shadow-lg overflow-hidden m-0">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Income</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="text-3xl font-bold text-green-400">
            {totalIncomeEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} €
          </div>
          <div className="text-sm text-green-300 mt-1">
            Monthly Average: {monthlyIncomeAverageEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} €
          </div>
          {incomeData.map(({ source, totalIncomeEur, monthlyAverageEur, oldestDate, newestDate }) => (
            source.enabled && (
              <div className="mt-3" key={source.name}>
                <div className="text-sm text-gray-400">{source.name}:</div>
                <div className="text-sm text-green-400">
                  {totalIncomeEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} €
                  <span className="text-xs text-green-300 ml-2">
                    (monthly: {monthlyAverageEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} €)
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {format(oldestDate, 'MM/dd/yyyy')} - {format(newestDate, 'MM/dd/yyyy')}
                </div>
              </div>
            )
          ))}
        </IonCardContent>
      </IonCard>
    </div>
  );
}