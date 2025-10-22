# Excel Data Viewer - Refactored Structure

## Overview
The application has been refactored from a monolithic `index.html` file into a clean, modular React/TypeScript architecture.

## File Structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── constants/
│   └── index.ts              # App constants and default values
├── utils/
│   ├── storage.ts            # LocalStorage operations
│   ├── excelReader.ts        # Excel file reading/writing logic
│   └── accountMatcher.ts     # User account matching utilities
├── hooks/
│   ├── useTheme.ts           # Theme management hook
│   ├── useUserAccounts.ts    # User accounts state management
│   └── useExcelData.ts       # Excel data loading and state
├── components/
│   ├── Header.tsx            # Main header with controls
│   ├── ServiceTable.tsx      # Individual service table display
│   ├── SettingsModal.tsx     # Column settings modal
│   ├── ConverterModal.tsx    # Excel to JSON converter modal
│   └── Footer.tsx            # App footer
├── App.tsx                   # Main application component
├── App.css                   # Application styles
├── main.tsx                  # React entry point
└── index.css                 # Global styles
```

## Key Improvements

### 1. **Separation of Concerns**
- **Types**: All TypeScript interfaces in one place
- **Constants**: Configuration values separated from logic
- **Utils**: Reusable utility functions
- **Hooks**: Custom React hooks for state management
- **Components**: UI components with single responsibilities

### 2. **Maintainability**
- Each file has a single, clear purpose
- Easy to locate and fix bugs
- Simple to add new features
- Better code organization

### 3. **Reusability**
- Utility functions can be reused across components
- Custom hooks encapsulate business logic
- Components are modular and composable

### 4. **Type Safety**
- Full TypeScript support
- Interfaces for all data structures
- Type-safe props and state

## Component Descriptions

### **Header.tsx**
- File upload controls (JSON and Excel)
- Header row selector
- Theme toggle button
- Column settings button
- Converter button

### **ServiceTable.tsx**
- Displays data for a specific service
- Phone number selector
- Data table with account matching
- Export to Excel functionality

### **SettingsModal.tsx**
- Configure column header names
- Reset to default values
- Save and apply settings

### **ConverterModal.tsx**
- Convert UserAccount Excel to JSON
- File upload and conversion
- Auto-download result

### **Footer.tsx**
- Application footer with attribution

## Custom Hooks

### **useTheme**
- Manages light/dark theme state
- Persists theme preference to localStorage
- Updates DOM data-theme attribute

### **useUserAccounts**
- Loads user accounts from JSON file
- Attempts to load default UserAccount.json
- Provides method to load from uploaded file

### **useExcelData**
- Manages Excel file loading state
- Processes Excel data into service groups
- Handles errors and loading states
- Supports dynamic header row selection

## Utility Functions

### **storage.ts**
- Get/set theme preference
- Get/set column name configuration

### **excelReader.ts**
- Read Excel files using XLSX library
- Parse and group data by service
- Convert Excel to JSON
- Export data to Excel

### **accountMatcher.ts**
- Find account numbers based on type and currency
- Extract unique phone numbers from user accounts

## Next Steps for Development

1. **To add a new feature**: Create a new component in `components/`
2. **To modify business logic**: Update the relevant hook in `hooks/`
3. **To change data structures**: Update types in `types/index.ts`
4. **To add utilities**: Create functions in `utils/`
5. **To modify styling**: Edit `App.css` or component-specific styles

## Benefits

✅ **Easy to maintain** - Find and fix issues quickly
✅ **Easy to test** - Isolated functions and components
✅ **Easy to extend** - Add features without touching existing code
✅ **Type-safe** - Catch errors at compile time
✅ **Professional structure** - Industry-standard React architecture
