<template>
  <div class="thumbnail-name">
    <div class="thumbnail">
      <img
        :src="rowData.fields.thumbnail_full.replace('http://', 'https://')"
        onerror="this.onerror=null;this.src='{{fallbackImage}}'"
      >
    </div>
    <div class="name">{{rowData.fields.ui_name}}</div>
  </div>
</template>
<style scoped>
  .thumbnail-name > * {
    display: inline-block;
    vertical-align: top;
  }
  .thumbnail {
    width: 80px;
    height: 80px;
    padding: 0;
    margin: auto;
  }
  .name {
    margin-left: 10px;
    max-width: 21rem;
    text-overflow: ellipsis;
    word-break: break-all;
  }
</style>
<script>
  export default {
    props: {
      rowData: {
        type: Object,
        required: true
      },
      fallbackImage: {
        type: String,
        default: '/static/images/default_thumbnail.png'
      }
    }
  }
</script>
