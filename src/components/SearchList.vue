<template>
  <div class="search-list">
    <div class="list-header">
      <vs-btn-group class="per-page" :value.sync="searchOptions.top">
        <radio v-for="opt in perPage" :value="opt.value">{{ opt.text }}</radio>
      </vs-btn-group>
      <search-box
        :search-by-options="[{ text: $t('name'), value: 'name' }, { text: $t('owner'), value: 'owner' }, {text: $t('id'), value: 'id'}]"
        :search="search"
      ></search-box>
    </div>
    <div class="result-container">
      <search-result class="search-result" :search-options="getOptions()"></search-result>
      <search-filters class="search-filters" :filters="filters" :model.sync="searchOptions.selectedFilters"></search-filters>
    </div>

    <vs-modal id="publish" class="publish-modal">
      <div slot="modal-header">
        <div class="header-text">{{ $t('publish_material').toUpperCase() }}</div>
      </div>
      <div slot="modal-body">
        <vs-btn variant="primary" @click="copyToNewMaterial">{{ $t('create_new').toUpperCase() }}</vs-btn>
        <vs-btn variant="primary" @click="replaceExisting">{{ $t('replace_existing').toUpperCase() }}</vs-btn>
      </div>
    </vs-modal>

    <vs-modal id="unpublish" class="unpublish-modal">
      <div slot="modal-header">
        <div class="header-text">{{ $t('unpublish_material').toUpperCase() }}</div>
      </div>
      <div slot="modal-body">
        <vs-input type="text" :model.sync="newMaterialOwner" :label="$t('enter_owner_desc')"></vs-input>
      </div>
      <div slot="modal-footer">
        <vs-btn variant="primary" @click="unpublishMaterialTo" :disabled="newMaterialOwner === ''">{{ $t('unpublish').toUpperCase() }}</vs-btn>
      </div>
    </vs-modal>

    <vs-modal id="copy-as-private" class="copy-as-private-modal">
      <div slot="modal-header">
        <div class="header-text">{{ $t('copy_material').toUpperCase() }}</div>
      </div>
      <div slot="modal-body">
        <vs-input type="text" :model.sync="newMaterialOwner" :label="$t('copy_material_desc')"></vs-input>
      </div>
      <div slot="modal-footer">
        <vs-btn variant="primary" @click="copyMaterialAsPrivate" :disabled="newMaterialOwner === ''">{{ $t('copy').toUpperCase() }}</vs-btn>
      </div>
    </vs-modal>

    <vs-modal id="create-new" class="publish-modal" :close-on-backdrop="false">
      <div slot="modal-header">
        <div class="header-text inline">{{ $t('create_new').toUpperCase() }}</div>
        <div class="modal-control inline">
          <icon v-if="modal.busy" name="spinner" spin></icon>
          <icon v-if="!modal.busy" name="times" @click="$root.closeModal('create-new')"></icon>
        </div>
      </div>
      <div slot="modal-body">
        <vs-input type="text" :model.sync="newMaterialName" :label="$t('name')"></vs-input>
        <vs-input type="text" :model.sync="newMaterialIdentifier" :label="$t('identifier')"></vs-input>
        <div>
          <label>{{ $t('category') }}: </label><span>{{ selectedRow.fields.primary_category }}</span>
          <br>
          <label>{{ $t('sub_category') }}: </label><span>{{ selectedRow.fields.category }}</span>
        </div>
        <div >{{ $t('enter_identifier_desc') }}</div>
        <div >{{ $t('prefilled_company_families_desc') }}</div>
      </div>
      <div slot="modal-footer">
        <vs-btn variant="primary" @click="publishAsNew" :disabled="newMaterialName === ''">{{ $t('publish').toUpperCase() }}</vs-btn>
      </div>
    </vs-modal>

    <vs-modal id="replace-existing" class="publish-modal" :close-on-backdrop="false">
      <div slot="modal-header">
        <div class="header-text inline">{{ $t('replace_existing').toUpperCase() }}</div>
        <div class="modal-control inline">
          <icon v-if="modal.busy" name="spinner" spin></icon>
          <icon v-if="!modal.busy" name="times" @click="$root.closeModal('replace-existing')"></icon>
        </div>
      </div>
      <div slot="modal-body">
        <mini-search
          :selected-row="materialToReplace"
          :modal-state="modal"
          :search-by-options="[{ text: $t('name'), value: 'name' }, { text: $t('owner'), value: 'owner' }, {text: $t('id'), value: 'id'}]"
          ></mini-search>
      </div>
      <div slot="modal-footer">
        <vs-btn variant="primary" @click="publishToReplace" :disabled="!materialToReplace.data">{{ $t('replace').toUpperCase() }}</vs-btn>
      </div>
    </vs-modal>

  </div>
