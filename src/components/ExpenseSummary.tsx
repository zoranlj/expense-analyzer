import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { Transaction, Settings } from '../types';
import { format, differenceInMonths, startOfMonth } from 'date-fns';
import { shouldExcludeTransaction, isIncomeFromSource } from '../utils/settings';

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

  // Calculate expenses monthly average and date range
  const expenseDates = expenses.map(t => t.date);
  const oldestExpenseDate = expenseDates.length > 0 ? new Date(Math.min(...expenseDates.map(d => d.getTime()))) : new Date();
  const newestExpenseDate = expenseDates.length > 0 ? new Date(Math.max(...expenseDates.map(d => d.getTime()))) : new Date();
  const expenseMonthsDiff = differenceInMonths(startOfMonth(newestExpenseDate), startOfMonth(oldestExpenseDate)) + 1;
  const monthlyExpenseAverageEur = totalExpensesEur / expenseMonthsDiff;

  // Calculate income for each source
  const incomeData = settings.incomeSources.map(source => {
    const sourceIncome = transactions.filter(t => isIncomeFromSource(t.description, source));
    const totalIncomeEur = sourceIncome.reduce((sum, t) => sum + t.amountEur, 0);
    const dates = sourceIncome.map(t => t.date);
    const oldestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
    const newestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
    const monthsDiff = differenceInMonths(startOfMonth(newestDate), startOfMonth(oldestDate)) + 1;
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
          <IonCardTitle className="text-gray-200">Rashodi</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="text-3xl font-bold text-red-400">
            {totalExpensesEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} €
          </div>
          <div className="text-sm text-red-300 mt-1">
            Mesečni prosek: {monthlyExpenseAverageEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} €
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {format(oldestExpenseDate, 'dd.MM.yyyy')} - {format(newestExpenseDate, 'dd.MM.yyyy')}
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard className="bg-gray-800 rounded-xl shadow-lg overflow-hidden m-0">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Prihodi</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="text-3xl font-bold text-green-400">
            {totalIncomeEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} €
          </div>
          <div className="text-sm text-green-300 mt-1">
            Mesečni prosek: {monthlyIncomeAverageEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} €
          </div>
          {incomeData.map(({ source, totalIncomeEur, monthlyAverageEur, oldestDate, newestDate }) => (
            source.enabled && (
              <div className="mt-3" key={source.name}>
                <div className="text-sm text-gray-400">{source.name}:</div>
                <div className="text-sm text-green-400">
                  {totalIncomeEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} €
                  <span className="text-xs text-green-300 ml-2">
                    (mesečno: {monthlyAverageEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} €)
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {format(oldestDate, 'dd.MM.yyyy')} - {format(newestDate, 'dd.MM.yyyy')}
                </div>
              </div>
            )
          ))}
        </IonCardContent>
      </IonCard>
    </div>
  );
}