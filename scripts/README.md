# DentalHub Testing Scripts

This directory contains scripts for testing the DentalHub application, with a focus on database operations and button functionality.

## Scripts Overview

- **test-button-functionality.js**: Tests buttons that interact with the database by simulating user interactions through Puppeteer
- **test-db-connection.js**: Directly tests database connections and operations without browser interaction
- **test-production-paths.js**: Tests critical user paths based on the TEST-CRITICAL-PATHS.md document

## Setup

To install the necessary dependencies:

```bash
cd scripts
npm install
```

## Environment Configuration

Create a `.env` file in the root directory (c:/Projects/Dental Hub/dentalhub-v10/) with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Tests

### Database Connection Test

This test verifies database connectivity and operations without using the browser:

```bash
npm run test-db
```

The script will:
1. Test connection to Supabase
2. Prompt for test user credentials for authenticated operations
3. Test CRUD operations on various database tables
4. Generate a `DB-TEST-RESULTS.md` report file

### Button Functionality Test

This test simulates user interactions with buttons that interact with the database:

```bash
npm run test-buttons
```

The script will:
1. Launch a browser with Puppeteer
2. Navigate to each page with buttons to test
3. Click buttons and verify the database operations
4. Generate a `BUTTON-TEST-RESULTS.md` report file

### Critical Paths Test

This test helps track and document testing of critical user paths:

```bash
npm run test-paths
```

The script will:
1. Read the TEST-CRITICAL-PATHS.md file
2. Track progress and update status of tests
3. Generate a `TEST-RESULTS.md` report file

## Test Reports

Each script generates a Markdown report file with test results:

- `DB-TEST-RESULTS.md`: Results of database connection tests
- `BUTTON-TEST-RESULTS.md`: Results of button functionality tests
- `TEST-RESULTS.md`: Results of critical path tests

## Troubleshooting

- **Authentication issues**: Ensure that the test user has the necessary permissions in Supabase
- **Browser interaction issues**: If the button tests fail, check the error screenshots saved in the project directory
- **Database operation issues**: Check the database logs and ensure the tables exist with the expected schema

## Adding New Tests

### Adding New Button Tests

To add new button tests, edit the `TEST_CATEGORIES` object in `test-button-functionality.js`:

```javascript
{
  id: 'your-button-id',
  selector: '[data-testid="your-button-selector"]',
  action: 'yourAction'
}
```

Then add a corresponding database verification in the `verifyDatabaseOperation` function.

### Adding New Database Operations

To add new database operations, edit the `DB_OPERATIONS` array in `test-db-connection.js`:

```javascript
{
  name: 'Your Operation',
  table: 'your_table',
  action: 'create|update|delete|search'
}
```

Then update the `generateTestData` and `generateUpdateData` functions to handle your new table.