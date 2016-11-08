<template>
  <aes-header></aes-header>
  <neck></neck>
  <search-list v-if="signedIn"></search-list>
  <div class="not-signed-in" v-else>
    <span>
      {{ $t('sign_in_message') }}
      <icon name="frown-o"></icon>
    </span>
  </div>
  <spinner v-ref:spinner size="xl" fixed :text="$t('searching')"></spinner>
</template>
<style scoped>
  .not-signed-in {
    text-align: center;
    padding-top: 20px
  }
  .not-signed-in > span > *{
    vertical-align: sub
  }
</style>
<script>
  import SearchList from './SearchList'
  import { Key } from '../consts'
  export default{
    props: {
      signedIn: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'search-list': SearchList
    },
    events: {
      'admin-console::signed-in': function() {
        this.signedIn = true
        return true
      },
      'admin-console::signed-out': function() {
        this.signedIn = false
        this.$root.hideSpinner() // FIXME, for loose end requests
        return true
      }
    },
    created() {
      const $vm = this
      window.addEventListener('admin-console::close-sign-in-dialog', function() {
        $vm.$root.closeModal('sign-in')
        $vm.$root.$broadcast('admin-console::signed-in')
      }, false)
    },
    ready() {
      Store.get(Key.Token) && (this.signedIn = true)
    }
  }
</script>
