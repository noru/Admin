<template>
  <div class="et-wrapper">
    <span class="et-content">{{ msg }}</span>
  </div>
</template>
<style scoped>
  .et-wrapper {
    background-color: rgba(48, 45, 55, 0.7);
    border-radius: 5px;
    color: white;
    padding: 10px;
    z-index: 9999;
    left: 0;
    right: 0;
    margin: auto;
    width: auto;
    display: inline-block;
    max-width: 350px;
    min-width: 250px;
    text-align: center;
  }
  .et-wrapper {
    position: fixed;
    top: 80%;
  }
  .et-content {
    text-align: center;
  }
</style>
<script>
  export default {
    data() {
      return {
        msg: 'Hello Shorty!'
      }
    }
  }
</script>
