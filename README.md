Expense Analyzer

A sophisticated expense tracking and analysis application built with Ionic React, designed to help users understand and manage their financial transactions from Intesa Bank exports.

## 🚀 Tech Stack

- **Frontend Framework**: React 18.3.1
- **UI Framework**: Ionic React 7.8.0
- **Styling**: Tailwind CSS 3.4.1
- **Charts**: Chart.js 4.4.2 with React-ChartJS-2 5.2.0
- **Date Handling**: date-fns 3.3.1
- **Utilities**: Lodash 4.17.21
- **Icons**: Lucide React 0.344.0
- **Excel Processing**: XLSX 0.18.5
- **Build Tool**: Vite
- **Mobile Platform**: Capacitor for Android deployment
- **TypeScript**: For type safety and better developer experience
- **Storage**: Browser's LocalStorage for data persistence

## 📱 Features

### 1. Data Import & Storage
- Import transactions from Excel (.xlsx, .xls) files
- Automatic deduplication of transactions
- Persistent storage using browser's LocalStorage
- Automatic data recovery on page reload
- Smart data merging for multiple imports
- Intelligent duplicate detection based on date, amount, and description

### 2. Transaction Analysis
- Parse and analyze bank transaction data
- Automatic categorization of transactions
- Support for multiple currencies (RSD, EUR, USD, HUF)
- Automatic currency conversion with fixed rates

### 3. Financial Overview
- Monthly expense summaries
- Income tracking from multiple sources
- Detailed transaction history
- Category-wise expense breakdown

### 4. Category Management
- Dynamic category system
- Add, edit, and remove categories
- Add and remove keywords within categories
- Real-time category updates
- Persistent category storage
- Custom category creation
- Keyword-based categorization

### 5. Search and Filtering
- Advanced transaction search
- Multiple sorting options (date, amount, name)
- Category-based filtering
- Expense-only view option

### 6. Exclusion Rules Management
- Customizable transaction exclusion patterns
- Enable/disable individual exclusion rules
- Add new exclusion patterns dynamically
- Delete unwanted exclusion rules
- Persistent exclusion settings
- Real-time application of exclusion rules
- Default rules for common exclusions

## 🧩 Components

### ImportButton
- Excel file import functionality
- Supports .xlsx and .xls formats
- Automatic data parsing and validation
- Success/error notifications
- Deduplication of transactions
- Persistent storage of imported data

### ExpenseSummary
- Displays total income and expenses
- Shows monthly averages
- Tracks multiple income sources
- Provides date range information
- Applies customizable exclusion rules

### ExpenseCharts
- Visualizes expense distribution
- Shows category-wise monthly averages
- Interactive chart elements
- Color-coded category representation
- Respects transaction exclusion settings

### CategoryManagement
- Add and remove categories
- Manage keywords within categories
- Real-time updates
- Persistent storage
- User-friendly interface
- Keyword management

### ExclusionSettings
- Manage transaction exclusion patterns
- Toggle individual rules
- Add new exclusion patterns
- Remove existing patterns
- Real-time rule application

### TransactionList
- Detailed transaction view
- Advanced search functionality
- Multiple sorting options
- Transaction filtering capabilities
- Exclusion rules integration

## 🛠️ Core Utilities

### Parser (utils/parser.ts)
- Processes raw transaction data
- Handles Excel file data
- Manages currency conversions
- Handles date parsing
- Implements transaction categorization
- Validates and sanitizes input data

### Categories (utils/categories.ts)
- Manages category definitions
- Handles keyword assignments
- Supports category modifications
- Maintains category hierarchy
- Persistent storage
- Category validation

### Settings (utils/settings.ts)
- Manages exclusion rules
- Handles settings persistence
- Provides default exclusion patterns
- Validates transaction exclusions
- Settings storage
- Rule management

## 📊 Data Processing

### Transaction Categorization
- Automatic category assignment based on keywords
- Support for multiple languages
- Case-insensitive matching
- Special transaction handling

### Data Persistence
- Automatic saving to LocalStorage
- Transaction deduplication
- Data recovery on page load
- Error handling and validation
- Settings persistence
- Exclusion rules storage

### Currency Handling
Fixed conversion rates:
- EUR: 117.2 RSD
- USD: 107.5 RSD
- HUF: 0.3 RSD

## 🔍 Search and Filter Features

- Full-text search across transactions
- Category-based filtering
- Date range filtering
- Amount-based sorting
- Multiple view options
- Exclusion rules integration

## 📱 Mobile Features

- Responsive design
- Touch gesture support
- Native-like experience
- Android platform support

## 🚀 Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Deploy to Android
```bash
npm run android
```

## 💾 Data Import Guide

1. Export your transactions from Intesa Bank in Excel format
2. Click the upload icon in the app's toolbar
3. Select your Excel file
4. The app will automatically:
   - Parse the transaction data
   - Remove any duplicates
   - Categorize transactions
   - Save to local storage
   - Update the UI with new data
   - Merge with existing transactions
   - Apply exclusion rules

## 🔧 Configuration

### Environment Variables
- No sensitive environment variables required
- Configuration handled through capacitor.config.json for mobile builds

### Build Configuration
- Vite configuration for web builds
- Capacitor configuration for mobile builds
- Tailwind CSS configuration for styling

## 📱 Mobile Deployment

The application can be deployed as a native Android application using Capacitor:

1. Build the web application
```bash
npm run build
```

2. Sync with Capacitor
```bash
npx cap sync
```

3. Open in Android Studio
```bash
npx cap open android
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Ionic Framework team for the excellent UI components
- React community for the robust ecosystem
- Chart.js team for the visualization capabilities
- SheetJS team for Excel file processing
- All contributors who have helped shape this project