</template>
<style>
  .modal-control {
    float: right;
    cursor: pointer;
  }
  .search-list .btn-group .btn {
    border-color: #29ABE2;
    color: #29ABE2;
  }
  .search-list .btn-group .btn.active {
    background-color: #29ABE2;
    color: white;
  }
  .publish-modal .modal-dialog {
    width: 332px;
  }
  #publish .modal-footer {
    display: none;
  }
  #create-new .modal-dialog,
  #replace-existing .modal-dialog {
    width: 430px;
  }
  .per-page > label {
    padding: 7px 8px;
    font-size: 1.1rem;
    height: 30px;
  }
</style>
<style scoped>
  .search-list {
    width: 100%;
    height: 100%;
    padding: 16px 40px;
  }
  .list-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 15px;
  }
  .list-header > *,
  .result-container > *
  {
    display: inline-block;
  }
  .result-container > * {
    width: 100%;
  }
  .result-container {
    display: flex;
    justify-content: space-between;
  }
  .modal .btn {
    width: 300px;
    margin: auto auto 10px;
    display: block;
  }
  .header-text {
    text-align: left;
    color: #29ABE2;
  }
  #create-new label {
    margin-right: 5px;
  }
  #create-new label~span {
    color: grey;
  }
</style>
<script>
  import SearchBox from './SearchBox'
  import SearchResult from './SearchResult'
  import SearchFilters from './SearchFilters'
  import MiniSearch from './MiniSearch'

  let $vm

  const data = {
    searchOptions: {
      top: 25,
      skip: 0,
      q: '',
      searchBy: '',
      selectedFilters: {},
    },
    newMaterialName: '',
    materialToReplace: { data: null },
    newMaterialOwner: '',
    newMaterialIdentifier: '',
    modal: {
      busy: false
    },
    selectedRow: null
  }
  const ASSET_DESCRIPTION_TEMPLATES = {
    name: null,
    description: null,
    category: null,
    primary_Category: null,
    company: 'autodesk',
    families: ['prism', 'Prism.Fusion.2016'],
    identifier: null
  }
  const searchOptions = data.searchOptions
  const internal = {
    copy(materialId, to, readAccess, newOwner, desc, modalId) {
      const state = data.modal
      if (state.busy) return
      state.busy = true
      $vm.$s.copyMaterial(materialId, to, newOwner, readAccess, desc).then(
        function() {
          state.busy = false
          $vm.$toast(Vue.t('msg.copy_msg'))
          $vm.$broadcast('hide::modal', modalId)
        },
        function(err) {
          state.busy = false

          let actionKey = 'publish' // TODO, this is wacky situation, need clarification!
          if (newOwner) {
            actionKey = 'copy'
          }
          let action = Vue.t(actionKey)
          let title = Vue.t('action_failed', { action: action })
          let msg = Vue.t('msg.action_failed_msg', { action: action, status: err.status, message: err.body.Message || '' })
          $vm.$alert(title, msg)
          console.error(err)
        }
      )
    },
    publishMaterial(materialId, readAccess, newMaterialOwner, modalId) {
      const state = data.modal
      if (state.busy) return
      state.busy = true
      $vm.$s.publishMaterial(materialId, readAccess, newMaterialOwner).then(
        function() {
          state.busy = false
          $vm.$toast(Vue.t('msg.private_to_public_msg'))
          $vm.$broadcast('hide::modal', modalId)
        },
        function(err) {
          state.busy = false
          let action = Vue.t(readAccess === 0 ? 'publish' : 'unpublish')
          let title = Vue.t('action_failed', { action: action })
          let msg = Vue.t('msg.action_failed_msg', { action: action, status: err.status, message: err.body.message || '' })
          $vm.$alert(title, msg)
          console.error(err)
        }
      )
    }
  }

  const methods = {
    copyToNewMaterial() {
      $vm.$root.closeModal('publish')
      $vm.$root.showModal('create-new')
      this.newMaterialIdentifier = ''
    },
    replaceExisting() {
      $vm.$root.closeModal('publish')
      $vm.$root.showModal('replace-existing')
      data.materialToReplace.data = null
      Vue.nextTick(() => {
        jQuery('#replace-existing .mini-search .search-box input').select()
      })
    },
    publishAsNew() {
      if (this.newMaterialName === '') {
        $vm.$toast(Vue.t('Name can not be empty'))
        return
      }
      const desc = JSON.parse(JSON.stringify(ASSET_DESCRIPTION_TEMPLATES))
      desc.name = this.newMaterialName
      desc.identifier = this.newMaterialIdentifier
      internal.copy(data.selectedRow.id, null, 'Public', '', desc, 'create-new')
    },
    unpublishMaterialTo() {
      if (this.newMaterialOwner === '') {
        $vm.$toast(Vue.t('Owner can not be empty'))
        return
      }
      internal.publishMaterial(data.selectedRow.id, 1, this.newMaterialOwner, 'unpublish')
    },
    copyMaterialAsPrivate() {
      if (this.newMaterialOwner === '') {
        $vm.$toast(Vue.t('Owner can not be empty'))
        return
      }
      const desc = JSON.parse(JSON.stringify(ASSET_DESCRIPTION_TEMPLATES))
      desc.families = []
      desc.company = ''
      internal.copy(data.selectedRow.id, null, 'Private', this.newMaterialOwner, desc, 'copy-as-private')
    },
    publishToReplace() {
      if (!this.materialToReplace.data) {
        $vm.$toast(Vue.t('Please select a target material'))
        return
      }
      const desc = JSON.parse(JSON.stringify(ASSET_DESCRIPTION_TEMPLATES))
      internal.copy(data.selectedRow.id, this.materialToReplace.data.id, 'Public', '', desc, 'replace-existing')
    },
    search(input) {
      searchOptions.q = input.q
      searchOptions.searchBy = input.searchBy
      searchOptions.skip = 0
      Vue.nextTick(() => $vm.$broadcast('vuetable:reload'))
    },
    getOptions() {
      return data.searchOptions
    },
  }

  export default {
    props: {
      perPage: {
        type: Array,
        default: () => [10, 25, 50, 100].map(i => ({ text: i, value: i }))
      }
    },
    computed: {
      filters: () => {
        return [
          {
            title: Vue.t('filters.status._title'),
            value: 'status',
            items: [
              {
                name: Vue.t('filters.status.all'),
                value: 'all'
              },
              {
                name: Vue.t('filters.status.public'),
                value: 'public'
              },
              {
                name: Vue.t('filters.status.private'),
                value: 'private'
              }
            ]
          },
          {
            title: Vue.t('filters.category._title'),
            value: 'categories',
            items: [
              {
                name: Vue.t('filters.category.all'),
                value: 'all'
              },
              {
                name: Vue.t('filters.category.substance'),
                value: 'Substance'
              },
              {
                name: Vue.t('filters.category.spark'),
                value: '3DP/Spark'
              },
              {
                name: Vue.t('filters.category.color_density'),
                value: 'Glass/Color Density'
              },
              {
                name: Vue.t('filters.category.cloth'),
                value: 'Leather and Cloth/Cloth'
              },
              {
                name: Vue.t('filters.category.wood_finished'),
                value: 'Wood (Solid)/Finished'
              },
              {
                name: Vue.t('filters.category.aluminum'),
                value: 'Metal/Aluminum'
              },
              {
                name: Vue.t('filters.category.steel'),
                value: 'Metal/Steel'
              },
              {
                name: Vue.t('filters.category.glass_textured'),
                value: 'Glass/Textured'
              },
              {
                name: Vue.t('filters.category.leather'),
                value: 'Leather and Cloth/Leather'
              }
            ]
          }
        ]
      },
    },
    methods: methods,
    data() {
      return data
    },
    components: {
      'search-box': SearchBox,
      'search-result': SearchResult,
      'search-filters': SearchFilters,
      'mini-search': MiniSearch
    },
    events: {
      'action::publish': function(mat) {
        data.selectedRow = mat
        this.newMaterialOwner = mat.fields.owner
        this.newMaterialName = mat.fields.ui_name
        this.$root.showModal('publish')
      },
      'action::change-page': function(page) {
        this.searchOptions.skip = (page - 1) * this.searchOptions.top
        Vue.nextTick(() => $vm.$broadcast('vuetable:reload'))
      },
      'action::unpublish': function(mat) {
        data.selectedRow = mat
        this.newMaterialOwner = ''
        this.$root.showModal('unpublish')
      },
      'action::copyAsPrivate': function(mat) {
        data.selectedRow = mat
        this.newMaterialOwner = ''
        this.$root.showModal('copy-as-private')
      },
      'search-filter::changed': function(filters) {
        searchOptions.selectedFilters = filters
        searchOptions.skip = 0
        Vue.nextTick(() => $vm.$broadcast('vuetable:reload'))
      }
    },
    created() {
      $vm = this
    }
  }
</script>
