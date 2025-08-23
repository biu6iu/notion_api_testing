import { PredefinedRole } from '../types/notion';

export function createPageProperties(pageData: {
  name: string;
  role: PredefinedRole;
  whyApplying?: string;
  email?: string;
}) 
{
  const validRoles: PredefinedRole[] = ['Education', 'Student Engagement', 'Marketing', 'Hackathon', 'Sponsorships'];
  if (!validRoles.includes(pageData.role)) {
    throw new Error(`Invalid role: ${pageData.role}. Valid roles are: ${validRoles.join(', ')}`);
  }

  const properties: any = {
    Name: {
      title: [
        {
          text: {
            content: pageData.name
          }
        }
      ]
    }
  };

  if (pageData.role) {
    properties.Role = {
      select: {
        name: pageData.role
      }
    };
  }

  if (pageData.whyApplying) {
    properties['Why are you applying?'] = {
      rich_text: [
        {
          text: {
            content: pageData.whyApplying
          }
        }
      ]
    };
  }

  if (pageData.email) {
    properties.Email = {
      email: pageData.email
    };
  }

  return properties;
}

// Error handler for API calls
export function handleApiError(error: any, operation: string): never {
  console.error(`Error in ${operation}:`, error);
  
  if (error.code === 'unauthorized') {
    throw new Error('Notion API key is invalid or expired');
  } else if (error.code === 'object_not_found') {
    throw new Error('Database or page not found');
  } else if (error.code === 'rate_limited') {
    throw new Error('Rate limit exceeded. Please try again later');
  } else {
    throw new Error(`API error: ${error.message || 'Unknown error'}`);
  }
}

// Pagination helper
export function createPaginationOptions(pageSize: number = 100, startCursor?: string) {
  const options: any = {
    page_size: pageSize
  };
  
  if (startCursor) {
    options.start_cursor = startCursor;
  }
  
  return options;
}
