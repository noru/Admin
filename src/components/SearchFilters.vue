<template>
  <div class="search-filters aes-panel">
    <div v-for="f in filters" class="filter">
      <span class="filter-title">{{ f.title }}</span>
      <vs-radio :list="f.items" :model.sync="selected[f.value]" :name="f.value" vertical></vs-radio>
      <div class="separator horizontal" v-if="$index + 1 < filters.length"></div>
    </div>
  </div>
</template>

<style>
  .search-filters .form-group {
    margin-bottom: 2px;
  }
  .search-filters .filter input {
    opacity: 1;
    z-index: inherit;
  }
</style>

<style scoped>
  .search-filters {
    min-width: 200px;
    max-width: 300px;
    min-height: 600px;
    padding: 20px;
  }
  .filter-title {
    font-size: 1.7rem;
    font-weight: 600;
  }
  .filter .separator {
    margin-top: 0;
  }
</style>

<script>
  const data = {
    selected: {},
  }
  export default {
    props: {
      filters: {
        type: Array,
        required: true
      }
    },
    data() {
      this.filters.forEach(f => { data.selected[f.value] = { value: f.items[0].value } })
      return data
    },
    watch: {
      'selected': {
        handler: function () {
          this.$dispatch('search-filter::changed', this.selected)
        },
        deep: true
      }
    }
  }
</script>

