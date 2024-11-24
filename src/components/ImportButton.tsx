import { IonButton, useIonToast } from '@ionic/react';
import { Upload } from 'lucide-react';
import { read, utils } from 'xlsx';

interface Props {
  onDataImported: (data: string) => void;
}

export default function ImportButton({ onDataImported }: Props) {
  const [present] = useIonToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      
      const workbook = read(buffer);
  
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
     
      // Convert Excel data to tab-separated format
      const csvData = utils.sheet_to_csv(worksheet, { FS: '\t' });
      
      onDataImported(csvData);

      present({
        message: 'Data imported successfully!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
    } catch (error) {
      console.error('Error importing file:', error);
      
      present({
        message: 'Error importing file. Please check the format and try again.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
    }

    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        title="Import Excel file"
      />
      <IonButton fill="clear" className="h-full">
        <Upload className="w-5 h-5" />
      </IonButton>
    </div>
  );
}