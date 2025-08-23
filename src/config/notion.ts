const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialise Notion client
const notionClient = new Client({
  auth: process.env.api_key,
});

const notionDatabaseId = process.env.database_id;

if (!notionDatabaseId) {
  throw new Error('Database ID not found');
}

console.log('Notion client initialised successfully');

module.exports = {
  notion: notionClient,
  databaseId: notionDatabaseId
};
