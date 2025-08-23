const { notion, databaseId } = require('../config/notion');


async function queryDatabase() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    console.log('Database query successful');
    console.log(`Found ${response.results.length} pages`);
    
    return response;
  } catch (error) {
    console.error('Error querying database:', error);
    throw error;
  }
}


async function getDatabaseProperties() {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    console.log('Database properties retrieved');
    console.log('Properties:', Object.keys(response.properties));
    
    return response;
  } catch (error) {
    console.error('Error getting database properties:', error);
    throw error;
  }
}


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


async function getPage(pageId: string) {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });
    
    console.log('Page retrieved successfully');
    return response;
  } catch (error) {
    console.error('Error retrieving page:', error);
    throw error;
  }
}


async function searchNotionPages(query: string) {
  try {
    const response = await notion.search({
      query,
      filter: {
        property: 'object',
        value: 'page'
      }
    });
    
    console.log('Search completed successfully');
    return response;
  } catch (error) {
    console.error('Error searching pages:', error);
    throw error;
  }
}

module.exports = {
  queryDatabase,
  getDatabaseProperties,
  createPage,
  updatePage,
  deletePage,
  getPage,
  searchPages: searchNotionPages
};
