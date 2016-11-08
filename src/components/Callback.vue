<template>
    <div class="callback">
      <span>{{ info }}</span>
    </div>
</template>
<style scoped>
  .callback {
    text-align: center;
  }
</style>
<script>
  import { Key } from '../consts'

  function closeDialog() {
    window.parent.dispatchEvent(new CustomEvent('admin-console::close-sign-in-dialog'))
  }
  function getAuthObj(authStr) {
    return authStr.substring(1).split('&').reduce((obj, str) => {
      const kv = str.split('=')
      obj[kv[0]] = kv[1]
      return obj
    }, {})
  }

  export default{
    data() {
      return {
        info: Vue.t('redirecting')
      }
    },
    created() {
      const auth = this.$route.params['authString']
      if (auth) {
        const authObj = getAuthObj(auth)
        try {
          Store.set(Key.Token, authObj['access_token'], authObj['expires_in'] * 1000)
          closeDialog()
        } catch (e) {
          console.error('[OAuth Callback]Fail in acquiring token')
          console.error(e)
        }
      } else {
        data.info = 'Something went awry... ' + window.location
        console.error(data.info)
      }
    }
  }
</script>
