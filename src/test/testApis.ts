const endpoints = require('../api/endpoints');


async function test() {
  
  try {
    // Test 1: Get database information
    const dbInfo = await endpoints.getDatabaseInfo();
    console.log('Database info:', dbInfo.data.totalPages, 'pages found\n');
    
    // Test 2: Create a new page
    const newPage = await endpoints.createNewPage(
      {name: 'Jake', 
       role: 'Marketing', 
       whyApplying: 'I love reels', 
       email: 'jake123@gmail.com'
      }
    );
    console.log('New page created:', newPage.data.id);

    // Test 3: Partial information (no email)
    const partialPage = await endpoints.createNewPage(
      {name: 'Qitao', 
       role: 'Hackathon', 
       whyApplying: 'I am the president'
      }
    );
    console.log('Partial page created:', partialPage.data.id);

    // Test 4: Invalid role
    try {
      await endpoints.createNewPage({name: 'Joe', role: 'President'});
    } catch (error) {
      console.log('Validation working - caught invalid role error');
    }

    // Test 5: Create page with no name
    try {
      await endpoints.createNewPage({});
    } catch (error) {
      console.log('Validation working - caught missing name error');
    }

    // Test 6: Search with query
    const searchResults = await endpoints.searchPages('Jake');
    console.log('Search results:', searchResults.data.results);
    
    // Test 7: Search with empty query
    try {
      await endpoints.searchPages(''); 
    } catch (error) {
      console.log('Validation working - caught empty search query error');
    }

    // Test 8: Get page by id
    const pageById = await endpoints.getPageById(newPage.data.id);
    console.log('Page by id:', pageById.data.properties.Name.title[0].plain_text);

    // Test 9: Update page by id
    const updatedPage = await endpoints.updatePageById(newPage.data.id, { name: 'Andre', role: 'Education', whyApplying: 'I want to educate people', email: 'andre@gmail.com'});
    console.log('Updated page:', updatedPage.data.properties.Name.title[0].plain_text);

    // Test 10: Archive page by id
    const archivedPage = await endpoints.archivePageById(newPage.data.id);
    console.log('Archived page:', archivedPage.message);

  } catch (error) {
    console.error('Error during API testing:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting Notion API Tests\n');
  
  await test();
  
  console.log('\nTesting complete.');
}

// Export for use in other files
module.exports = {
  test,
  runTests
};

if (require.main === module) {
  runTests();
}
