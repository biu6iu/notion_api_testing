const endpoints = require('../api/endpoints');
const assert = require('assert');

// Test functions
async function test_get_database_info() {
  console.log('Testing get database info:');

  const dbInfo = await endpoints.getDatabaseInfo();

  console.log('Database info retrieved:', dbInfo.data.totalPages, 'pages found\n');

  assert(dbInfo.success === true, 'Database info should be successful');
  assert(typeof dbInfo.data.totalPages === 'number', 'Total pages should be a number');
  return dbInfo;
}

async function test_create_page_success() {
  console.log('Testing create page success:');

  const newPage = await endpoints.createNewPage({
    name: 'Jake', 
    role: 'Marketing', 
    whyApplying: 'I love reels', 
    email: 'jake123@gmail.com'
  });

  console.log('New page created:', newPage.data.id, '\n');
  assert(newPage.data.id, 'New page should have an ID');
  assert(newPage.success === true, 'Page creation should be successful');
  return newPage;
}


async function test_create_partial_page() {
  console.log('Testing create partial page:');

  const partialPage = await endpoints.createNewPage({
    name: 'Qitao', 
    role: 'Hackathon', 
    whyApplying: 'I am the president'
    // email missing
  });

  console.log('Partial page created: ', partialPage.data.id, '\n');
  assert(partialPage.data.id, 'Partial page should have an ID');
  assert(partialPage.success === true, 'Partial page creation should be successful');
  return partialPage;
}

async function test_invalid_role_validation() {
  console.log('Testing invalid role validation:');

  try {
    await endpoints.createNewPage({name: 'Geoffrey', role: 'President'});
    assert.fail('Should have thrown an error for invalid role');
  } catch (error) {
    console.log('Validation working - caught invalid role error: ', (error as Error).message, '\n');
    assert((error as Error).message.includes('Invalid role'), 'Error should mention invalid role');
  }
}

async function test_missing_name_validation() {
  console.log('Testing missing name validation:');

  try {
    await endpoints.createNewPage({});
    assert.fail('Should have thrown an error for missing name');
  } catch (error) {
    console.log('Validation working - caught missing name error: ', (error as Error).message, '\n');
    assert((error as Error).message.includes('Page name is required'), 'Error should mention missing name');
  }
}

async function test_search_pages() {
  console.log('Testing search pages:');

  const searchResults = await endpoints.searchPages('Jake');

  console.log('Search results retrieved:', searchResults.data?.length || 0, 'results\n');
  assert(searchResults.success === true, 'Search should be successful');
  assert(searchResults.data, 'Search should have data');
  assert(Array.isArray(searchResults.data), 'Search data should be an array');
  return searchResults;
}

async function test_empty_search_validation() {
  console.log('Testing empty search validation:');

  try {
    await endpoints.searchPages(''); 
    assert.fail('Should have thrown an error for empty search');
  } catch (error) {
    console.log('Validation working - caught empty search query error: ', (error as Error).message, '\n');
    assert((error as Error).message.includes('Search query is required'), 'Error should mention empty search query');
  }
}

async function test_get_page_by_id() {
  console.log('Testing get page by ID:');

  const testPage = await endpoints.createNewPage({
    name: 'Test Page for Get',
    role: 'Education'
  });
  
  const pageById = await endpoints.getPageById(testPage.data.id);

  console.log('Page retrieved by ID:', pageById.data.properties.Name.title[0].plain_text, '\n');
  assert(pageById.success === true, 'Get page by ID should be successful');
  assert(pageById.data.id === testPage.data.id, 'Retrieved page should match created page ID');
  
  // Delete it
  await endpoints.archivePageById(testPage.data.id);
  return pageById;
}

async function test_update_page_by_id() {
  console.log('Testing update page by ID:');

  const testPage = await endpoints.createNewPage({
    name: 'Test Page for Update',
    role: 'Marketing'
  });
  
  const updatedPage = await endpoints.updatePageById(testPage.data.id, { 
    name: 'Andre', 
    role: 'Education', 
    whyApplying: 'I want to educate people', 
    email: 'andre@gmail.com'
  });

  console.log('Page updated:', updatedPage.data.properties.Name.title[0].plain_text, '\n');

  assert(updatedPage.success === true, 'Update page should be successful');
  assert(updatedPage.data.properties.Name.title[0].plain_text === 'Andre', 'Name should be updated');
  
  // Delete it 
  await endpoints.archivePageById(testPage.data.id);
  return updatedPage;
}

async function test_archive_page_by_id() {
  console.log('Testing archive page by ID:');

  const testPage = await endpoints.createNewPage({
    name: 'Test Page for Archive',
    role: 'Student Engagement'
  });
  
  const archivedPage = await endpoints.archivePageById(testPage.data.id);
  console.log('Page archived:', archivedPage.message, '\n');
  assert(archivedPage.success === true, 'Archive page should be successful');
  assert(archivedPage.message.includes('archived'), 'Message should mention archiving');
  return archivedPage;
}

// Run all tests
async function runTests() {
  console.log('Starting Notion API Tests\n');
  
  try {
    await test_get_database_info();
    await test_create_page_success();
    await test_create_partial_page();
    await test_invalid_role_validation();
    await test_missing_name_validation();
    await test_search_pages();
    await test_empty_search_validation();
    await test_get_page_by_id();
    await test_update_page_by_id();
    await test_archive_page_by_id();
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Export for use in other files
module.exports = {
  test_create_page_success,
  test_get_database_info,
  test_create_partial_page,
  test_invalid_role_validation,
  test_missing_name_validation,
  test_search_pages,
  test_empty_search_validation,
  test_get_page_by_id,
  test_update_page_by_id,
  test_archive_page_by_id,
  runTests
};

if (require.main === module) {
  runTests();
}
