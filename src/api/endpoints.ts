const notionService = require('./notionService');
const { createPageProperties, handleApiError } = require('../utils/helpers');


// GET /api/database - Get database information and list all pages
async function getDatabaseInfo() {
  try {
    const [properties, pages] = await Promise.all([
      notionService.getDatabaseProperties(),
      notionService.queryDatabase()
    ]);
    
    return {
      success: true,
      data: {
        properties: properties.properties,
        pages: pages.results,
        totalPages: pages.results.length
      }
    };
  } catch (error) {
    return handleApiError(error, 'getDatabaseInfo');
  }
}

// POST /api/pages - Create a new page
async function createNewPage(pageData: any) {
  try {
    // Validate the page data
    if (!pageData.name) {
      throw new Error('Page name is required');
    }
    
    // Create the page properties
    const properties = createPageProperties(pageData);
    
    // Create the page
    const newPage = await notionService.createPage(properties);
    
    return {
      success: true,
      data: newPage,
      message: 'Page created successfully'
    };
  } catch (error) {
    return handleApiError(error, 'createPageProperties');
  }
}


// GET /api/pages/:id - Get a specific page
async function getPageById(pageId: string) {
  try {
    const page = await notionService.getPage(pageId);
    
    return {
      success: true,
      data: page
    };
  } catch (error) {
    return handleApiError(error, 'getPageById');
  }
}

// PUT /api/pages/:id - Update a page
async function updatePageById(pageId: string, updateData: any) {
  try {
    if (!updateData.name) {
      throw new Error('Page name is required for update');
    }
    
    const properties = createPageProperties(updateData);
    const updatedPage = await notionService.updatePage(pageId, properties);
    
    return {
      success: true,
      data: updatedPage,
      message: 'Page updated successfully'
    };
  } catch (error) {
    return handleApiError(error, 'updatePageById');
  }
}

// DELETE /api/pages/:id - Archive a page
async function archivePageById(pageId: string) {
  try {
    await notionService.deletePage(pageId);
    
    return {
      success: true,
      message: 'Page archived successfully'
    };
  } catch (error) {
    return handleApiError(error, 'archivePageById');
  }
}

// GET /api/search - Search pages
async function searchPages(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    const results = await notionService.searchPages(query);
    
    return {
      success: true,
      data: results.results,
      totalResults: results.results.length
    };
  } catch (error) {
    return handleApiError(error, 'searchPages');
  }
}

module.exports = {
  getDatabaseInfo,
  createNewPage,
  getPageById,
  updatePageById,
  archivePageById,
  searchPages,
};
