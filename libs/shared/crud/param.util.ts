import { BadRequestException } from '@nestjs/common';
import { isEmpty } from 'lodash';

import { IncludeOption, SearchParams, SortParam, GetParams, DeleteParams } from './param.interface';
import { DEFAULT_SEARCH_OPTIONS } from './constant.util';

const normalizePagingParams = query => {
  let page = 1;
  const limit = query.limit ? parseInt(query.limit, 10) : DEFAULT_SEARCH_OPTIONS.LIMIT;
  let offset = DEFAULT_SEARCH_OPTIONS.OFFSET;

  if (!query.all) {
    if (!isNaN(query.page)) {
      page = parseInt(query.page, 10);
    }

    if (page < -1) {
      throw new BadRequestException();
    }

    offset = (page - 1) * limit;
  }

  return { offset, limit, page, all: !!query.all };
};

const parseIncludeParam = (query, fields) => {
  if (query.include) {
    const includes = query.include.split(',');
    const result: IncludeOption[] = [];

    for (const item of includes) {
      const itemWithDot = `${item}.`;
      const columns = fields
        .filter(field => {
          if (field.includes(`${item}.`)) {
            const tempField = field.replace(itemWithDot);

            return tempField.indexOf('.') === -1;
          }

          return false;
        })
        .map(field => field.replace(item).split('.')[1]);

      const includeOption: IncludeOption = {
        alias: item,
        select: columns,
        required: query.required ? query.required : undefined,
      };

      result.push(includeOption);
    }

    return result;
  }

  return null;
};

export const parseSortParam = (sorts): SortParam[] => {
  sorts = (sorts || '').split(',');
  const result: SortParam[] = [];

  sorts.forEach(sort => {
    if (!sort) {
      return null;
    }

    const firstChar = sort.trim().slice(0, 1);
    const sortField = firstChar === '-' ? sort.slice(1) : sort.trim();
    const sortedOptions = sortField.split('.');
    let field;
    let alias;

    if (sortedOptions.length === 1) {
      field = sortedOptions[0];
    } else {
      alias = sortedOptions[0];
      field = sortedOptions[1];
    }

    result.push({ alias, field, order: firstChar === '-' ? 'DESC' : 'ASC' });
  });

  return result;
};

export const parseSearchParams = query => {
  const fields = (query.fields || '').split(',');
  const searchFields = (query['search-fields'] || '').split(',');
  const searchQueries: SearchParams = {
    keyword: query.keyword,
    searchFields: searchFields,
    pagingParams: normalizePagingParams(query),
    sorts: parseSortParam(query.sorts),
    include: parseIncludeParam(query, fields),
    origin: query,
  };

  if (query.fields) {
    searchQueries.fields = fields.filter(field => !field.includes('.'));
  }

  return searchQueries;
};

export const parseGetParams = query => {
  const fields = (query.fields || '').split(',');
  const getQueries: GetParams = {
    include: parseIncludeParam(query, fields),
  };

  if (query.fields) {
    getQueries.fields = fields.filter(field => !field.includes('.'));
  }

  return getQueries;
};

export const parseDeleteParams = query => {
  const deleteQueries: DeleteParams = {
    include: parseIncludeParam(query, []),
  };

  return deleteQueries;
};
