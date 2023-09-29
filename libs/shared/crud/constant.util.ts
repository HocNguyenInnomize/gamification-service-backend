export const DEFAULT_SEARCH_OPTIONS = {
  LIMIT: 10,
  OFFSET: 0,
};

export enum ACTION {
  SEARCH = 'search',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum TYPEORM_BOOLEAN {
  TRUE = 1,
  FALSE = 0,
}
