<template>
  <nav>
    <ul class="pagination">
      <li class="{{isOnFirstPage ? disabledClass : ''}} first">
        <a @click="isOnFirstPage ? null : loadPage(1)"><icon name="step-backward"  scale="0.71"></icon></a>
      </li>
      <li class="{{isOnFirstPage ? disabledClass : ''}} prev">
        <a @click="isOnFirstPage ? null : loadPage(currentPage - 1)"><icon name="caret-left"></icon></a>
      </li>
      <template v-if="notEnoughPages">
        <template v-for="n in totalPage">
          <li :class="{ active: isCurrentPage(n + 1) }">
            <a @click="loadPage(n + 1)"> {{ n + 1 }}</a>
          </li>
        </template>
      </template>
      <template v-else>
        <template v-for="n in windowSize">
          <li :class="{ active: isCurrentPage(startPage + n) }">
            <a @click="loadPage(startPage + n)"> {{ startPage + n }}</a>
          </li>
        </template>
      </template>
      <li class="{{isOnLastPage ? disabledClass : ''}} next">
        <a @click="isOnLastPage ? null : loadPage(currentPage + 1)"><icon name="caret-right"></icon></a>
      </li>
      <li class="{{isOnLastPage ? disabledClass : ''}} last">
        <a @click="isOnLastPage ? null : loadPage(totalPage)"><icon name="step-forward" scale="0.71"></icon></a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  .pagination > li > a {
    height: 30px;
  }
  .active {
    background: #29ABE3;
  }
</style>

<script>
  import PaginationMixin from 'vuetable/VuetablePaginationMixin'

  export default {
    mixins: [PaginationMixin],
    computed: {
      currentPage: function() {
        return this.tablePagination && this.tablePagination.current_page
      },
      startPage: function() {
        const padding = (this.windowSize - 1) / 2
        const start = this.currentPage - padding
        if (start < 1) {
          return 1
        } else if ((start + this.windowSize) > this.tablePagination.last_page) {
          return this.tablePagination.last_page - this.windowSize + 1
        } else {
          return start
        }
      }

    },
    methods: {
      loadPage: function(page) {
        if (page === this.currentPage) return
        // cloudsearch limit without cursor
        // http://docs.aws.amazon.com/cloudsearch/latest/developerguide/paginating-results.html#deep-paging
        if (page * this.tablePagination.per_page > 10000) {
          page = Math.floor(10000 / this.tablePagination.per_page)
          this.$toast(`Due to depth limit of AWS Cloudsearch, only ${page} pages are available`)
          console.warn(`[AdminConsole] Due to depth limit of Cloudsearch, only ${page} pages are available`)
        }
        this.$dispatch('action::change-page', page)
      },
    }

  }
</script>
