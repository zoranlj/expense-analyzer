import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast
} from '@ionic/react';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { CategoryData } from '../types';

interface Props {
  categories: CategoryData;
  onCategoriesChange: (categories: CategoryData) => void;
}

export default function CategoryManagement({ categories, onCategoriesChange }: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [present] = useIonToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      present({
        message: 'Unesite naziv kategorije',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return;
    }

    if (categories[newCategory]) {
      present({
        message: 'Kategorija već postoji',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return;
    }

    const updatedCategories = {
      ...categories,
      [newCategory]: []
    };
    onCategoriesChange(updatedCategories);
    setNewCategory('');

    present({
      message: 'Kategorija uspešno dodata',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
  };

  const handleDeleteCategory = (category: string) => {
    const { [category]: _, ...remainingCategories } = categories;
    onCategoriesChange(remainingCategories);

    present({
      message: 'Kategorija uspešno obrisana',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
  };

  const handleAddKeyword = () => {
    if (!selectedCategory) {
      present({
        message: 'Izaberite kategoriju',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return;
    }

    if (!newKeyword.trim()) {
      present({
        message: 'Unesite ključnu reč',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return;
    }

    const updatedCategories = {
      ...categories,
      [selectedCategory]: [...categories[selectedCategory], newKeyword.trim()]
    };
    onCategoriesChange(updatedCategories);
    setNewKeyword('');

    present({
      message: 'Ključna reč uspešno dodata',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
  };

  const handleDeleteKeyword = (category: string, keyword: string) => {
    const updatedCategories = {
      ...categories,
      [category]: categories[category].filter(k => k !== keyword)
    };
    onCategoriesChange(updatedCategories);

    present({
      message: 'Ključna reč uspešno obrisana',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
  };

  return (
    <div className="px-4 mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Upravljanje kategorijama</h2>
      
      <IonCard className="bg-gray-800 rounded-xl overflow-hidden m-0 mb-6">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Nova kategorija</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex gap-2">
            <IonInput
              value={newCategory}
              placeholder="Naziv kategorije"
              onIonInput={e => setNewCategory(e.detail.value || '')}
              className="bg-gray-700 rounded-lg"
              style={{
                '--background': '#374151',
                '--color': '#f3f4f6',
                '--placeholder-color': '#9ca3af',
                '--padding-start': '1.5rem',
                '--padding-end': '1.5rem'
              }}
            />
            <IonButton onClick={handleAddCategory} color="primary">
              <Plus className="w-5 h-5 mr-1" />
              Dodaj
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard className="bg-gray-800 rounded-xl overflow-hidden m-0 mb-6">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Dodaj ključnu reč</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex flex-col gap-4">
            <IonSelect
              value={selectedCategory}
              placeholder="Izaberi kategoriju"
              onIonChange={e => setSelectedCategory(e.detail.value)}
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
              {Object.keys(categories).map(category => (
                <IonSelectOption 
                  key={category} 
                  value={category}
                  style={{
                    '--background': '#1f2937',
                    '--color': '#f3f4f6',
                  }}
                >
                  {category}
                </IonSelectOption>
              ))}
            </IonSelect>

            <div className="flex gap-2">
              <IonInput
                value={newKeyword}
                placeholder="Nova ključna reč"
                onIonInput={e => setNewKeyword(e.detail.value || '')}
                className="bg-gray-700 rounded-lg"
                style={{
                  '--background': '#374151',
                  '--color': '#f3f4f6',
                  '--placeholder-color': '#9ca3af',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              />
              <IonButton onClick={handleAddKeyword} color="primary">
                <Plus className="w-5 h-5 mr-1" />
                Dodaj
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard className="bg-gray-800 rounded-xl overflow-hidden m-0">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Postojeće kategorije</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList className="bg-transparent">
            {Object.entries(categories).map(([category, keywords]) => (
              <div key={category} className="mb-4">
                <IonItem className="bg-gray-700 rounded-lg mb-2">
                  <IonLabel className="text-gray-200">{category}</IonLabel>
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => handleDeleteCategory(category)}
                    slot="end"
                  >
                    <Trash2 className="w-5 h-5" />
                  </IonButton>
                </IonItem>
                <div className="flex flex-wrap gap-2 pl-4">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 text-gray-200 rounded px-3 py-1 flex items-center gap-2"
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => handleDeleteKeyword(category, keyword)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );
}