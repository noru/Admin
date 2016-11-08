<template>
  <div class="mini-search">
    <label>{{$t('find_material')}}</label>
    <div class="search-box">
      <vs-ds
        :list="searchByOptions"
        :model.sync="searchBy"
        size="sm"
        variant="secondary"
        class="search-by"
        :caret="true"
        ></vs-ds>
      <vs-input type="text" :model.sync="q" @keyup.enter.stop="search"></vs-input>
      <a class="search-btn" @click.stop="search">
        <icon name="search"></icon>
      </a>
    </div>
    <vuetable
      :api-url="apiUrl"
      :fields="columns"
      :load-on-start="false"
      data-path="hits.hit"
      pagination-path="pagination"
      pagination-component="pagination"
      pagination-info-template=""
      :pagination-info-no-data-template="$t('no_data')"
      :query-params="{ sort: '' }"
      :append-params="params"
    >
    </vuetable>
  </div>
</template>
<style>
  .mini-search .search-box input {
    height: 30px;
    border: #29ABE2 1px solid;
    color: #29ABE2;
  }
  .mini-search .search-box .form-group {
    width: 71%;
  }

  .mini-search thead {
    display: none;
  }
  .mini-search .thumbnail-name .thumbnail {
    width: 40px;
    height: 40px;
  }
  .mini-search .thumbnail-name .name {
    font-size: 1.1rem;
  }
  .mini-search .vuetable-pagination {
    background: transparent !important;
  }
  .mini-search .vuetable-pagination nav {
    display: flex;
    justify-content: center;
  }
  .mini-search .vuetable-pagination nav .pagination{
    margin: 0;
  }
  .mini-search .pagination > li > a {
    height: 25px;
    padding: 6px 9px;
    font-size: 1rem;
  }
  .mini-search .pagination > li.prev > a > .fa-icon,
  .mini-search .pagination > li.next > a > .fa-icon {
    margin-top: -2px;
  }
  .mini-search table > tbody > tr:nth-of-type(even){
    background-color: #F5F5F5;
  }
  .mini-search table > tbody > tr:nth-of-type(n+6){
    display: none;
  }
  .mini-search table > tbody > tr:hover {
    cursor: pointer;
    background-color: #caffb6;
  }
  .mini-search table > tbody > tr.selected {
    cursor: pointer;
    background-color: #adf5ff;
  }
  .mini-search table {
    margin-bottom: 14px;
  }

  .mini-search label {
    margin-left:10px;
  }

</style>
<style scoped>
  .search-box {
    padding-bottom: 14px;
    position: relative;
    left: 4px;
  }
  .search-box > * {
    display: inline-block;
    vertical-align: middle;
    left: 8px;
  }
  .search-btn {
    display: inline-block;
    border: #29ABE2 1px solid;
    width: 30px;
    height: 30px;
    text-align: center;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    color: white;
    background-color: #29ABE2;
    line-height: 35px;
    position: relative;
    left: -6px;
  }
  .search-btn:hover {
    filter: brightness(120%);
  }
  .search-btn:active {
    filter: brightness(80%);
  }
</style>
<script>
  import { HOST } from '../plugins/service'
  import SearchHelper from '../helpers/search'

  const PER_PAGE = 5
  let $vm

  function busyState(isBusy) {
    $vm.modalState.busy = isBusy
  }

  const data = {
    q: '',
    searchBy: '',
    page: 1
  }

  export default{
    props: {
      columns: {
        type: Object,
        default: function () {
          return [
            {
              name: '__component:thumbnail-name',
              title: Vue.t('thumbnail_and_name')
            },
            {
              name: 'category',
              title: Vue.t('filters.category._title')
            }
          ]
        }
      },
      apiUrl: {
        type: String,
        default: `${HOST}/Asset/CloudSearch`
      },
      selectedRow: {
        type: Object,
        required: true,
        towWay: true
      },
      modalState: {
        type: Object,
        required: true,
        towWay: true
      },
      searchByOptions: {
        type: Array,
        required: true
      }
    },
    computed: {
      params: function () {
        // Only list public assets to publish
        const filter = { status: 'public' }
        const params = SearchHelper.buildSearchParams(this.q, this.searchBy, (this.page - 1) * PER_PAGE, PER_PAGE, filter)
        return Object.keys(params).map((key) => `${key}=${params[key]}`)
      }
    },
    data() {
      return data
    },
    events: {
      'vuetable:reload': function() {
        // do nothing, simply block search action from main page
      },
      'vuetable:load-success': function () {
        busyState(false)
      },
      'vuetable:load-error': function (err) {
        busyState(false)
        console.error(err)
        this.$toast('hoho')
      },
      'action::change-page': function(page) {
        busyState(true)
        this.page = page
        Vue.nextTick(() => this.$broadcast('vuetable:reload'))
      },
      'vuetable:row-clicked': function(row, event) {
        this.selectedRow.data = row
        const $tr = jQuery(event.target)
        $tr.parents('tbody').find('tr').removeClass('selected')
        $tr.parents('tr').addClass('selected')
      }
    },
    methods: {
      search: function() {
        busyState(true)
        this.page = 1
        this.selectedRow.data = null
        Vue.nextTick(() => this.$broadcast('vuetable:reload'))
      },
      transform: function (body) {
        return SearchHelper.setPagination(body, PER_PAGE)
      }
    },
    created() {
      $vm = this
      data.searchBy = this.searchByOptions[0].value
    }
  }
</script>
