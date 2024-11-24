import { 
  IonApp, 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButtons,
  setupIonicReact 
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { parseTransactions } from './utils/parser';
import TransactionList from './components/TransactionList';
import ExpenseCharts from './components/ExpenseCharts';
import ExpenseSummary from './components/ExpenseSummary';
import CategoryManagement from './components/CategoryManagement';
import ExclusionSettings from './components/ExclusionSettings';
import ImportButton from './components/ImportButton';
import { Transaction, Settings, CategoryData } from './types';
import { getSettings } from './utils/settings';
import { getCategories, updateCategories } from './utils/categories';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const STORAGE_KEY = 'troskovi_transactions';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [categories, setCategories] = useState<CategoryData>(getCategories());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadStoredTransactions = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData, (key, value) => {
            if (key === 'date') return new Date(value);
            return value;
          });
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log('Loaded transactions from localStorage:', parsedData.length);
            setTransactions(parsedData);
          } else {
            console.log('No valid transactions found in localStorage');
          }
        } else {
          console.log('No stored transactions found');
        }
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadStoredTransactions();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      if (transactions.length > 0) {
        const serializedData = JSON.stringify(transactions);
        localStorage.setItem(STORAGE_KEY, serializedData);
        console.log('Saved transactions to localStorage:', transactions.length);
        
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData !== serializedData) {
          console.error('Storage verification failed');
        }
      } else {
        console.log('No transactions to save');
      }
    } catch (error) {
      console.error('Error saving transactions to localStorage:', error);
    }
  }, [transactions, isInitialized]);

  const handleDataImported = (data: string) => {
    const newTransactions = parseTransactions(data);
    console.log('New transactions parsed:', newTransactions.length);
    
    setTransactions(prevTransactions => {
      const existingKeys = new Set(
        prevTransactions.map(t => 
          `${t.date.getTime()}-${t.amount}-${t.description}`
        )
      );

      const uniqueNewTransactions = newTransactions.filter(transaction => {
        const key = `${transaction.date.getTime()}-${transaction.amount}-${transaction.description}`;
        return !existingKeys.has(key);
      });

      console.log('New unique transactions:', uniqueNewTransactions.length);

      const combined = [...prevTransactions, ...uniqueNewTransactions];
      const sorted = combined.sort((a, b) => b.date.getTime() - a.date.getTime());
      return sorted;
    });
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleCategoriesChange = (newCategories: CategoryData) => {
    setCategories(newCategories);
    updateCategories(newCategories);
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Troškovi</IonTitle>
            <IonButtons slot="end">
              <ImportButton onDataImported={handleDataImported} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" style={{ '--padding-top': '2rem' }}>
          <ExpenseSummary transactions={transactions} settings={settings} />
          <ExpenseCharts transactions={transactions} settings={settings} />
          <ExclusionSettings onSettingsChange={handleSettingsChange} />
          <CategoryManagement 
            categories={categories}
            onCategoriesChange={handleCategoriesChange}
          />
          <TransactionList transactions={transactions} settings={settings} />
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

export default App;