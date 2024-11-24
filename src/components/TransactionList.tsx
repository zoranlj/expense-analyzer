import { IonList, IonItem, IonLabel, IonNote, IonSearchbar, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/react';
import { Transaction, Settings } from '../types';
import { format } from 'date-fns';
import { useState } from 'react';
import { shouldExcludeTransaction } from '../utils/settings';

interface Props {
  transactions: Transaction[];
  settings: Settings;
}

type SortOption = 'name' | 'date' | 'amount';

export default function TransactionList({ transactions, settings }: Props) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Razno');
  const [expensesOnly, setExpensesOnly] = useState(true);
  const [excludeSpecific, setExcludeSpecific] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const categories = ['all', ...new Set(transactions.map(t => t.category))];

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesType = expensesOnly ? transaction.amount < 0 : true;
      const matchesExclusion = excludeSpecific ? !shouldExcludeTransaction(transaction.description, settings) : true;
      return matchesSearch && matchesCategory && matchesType && matchesExclusion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.description.localeCompare(b.description);
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        default:
          return 0;
      }
    });

  return (
    <div className="px-4 mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Lista transakcija</h2>
      
      <div className="flex flex-col gap-4 mb-6">
        <IonSearchbar
          value={searchText}
          onIonInput={e => setSearchText(e.detail.value!)}
          placeholder="Pretraži transakcije"
          className="bg-gray-800 rounded-lg"
          style={{
            '--background': '#1f2937',
            '--color': '#f3f4f6',
            '--placeholder-color': '#9ca3af',
            '--icon-color': '#9ca3af',
            '--clear-button-color': '#9ca3af',
            '--border-radius': '0.5rem',
            '--box-shadow': 'none',
            '--min-height': '48px',
            '--padding-top': '0',
            '--padding-bottom': '0',
          }}
        />
        
        <div className="flex flex-col gap-4">
          <IonSelect
            value={selectedCategory}
            onIonChange={e => setSelectedCategory(e.detail.value)}
            placeholder="Izaberi kategoriju"
            className="bg-gray-800 rounded-lg h-[48px] w-full flex items-center px-4"
            interface="popover"
            style={{
              '--background': '#1f2937',
              '--color': '#f3f4f6',
              '--placeholder-color': '#9ca3af',
              '--border-radius': '0.5rem',
              '--box-shadow': 'none',
              '--padding-top': '0',
              '--padding-bottom': '0',
              '--padding-start': '1rem',
              '--padding-end': '1rem',
            }}
          >
            {categories.map(category => (
              <IonSelectOption 
                key={category} 
                value={category}
                style={{
                  '--background': '#1f2937',
                  '--color': '#f3f4f6',
                }}
              >
                {category === 'all' ? 'Sve kategorije' : category}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            value={sortBy}
            onIonChange={e => setSortBy(e.detail.value)}
            className="bg-gray-800 rounded-lg h-[48px] w-full flex items-center px-4"
            interface="popover"
            style={{
              '--background': '#1f2937',
              '--color': '#f3f4f6',
              '--placeholder-color': '#9ca3af',
              '--border-radius': '0.5rem',
              '--box-shadow': 'none',
              '--padding-top': '0',
              '--padding-bottom': '0',
              '--padding-start': '1rem',
              '--padding-end': '1rem',
            }}
          >
            <IonSelectOption value="name" style={{ '--background': '#1f2937', '--color': '#f3f4f6' }}>
              Sortiraj po nazivu
            </IonSelectOption>
            <IonSelectOption value="date" style={{ '--background': '#1f2937', '--color': '#f3f4f6' }}>
              Sortiraj po datumu
            </IonSelectOption>
            <IonSelectOption value="amount" style={{ '--background': '#1f2937', '--color': '#f3f4f6' }}>
              Sortiraj po iznosu
            </IonSelectOption>
           </IonSelect>

          <div className="flex gap-4">
            <div className="bg-gray-800 rounded-lg px-4 flex items-center h-[48px] flex-1">
              <IonCheckbox
                checked={expensesOnly}
                onIonChange={e => setExpensesOnly(e.detail.checked)}
                style={{
                  '--background-checked': '#3B82F6',
                  '--border-color-checked': '#3B82F6',
                  '--checkmark-color': 'white',
                  '--border-color': '#6B7280',
                }}
              />
              <span className="ml-3 text-gray-200 whitespace-nowrap">Troškovi</span>
            </div>

            <div className="bg-gray-800 rounded-lg px-4 flex items-center h-[48px] flex-1">
              <IonCheckbox
                checked={excludeSpecific}
                onIonChange={e => setExcludeSpecific(e.detail.checked)}
                style={{
                  '--background-checked': '#3B82F6',
                  '--border-color-checked': '#3B82F6',
                  '--checkmark-color': 'white',
                  '--border-color': '#6B7280',
                }}
              />
              <span className="ml-3 text-gray-200 whitespace-nowrap">Isključi spec transakcije</span>
            </div>
          </div>
        </div>
      </div>

      <IonList className="bg-gray-800 rounded-xl overflow-hidden">
        {filteredTransactions.map((transaction, index) => (
          <IonItem key={index} className="py-4 border-b border-gray-700">
            <IonLabel>
              <h2 className="font-medium text-gray-200 mb-1">{transaction.description}</h2>
              <p className="text-sm text-gray-400">
                {format(transaction.date, 'dd.MM.yyyy')} • {transaction.category}
              </p>
            </IonLabel>
            <IonNote slot="end" className="text-right">
              <div className={`${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'} font-medium mb-1`}>
                {transaction.amount.toLocaleString('sr-RS')} RSD
              </div>
              <div className={`text-xs ${transaction.amount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {transaction.amountEur.toLocaleString('sr-RS', { maximumFractionDigits: 2 })} EUR
              </div>
            </IonNote>
          </IonItem>
        ))}
      </IonList>

      <div className="mt-4 text-sm text-gray-400 text-right">
        Prikazano {filteredTransactions.length} od {transactions.length} transakcija
      </div>
    </div>
  );
}