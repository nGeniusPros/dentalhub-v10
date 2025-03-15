// This script tests the prospect import functionality
require('dotenv').config();
const { supabase } = require('../src/lib/supabase');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');



// Create a sample test file with prospect data
function createSampleProspectFile() {
  console.log('Creating sample prospect data file...');
  
  const testData = [
    ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Zip'],
    ['John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'Anytown', 'CA', '12345'],
    ['Jane', 'Smith', 'jane.smith@example.com', '234-567-8901', '456 Oak Ave', 'Somewhere', 'NY', '23456'],
    ['Michael', 'Johnson', 'michael.j@example.com', '345-678-9012', '789 Pine Dr', 'Elsewhere', 'TX', '34567'],
    ['Emily', 'Brown', 'emily.b@example.com', '456-789-0123', '101 Cedar Ln', 'Nowhere', 'FL', '45678'],
    ['David', 'Williams', 'david.w@example.com', '567-890-1234', '202 Elm St', 'Someplace', 'WA', '56789']
  ];
  
  // Create a workbook and worksheet
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(testData);
  xlsx.utils.book_append_sheet(wb, ws, 'Prospects');
  
  // Create directory if it doesn't exist
  const outputDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Write to file
  const outputFile = path.join(outputDir, 'sample_prospects.xlsx');
  xlsx.writeFile(wb, outputFile);
  
  console.log(`Sample file created at: ${outputFile}`);
  return outputFile;
}

// Import the data using the Supabase API
async function testProspectImport(filePath) {
  console.log('Testing prospect import...');
  
  // Read the Excel file
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);
  
  console.log(`Read ${data.length} prospects from file`);
  
  // Transform data for import
  const prospects = data.map(row => {
    return {
      first_name: row['First Name'] || '',
      last_name: row['Last Name'] || '',
      email: row['Email'] || null,
      phone: row['Phone'] || null,
      address: row['Address'] || null,
      city: row['City'] || null,
      state: row['State'] || null,
      postal_code: row['Zip'] || null,
      status: 'new',
      lead_source: 'test-import',
    };
  });
  
  console.log('Importing prospects to Supabase...');
  
  // Import prospects one by one
  let added = 0;
  let failed = 0;
  
  for (const prospect of prospects) {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .insert(prospect)
        .select()
        .single();
      
      if (error) {
        console.error(`Failed to import prospect: ${prospect.first_name} ${prospect.last_name}`, error);
        failed++;
      } else {
        console.log(`Imported prospect: ${data.first_name} ${data.last_name} (ID: ${data.id})`);
        added++;
      }
    } catch (error) {
      console.error(`Error importing prospect: ${prospect.first_name} ${prospect.last_name}`, error);
      failed++;
    }
  }
  
  console.log('\nImport Results:');
  console.log(`Total: ${prospects.length}`);
  console.log(`Added: ${added}`);
  console.log(`Failed: ${failed}`);
  
  return { total: prospects.length, added, failed };
}

// Create a test campaign
async function createTestCampaign() {
  console.log('\nCreating a test campaign...');
  
  const campaign = {
    name: 'Test Marketing Campaign',
    description: 'Test campaign created by the test script',
    campaign_type: 'sms',
    status: 'active',
    created_by: 'system',
  };
  
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();
    
    if (error) {
      console.error('Failed to create test campaign', error);
      return null;
    }
    
    console.log(`Created test campaign: ${data.name} (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error('Error creating test campaign', error);
    return null;
  }
}

// Assign prospects to campaign
async function assignProspectsToCampaign(campaignId) {
  console.log('\nAssigning prospects to campaign...');
  
  try {
    // Get all prospects
    const { data: prospects, error: prospectError } = await supabase
      .from('prospects')
      .select('id')
      .limit(5);
    
    if (prospectError) {
      console.error('Failed to get prospects', prospectError);
      return;
    }
    
    if (!prospects || prospects.length === 0) {
      console.log('No prospects found to assign');
      return;
    }
    
    console.log(`Assigning ${prospects.length} prospects to campaign ${campaignId}`);
    
    // Create assignments
    const assignments = prospects.map(prospect => ({
      prospect_id: prospect.id,
      campaign_id: campaignId,
      assigned_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('prospect_campaigns')
      .upsert(assignments, { onConflict: 'prospect_id,campaign_id' });
    
    if (error) {
      console.error('Failed to assign prospects to campaign', error);
    } else {
      console.log(`Successfully assigned ${prospects.length} prospects to campaign`);
    }
  } catch (error) {
    console.error('Error assigning prospects to campaign', error);
  }
}

// Main function to run tests
async function runTests() {
  try {
    console.log('=== PROSPECT IMPORT TEST ===');
    
    // Create and import sample prospects
    const filePath = createSampleProspectFile();
    const importResults = await testProspectImport(filePath);
    
    if (importResults.added > 0) {
      // Create a test campaign
      const campaign = await createTestCampaign();
      
      if (campaign) {
        // Assign prospects to campaign
        await assignProspectsToCampaign(campaign.id);
      }
    }
    
    console.log('\nTest completed successfully!');
    console.log('You can now run the application and verify the import functionality in the UI');
    console.log('Access the prospects page at: http://localhost:5173/admin-dashboard/prospects');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the tests
runTests();