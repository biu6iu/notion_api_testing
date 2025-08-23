// Notion API response types
export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  url: string;
  properties: Record<string, any>;
}

export interface NotionDatabase {
  id: string;
  title: string[];
  properties: Record<string, any>;
  description: string[];
}

export interface NotionQueryResponse {
  object: 'list';
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
  page: any;
}

export type PredefinedRole = 'Education' | 'Student Engagement' | 'Marketing' | 'Hackathon' | 'Sponsorships';

export interface DatabaseProperties {
  Name: {
    title: Array<{  
      plain_text: string;
      href: string | null;
      annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
      };
    }>;
  };
  Role?: {
    select: {
      name: PredefinedRole;
    };
  };
  'Why are you applying?'?: {
    rich_text: Array<{
      text: {
        content: string;
      };
    }>;
  };
  Email?: {
    email: string;
  };
}

// API request types
export interface CreatePageRequest {
  properties: Partial<DatabaseProperties>;
}

export interface UpdatePageRequest {
  pageId: string;
  properties: Partial<DatabaseProperties>;
}

export interface QueryDatabaseRequest {
  filter?: any;
  sorts?: any[];
  page_size?: number;
  start_cursor?: string;
}
