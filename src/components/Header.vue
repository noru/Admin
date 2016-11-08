<template>
  <div class="header">
    <div class="logo">
      <img src="../../assets/images/autodesk_header_logo_140x23.png">
      <div class="separator"></div>
      <span>{{ $t('title').toUpperCase() }}</span>
    </div>
    <div class="nav-bar">
      <a v-for="item in navItems" :v-link="`{ path: '${item.target}'}`">
        {{ item.text }}
        <div class="separator"></div>
      </a>
    </div>
    <div class="user-info">
      <div v-if="user.OxygenId" class="drop-down">
        <div class="avatar">
          <img :src="avatar">
        </div>
        <div>{{ user.FirstName }} {{ user.LastName }}</div>
        <icon name="caret-down"></icon>
        <div class="user-info-menu">
          <ul class="dropdown-menu dropdown-menu-right">
            <li><a class="dropdown-item" @click="signOut">{{ $t('sign_out') }}</a></li>
          </ul>
        </div>
      </div>
      <div v-else>
        <vs-btn variant="primary" @click="signIn">{{ $t('sign_in') }}</vs-btn>
      </div>
    </div>
  </div>
  <div class="placeholder"></div>
  <vs-modal id="sign-in" class="sign-in-modal">
    <div slot="modal-body">
      <iframe id="auth-iframe" width="350" height="400" frameBorder="0"></iframe>
    </div>
  </vs-modal>
</template>
<style>
  #sign-in .modal-dialog {
    margin-top: 160px;
  }
  #sign-in .modal-footer,
  #sign-in .modal-header {
    display: none;
  }
  #sign-in .modal-dialog {
    width: 370px;
  }
</style>
<style scoped>
  .btn {
    background-color: #29ABE2;
    border-color: #29ABE2;
  }
  .placeholder {
    width: 100%;
    height: 60px;
  }
  .header {
    position: fixed;
    left: 0;
    top: 0;
    height: 60px;
    width: 100%;
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    padding: 0 20px;
    z-index: 999;
  }
  .logo {
    position: relative;
    left: 0;
    width: 500px;
  }
  .logo span {
    color: #777;
    font-weight: 500;
    position: relative;
    top: 1px;
    font-size: 1.6rem;
  }
  .user-info {
    min-width: 100px;
    text-align: right;
    margin-left: auto;
    cursor: pointer;
    position: relative;
  }
  .user-info > .drop-down > * {
    display: inline-block;
    vertical-align: middle;
  }
  .user-info .drop-down > .user-info-menu {
    z-index: 999;
    position: relative;
    top: -3px;
    display: none;
  ;
  }
  .user-info:hover .drop-down > .user-info-menu {
    display: block;
  }
  .user-info .drop-down > .user-info-menu ul {
    display: block;
    width: auto;
    min-width: 50px;
  }

  .avatar > img {
    width: 30px;
    height: 30px;
  }
  .logo > * {
    vertical-align:middle;
  }
  .nav-bar {
    width: auto;
    line-height: 35px;
  }
  .nav-bar > * {
    font-size: 1.3em;
    vertical-align: middle;
  }
  .nav-bar a:last-of-type > .separator{
    display: none;
  }
</style>

<script>
  import { Key } from '../consts'

  const conf = process.env
  const data = {
    showMenu: true,
    // this model comports with API response of /AdminConsole/CheckAdminUserAuth
    user: {
      IsSuperUser: false,
      Name: '',
      OxygenId: '',
      UserId: '',
      ProfileName: '',
      Email: '',
      FirstName: '',
      LastName: '',
      Avatar: ''
    },
    navItems: []
  }

  function getUserInfo() {
    const $vm = this
    const token = Store.get(Key.Token)
    if (token) {
      $vm.$s.getUser().then(function(response) {
        Object.keys(response.body).forEach(key => (data.user[key] = response.body[key]))
      }).then(function() {
        // FIXME, avatar and user info should be fetched together
        $vm.$s.getAvatar().then(function(response) {
          data.user.Avatar = response.body.profileImages.sizeX40
        })
      }).catch(function(error) {
        console.error(error)
        if (error.status === 403 || error.status === 401) {
          $vm.$toast(Vue.t('msg.you_are_not_admin'))
          $vm.signOut()
        }
      })
      return true
    } else {
      return false
    }
  }
  export default {
    props: {
      signInUrl: {
        type: String,
        default: `${conf.AUTH_SERVER + conf.AUTH_PATH}?client_id=${conf.CLIENT_ID}&redirect_uri=${window.location.origin + process.env.REDIRECT_PATH}&response_type=token`
      }
    },
    computed: {
      avatar: function() {
        return data.user.Avatar
      },
      signOutUrl: function() {
        return `${conf.ACCOUNT_SERVER}/Authentication/LogOut?ReturnToUrl=${encodeURIComponent(this.signInUrl)}`
      }
    },
    data () {
      return data
    },
    events: {
      'admin-console::signed-in': getUserInfo,
      'admin-console::signed-out': function() {
        Store.clear()
        data.user.OxygenId = ''
        this.$router.go('/')
      }
    },
    methods: {
      signIn: function() {
        this.$root.showModal('sign-in')
        const iframe = document.getElementById('auth-iframe')
        if (iframe.src !== this.signInUrl) {
          iframe.src = this.signInUrl
        }
        console.log(this.signInUrl)
      },
      signOut: function() {
        this.$root.$broadcast('admin-console::signed-out')
        document.getElementById('auth-iframe').src = this.signOutUrl
        this.$root.showModal('sign-in')
      }
    },
    ready() {
      if (Store.get(Key.Token)) {
        this.$root.$broadcast('admin-console::signed-in')
      }
    }
  }
</script>

