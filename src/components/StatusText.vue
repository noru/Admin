<template>
  <span :class="getColor(value)">{{ text }}</span>
</template>
<style scoped>
  .red {
    color: red;
  }
  .green {
    color: green;
  }
  .grey {
    color: grey;
  }
</style>
<script>
  export default {
    props: {
      rowData: {
        type: Object,
        required: true
      }
    },
    computed: {
      value: function () {
        return this.rowData.fields.read_access
      }
    },
    data() {
      return {
        text: this.getStatus(this.rowData.fields.read_access)
      }
    },
    methods: {
      getColor(value) {
        return parseInt(value) === 0 ? 'green' : 'grey'
      },
      getStatus(i) {
        return Vue.t(parseInt(i) === 0 ? 'filters.status.public' : 'filters.status.private')
      }
    }
  }
</script>
