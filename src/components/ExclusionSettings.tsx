import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
  IonButton,
  IonInput,
  useIonToast
} from '@ionic/react';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { Settings } from '../types';
import { getSettings, saveSettings } from '../utils/settings';

interface Props {
  onSettingsChange: (settings: Settings) => void;
}

export default function ExclusionSettings({ onSettingsChange }: Props) {
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [newPattern, setNewPattern] = useState('');
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomePattern, setNewIncomePattern] = useState('');
  const [present] = useIonToast();

  const handleToggleRule = (index: number) => {
    const newSettings = {
      ...settings,
      exclusionRules: settings.exclusionRules.map((rule, i) =>
        i === index ? { ...rule, enabled: !rule.enabled } : rule
      )
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleDeleteRule = (index: number) => {
    const newSettings = {
      ...settings,
      exclusionRules: settings.exclusionRules.filter((_, i) => i !== index)
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleAddRule = () => {
    if (!newPattern.trim()) {
      present({
        message: 'Please enter a pattern',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return;
    }

    const newSettings = {
      ...settings,
      exclusionRules: [
        ...settings.exclusionRules,
        { pattern: newPattern.trim(), enabled: true }
      ]
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    setNewPattern('');
    onSettingsChange(newSettings);

    present({
      message: 'Rule added successfully',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
  };

  const handleToggleIncomeSource = (index: number) => {
    const newSettings = {
      ...settings,
      incomeSources: settings.incomeSources.map((source, i) =>
        i === index ? { ...source, enabled: !source.enabled } : source
      )
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleDeleteIncomeSource = (index: number) => {
    const newSettings = {
      ...settings,
      incomeSources: settings.incomeSources.filter((_, i) => i !== index)
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleAddIncomeSource = () => {
    if (!newIncomeName.trim() || !newIncomePattern.trim()) {
      present({
        message: 'Please enter both name and pattern',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return;
    }

    const newSettings = {
      ...settings,
      incomeSources: [
        ...settings.incomeSources,
        { 
          name: newIncomeName.trim(), 
          pattern: newIncomePattern.trim(), 
          enabled: true 
        }
      ]
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    setNewIncomeName('');
    setNewIncomePattern('');
    onSettingsChange(newSettings);

    present({
      message: 'Income source added successfully',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
  };

  return (
    <div className="px-4 mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-100">Settings</h2>
      
      <IonCard className="bg-gray-800 rounded-xl overflow-hidden m-0 mb-6">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Income Sources</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex flex-col gap-4 mb-4">
            <IonInput
              value={newIncomeName}
              placeholder="Income source name"
              onIonInput={e => setNewIncomeName(e.detail.value || '')}
              className="bg-gray-700 rounded-lg pl-6"
              style={{
                '--background': '#374151',
                '--color': '#f3f4f6',
                '--placeholder-color': '#9ca3af',
                '--padding-start': '1.5rem',
                '--padding-end': '1.5rem'
              }}
            />
            <IonInput
              value={newIncomePattern}
              placeholder="Recognition pattern"
              onIonInput={e => setNewIncomePattern(e.detail.value || '')}
              className="bg-gray-700 rounded-lg pl-6"
              style={{
                '--background': '#374151',
                '--color': '#f3f4f6',
                '--placeholder-color': '#9ca3af',
                '--padding-start': '1.5rem',
                '--padding-end': '1.5rem'
              }}
            />
            <IonButton onClick={handleAddIncomeSource} color="primary">
              <Plus className="w-5 h-5 mr-1" />
              Add Income Source
            </IonButton>
          </div>

          <IonList className="bg-transparent">
            {settings.incomeSources.map((source, index) => (
              <IonItem key={index} className="bg-gray-700 rounded-lg mb-2">
                <IonLabel className="text-gray-200">
                  <h2>{source.name}</h2>
                  <p className="text-gray-400">{source.pattern}</p>
                </IonLabel>
                <IonToggle
                  checked={source.enabled}
                  onIonChange={() => handleToggleIncomeSource(index)}
                  slot="end"
                />
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => handleDeleteIncomeSource(index)}
                  slot="end"
                >
                  <Trash2 className="w-5 h-5" />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard className="bg-gray-800 rounded-xl overflow-hidden m-0">
        <IonCardHeader>
          <IonCardTitle className="text-gray-200">Transaction Exclusion Patterns</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="mb-4 flex gap-2">
            <IonInput
              value={newPattern}
              placeholder="Enter new exclusion pattern"
              onIonInput={e => setNewPattern(e.detail.value || '')}
              className="bg-gray-700 rounded-lg pl-6"
              style={{
                '--background': '#374151',
                '--color': '#f3f4f6',
                '--placeholder-color': '#9ca3af',
                '--padding-start': '1.5rem',
                '--padding-end': '1.5rem'
              }}
            />
            <IonButton onClick={handleAddRule} color="primary">
              <Plus className="w-5 h-5 mr-1" />
              Add
            </IonButton>
          </div>

          <IonList className="bg-transparent">
            {settings.exclusionRules.map((rule, index) => (
              <IonItem key={index} className="bg-gray-700 rounded-lg mb-2">
                <IonLabel className="text-gray-200">{rule.pattern}</IonLabel>
                <IonToggle
                  checked={rule.enabled}
                  onIonChange={() => handleToggleRule(index)}
                  slot="end"
                />
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => handleDeleteRule(index)}
                  slot="end"
                >
                  <Trash2 className="w-5 h-5" />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );
}