const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialise Notion client
const notion = new Client({
  auth: process.env.api_key,
});


const databaseId = process.env.database_id;

if (!databaseId) {
  throw new Error('Database ID not found in environment variables');
}

console.log('Notion client initialised successfully');


async function queryDatabase() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    console.log('📋 Database query successful');
    console.log(`📄 Found ${response.results.length} pages`);
    
    return response;
  } catch (error) {
    console.error('Error querying database:', error);
    throw error;
  }
}

// Function to get database properties
async function getDatabaseProperties() {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    console.log('🔍 Database properties retrieved');
    console.log('📋 Properties:', Object.keys(response.properties));
    
    return response;
  } catch (error) {
    console.error('Error getting database properties:', error);
    throw error;
  }
}

// Function to create a new page in the database
async function createPage(properties: any) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties,
    });
    
    console.log('Page created successfully');
    
    return response;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

// Function to update a page
async function updatePage(pageId: string, properties: any) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties,
    });
    
    console.log('Page updated successfully');
    return response;
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
}

// Function to delete a page
async function deletePage(pageId: string) {
  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    
    console.log('Page archived successfully');
  } catch (error) {
    console.error('Error archiving page:', error);
    throw error;
  }
}

// Main function to test the connection
async function main() {
  try {
    // Test database connection by getting properties
    await getDatabaseProperties();
    
    // Test database query
    await queryDatabase();
    
    
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

// Export the notion client for use in other modules
module.exports = {
  notion,
  databaseId,
  queryDatabase,
  getDatabaseProperties,
  createPage,
  updatePage,
  deletePage
};
