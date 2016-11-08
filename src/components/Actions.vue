<template>
  <div class="actions">
    <vs-d
      class="actions-dropdown"
      :text="$t('actions')"
      type="secondary"
    >
      <li v-for="act in actions">
        <a class="dropdown-item" @click="invokeAction(act.value)(rowData)" v-if="show(act.value)">{{ act.name }}</a>
      </li>
    </vs-d>
  </div>
</template>

<style>
  .actions .actions-dropdown button {
    background-color: white;
  }
</style>
<script>
  let $vm // assign when component is ready
  function publish(data) {
    $vm.$dispatch('action::publish', data)
  }
  function unpublish(data) {
    $vm.$dispatch('action::unpublish', data)
  }
  function copyAsPrivate(data) {
    $vm.$dispatch('action::copyAsPrivate', data)
  }
  function invokeAction(action) {
    switch (action) {
      case 'publish': return publish
      case 'unpublish': return unpublish
      case 'copy': return copyAsPrivate
      default: return () => {
        alert('not implemented')
      }
    }
  }

  export default{
    props: {
      rowData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        actions: [
          {
            name: Vue.t('publish'),
            value: 'publish'
          },
          {
            name: Vue.t('unpublish'),
            value: 'unpublish'
          },
          {
            name: Vue.t('copy'),
            value: 'copy'
          },
          {
            name: Vue.t('delete'),
            value: 'delete'
          }
        ]
      }
    },
    methods: {
      invokeAction: invokeAction,
      show(value) {
        const readAccess = this.rowData.fields.read_access
        switch (value) {
          case 'publish':
            return readAccess === '1'
          case 'unpublish':
            return readAccess !== '1'
          default:
            return true
        }
      }
    },
    created() {
      $vm = this
    }
  }
</script>
