export interface IncludeOption {
  required?: boolean;
  alias: string;
  select: string[];
}

export interface SortParam {
  alias?: string;
  field: string;
  order: string;
}

export interface PagingParams {
  page: number;
  limit: number;
  offset: number;
  all?: boolean;
}

export class SearchParams {
  fields?: string[];
  searchFields?: string[];
  pagingParams?: PagingParams;
  include?: IncludeOption[];
  sorts?: SortParam[];
  origin?: any;
  keyword?: string;
}

export class SearchEntityParams {
  'search-fields'?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  sorts?: string;
  include?: string;
  fields?: string;
  all?: boolean;
  required?: boolean;
}

export class GetParams {
  fields?: string[];
  include?: IncludeOption[];
}

export class DeleteParams {
  include?: IncludeOption[];
}

export class GetEntityParams {
  include?: string;
  fields?: string;
  required?: boolean;
}
