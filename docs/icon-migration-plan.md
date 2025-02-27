# Icon Migration Plan

## Overview
This document outlines the step-by-step process for migrating the Dental Hub application to use our new centralized icon strategy. The migration will improve consistency, maintainability, and developer experience.

## Migration Approach

### 1. Phase 1: Core Components (Completed)
- ✅ Created `Icon` component in `src/components/ui/icon-strategy.tsx`
- ✅ Created icon showcase in `src/components/ui/icon-showcase.tsx`
- ✅ Updated Sidebar navigation to use the new icon system
- ✅ Created documentation in `docs/icon-usage-strategy.md`
- ✅ Developed migration script `scripts/migrate-icons.js`

### 2. Phase 2: Dashboard Components (In Progress)
- ✅ Updated `TreatmentSuccessDashboard.tsx`
- ✅ Updated `PatientSatisfactionDashboard.tsx`
- ✅ Updated `RevenueDashboard.tsx`
- ✅ Updated `StatsCard.tsx`
- ✅ Updated `GenerateReportDialog.tsx`
- ⬜ Complete other dashboard components
   - `ActivePatientsDashboard.tsx`
   - `MonthlyRevenueReport.tsx`
   - Various analytics components

### 3. Phase 3: Admin and Feature Components
- ⬜ Update admin section components
- ⬜ Update analytics components
- ⬜ Update modal and dialog components
- ⬜ Update form components
- ⬜ Update table components

### 4. Phase 4: Testing and QA
- ⬜ Verify all icons display correctly
- ⬜ Test in various viewport sizes
- ⬜ Test in light and dark modes
- ⬜ Ensure consistent sizing and colors
- ⬜ Check for performance issues

## Migration Patterns

### Pattern 1: Direct Icon Import Replacement
```tsx
// BEFORE
import { Users, Bell, Settings } from 'lucide-react';

// AFTER
import { Icon } from '../components/ui/icon-strategy';
```

### Pattern 2: JSX Icon Usage
```tsx
// BEFORE
<Users className="w-5 h-5" />

// AFTER
<Icon name="Users" className="w-5 h-5" />
```

### Pattern 3: Dynamic Icon Component
```tsx
// BEFORE
const Icon = Icons[iconName];
<Icon className="w-6 h-6" />

// AFTER
<Icon name={iconName} className="w-6 h-6" />
```

## Common Issues and Solutions

### 1. Path Resolution
Ensure the import path for the `Icon` component is correct relative to the file being modified.

### 2. Icon Names
Icon names must match exactly with the names in `icon-strategy.tsx`. Use the same capitalization and naming.

### 3. TypeScript Type Errors
If TypeScript errors occur, ensure the interface for component props is updated to use string type for icon names.

## Using the Migration Script

The migration script (`scripts/migrate-icons.js`) can be used to automate much of the migration process:

```bash
node scripts/migrate-icons.js --dir=src/pages/dashboard
```

This will scan the specified directory for files using direct Lucide icon imports and replace them with the new icon strategy.

## Manual Review Checklist

After running the migration script, perform the following checks:

- [ ] All icon imports have been replaced
- [ ] No direct Lucide import statements remain
- [ ] Icon component props are correctly passed
- [ ] Icons display correctly in the UI
- [ ] No TypeScript errors are present

## Rollback Plan

If issues are encountered, the rollback process is:

1. Revert commits related to the icon migration
2. Restore direct Lucide imports
3. Test thoroughly before proceeding with a revised migration strategy
