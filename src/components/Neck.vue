<template>
  <div class="neck">
    <span class="tile" v-for="t in tiles" :v-link="`{ path: '${t.href}'}`">{{t.name}}</span>
  </div>
</template>
<style scoped>
  .neck {
    width: 100%;
    height: 60px;
    background-color:#EEE;
    padding: 0 30px;
    border-bottom: #DDD 1px solid;
    border-top: #DDD 1px solid;
  }
  .tile {
    min-width: 100px;
    display: inline-block;
    height: 58px;
    background: #29ABE2;
    text-align: center;
    line-height: 58px;
    color: white;
  }
  .tile:hover {
    cursor: pointer;
    filter: brightness(80%);
  }
  .tile:active {
    filter: none;
  }
</style>
<script>
  export default {
    data() {
      return {
        tiles: [
          {
            name: Vue.t('material').toUpperCase(),
            href: '/header'
          }
        ]
      }
    }
  }
</script>
