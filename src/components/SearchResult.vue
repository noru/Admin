<template>
  <div class="search-result">
    <vuetable
      :api-url="apiUrl"
      :fields="columns"
      data-path="hits.hit"
      pagination-path="pagination"
      pagination-component="pagination"
      :pagination-info-template="$t('pagination_info_template', ['{from}', '{to}', '{total}'])"
      :pagination-info-no-data-template="$t('no_data')"
      :query-params="{ sort: '' }"
      :append-params="params"
    >
    </vuetable>
  </div>
</template>
<style>
  .search-result table {
    border-collapse: separate;
  }
  .search-result thead {
    background-color: #EEE;
  }
  .search-result table > thead > tr > th {
    border: #DDD 1px solid;
    border-top: #DDD 1px solid !important;
    border-collapse: separate;
  }
  .search-result table > thead > tr > th:first-of-type {
    border-top-left-radius: 4px;
    -webkit-border-top-left-radius: 4px;
    -moz-border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .search-result table > thead > tr > th:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .search-result table > tbody > tr:first-of-type td {
    border-top: none;
  }
  .search-result table > tbody > tr > td:last-of-type {
    text-align: center;
  }
  .search-result table > tbody > tr:nth-of-type(even){
    background-color: #F5F5F5;
  }
  .search-result table ~ .vuetable-pagination {
    display: flex;
    justify-content: space-between;
  }
  .search-result table ~ .vuetable-pagination .pagination {
    margin: 0;
    position: relative;
    top: 3px;
  }
  .col-id {
    max-width: 100px;
    word-break: break-all;
  }
</style>
<style scoped>
  .search-result {
    min-width: 800px;
    margin-right: 15px;
  }
</style>
<script>
  import ThumbnailAndName from './ThumbnailAndName'
  import Status from './StatusText'
  import ActionDropdown from './Actions'
  import Pagination from './Pagination'
  import { HOST } from '../plugins/service'
  import SearchHelper from '../helpers/search'

  // vue-table doesn't support local registration
  Vue.component('thumbnail-name', ThumbnailAndName)
  Vue.component('status', Status)
  Vue.component('action-dropdown', ActionDropdown)
  Vue.component('pagination', Pagination)

  export default {
    props: {
      apiUrl: {
        type: String,
        default: `${HOST}/Asset/CloudSearch`
      },
      searchOptions: {
        type: Object,
        require: true
      }
    },
    computed: {
      params: function () {
        const searchOptions = this.searchOptions
        const params = SearchHelper.buildSearchParams(searchOptions.q, searchOptions.searchBy, searchOptions.skip, searchOptions.top, searchOptions.selectedFilters)
        return Object.keys(params).map((key) => `${key}=${params[key]}`)
      }
    },
    data() {
      return {
        columns: [
          {
            name: 'id',
            title: Vue.t('id'),
            dataClass: 'col-id'
          },
          {
            name: '__component:thumbnail-name',
            title: Vue.t('thumbnail_and_name')
          },
          {
            name: '__component:status',
            title: Vue.t('status')
          },
          {
            name: 'fields.owner',
            title: Vue.t('owner')
          },
          {
            name: 'fields.updated',
            title: Vue.t('updated_time'),
            callback: 'getDateString'
          },
          {
            name: 'fields.category',
            title: Vue.t('filters.category._title'),
          },
          {
            name: '__component:action-dropdown',
            title: Vue.t('actions')
          }
        ]
      }
    },
    methods: {
      getDateString(d) {
        return new Date(d).toLocaleDateString() // todo: time?
      },
      transform: function(body) {
        return SearchHelper.setPagination(body, this.searchOptions.top)
      }
    },
    events: {
      'vuetable:loading': function() { this.$root.showSpinner() },
      'vuetable:load-success': function() { this.$root.hideSpinner() },
      'vuetable:load-error': function() {
        this.$root.hideSpinner()
        this.$toast(Vue.t('msg.opps'))
      }
    }
  }
</script>
