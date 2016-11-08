// TODO, fuzzy search not supported for structured query
// https://forums.aws.amazon.com/thread?jspa?messageID=722412
// workaround: term + prefix
const TERM_TITLE = (condition) => condition ? or(`term field='ui_name' boost=10 '${condition}'`, `prefix field='ui_name' boost=5 '${condition}'`) : 'matchall'
const TERM_OWNER = (condition) => condition ? or(...condition.split(' ').map(id => `term field='owner' '${id}'`)) : 'matchall'
const TERM_ID = (condition) => condition ? or(`term field='_id' '${condition}'`, `term field='_id' 'adsk.raas:asset.name:${condition}'`, `term field='identifier' '${condition}'`) : ''
const QUERY_PARAM_TEMPLATE = {
  q: '',
  sort: 'updated desc',
  'q.parser': 'structured',
  domain: 'materials',
  size: 0,
  start: 0
}

function and(...expr) {
  return composed('and', ...expr)
}

function or(...expr) {
  return composed('or', ...expr)
}

function composed(op, ...expr) {
  expr = expr.filter(Boolean)
  switch (expr.length) {
    case 0:
      return
    case 1:
      return `(${expr[0]})`
    default:
      return `(${op} (${expr.join(') (')}))`
  }
}

function queryBuilder(str, queryBy) {
  var queryString = ''

  queryBy = queryBy || 'name'

  switch (queryBy) {
    case 'name':
      queryString = TERM_TITLE(str)
      break
    case 'owner':
      queryString = TERM_OWNER(str)
      break
    case 'id':
      queryString = TERM_ID(str)
      break
    default:
      break
  }
  return queryString
}

function facetBuilder(filter) {
  if (!filter) return
  let statusFilter = ''
  if (filter.status) {
    switch (filter.status) {
      case 'private':
        statusFilter = "term field='read_access' 1"
        break
      case 'public':
        statusFilter = "term field='read_access' 0"
        break
    }
  }
  let categoriesFilter = ''
  if (filter.categories && filter.categories !== 'all') {
    categoriesFilter = "term field='category' '" + filter.categories + "'"
  }
  return and(statusFilter, categoriesFilter)
}

export default {

  buildSearchParams(qString, queryBy, skip, top, filter = null) {
    let extQueryParam = {
      q: queryBuilder(qString, queryBy),
      size: top,
      start: skip
    }

    let facets = facetBuilder(filter)
    if (facets) {
      extQueryParam.fq = facets
    }
    return jQuery.extend({}, QUERY_PARAM_TEMPLATE, extQueryParam)
  },

  // vue-table requires such format
  setPagination(body, top) {
    const data = body.hits
    body.pagination = {
      total: data.found,
      per_page: top,
      current_page: Math.ceil(data.start / top) + 1,
      last_page: Math.ceil(data.found / top),
      from: data.start + 1,
      to: data.start + data.hit.length
    }
    return body
  }
}

