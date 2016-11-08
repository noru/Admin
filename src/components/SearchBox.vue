<template>
  <div class="search-box">
    <vs-ds
      :list="searchByOptions"
      :model.sync="searchBy"
      size="sm"
      variant="secondary"
      class="search-by"
      :caret="true"
    ></vs-ds>
    <vs-input
      class="search-input"
      type="text"
      size="sm"
      :model.sync="q"
      v-el:search-input
      @keyup.enter.stop="search(this.$data)"
    ></vs-input>
    <a class="search-btn" @click.stop="search(this.$data)">
      <icon name="search"></icon>
    </a>
  </div>
</template>
<style>
  .search-box .form-group {
    margin-bottom: 0;
  }
  .search-box .dropdown-select .dropdown{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: white;
    border: #29ABE2 1px solid;
    color: #29ABE2;
  }
  .search-box .dropdown-menu {
    min-width: 80px;
  }
  .search-box .dropdown-item {
    background-color: white;
    border: none;
    height: 30px;
    margin-left: 7px;
  }
  .search-input input {
    border-radius: 0;
    border: #29ABE2 1px solid;
    color: #29ABE2;
    padding: 7px;
    height: 30px;
  }

  /* temp fix: https://github.com/kzima/vuestrap-base-components/issues/28 */
  .search-box .search-by .checked-items:after {
    content: ' ▾'
  }
</style>
<style scoped>
  .search-box > * {
    display: inline-block;
    vertical-align: middle;
  }
  .search-by {
    position: relative;
    right: -10px;
  }
  .search-input {
    position: relative;
    right: -5px;
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
  }
  .search-btn:hover {
    filter: brightness(120%);
  }
  .search-btn:active {
    filter: brightness(80%);
  }
</style>
<script>
  const data = {
    q: '',
    searchBy: ''
  }
  export default {
    props: {
      search: {
        type: Function,
        require: true,
      },
      searchByOptions: {
        type: Array,
        require: true,
      }
    },
    data() {
      return data
    },
    created() {
      data.searchBy = this.searchByOptions[0].value
    },
    ready() {
      this.$els.searchInput.getElementsByTagName('input')[0].focus()
    }
  }
</script>
