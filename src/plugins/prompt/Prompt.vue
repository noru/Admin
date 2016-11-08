<template>
  <vs-modal id="prompt-dialog" class="publish-modal" :close-on-backdrop="false">
    <div slot="modal-header">
      <icon name="exclamation-triangle" class="alert-icon" v-if="type === 'alert'"></icon>
      <icon name="info-circle" class="info-icon" v-if="type === 'info'"></icon>
      <icon name="exclamation-triangle" class="warn-icon" v-if="type === 'warn'"></icon>
      <icon name="question-circle" class="confirm-icon" v-if="type === 'confirm'"></icon>
      <div class="header-text">{{ title }}</div>
    </div>
    <div slot="modal-body">
      <div class="prompt-dialog-content">
        {{ msg }}
      </div>
    </div>
    <div slot="modal-footer">
      <vs-btn variant="primary" @click="ok">{{ $t('ok').toUpperCase() }}</vs-btn>
      <vs-btn variant="primary" v-if="type === 'confirm'" @click="cancel">{{ $t('cancel').toUpperCase() }}</vs-btn>
    </div>
  </vs-modal>
</template>
<style>
  #prompt-dialog .modal-header > div > * {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
  }
  #prompt-dialog .alert-icon {
    color: darkred;
  }
  #prompt-dialog .info-icon {
    color: dodgerblue;
  }
  #prompt-dialog .warn-icon {
    color: orange;
  }
  #prompt-dialog .prompt-dialog-content {
    word-wrap: break-word;
  }
</style>
<script>
  import VuestrapBase from 'vuestrap-base-components'

  export default {
    components: {
      'vs-btn': VuestrapBase.buttons,
      'vs-model': VuestrapBase.modal,
    },
    data() {
      return {
        title: 'title',
        msg: '',
        options: {}
      }
    },
    computed: {
      type: function() {
        return this.options.type
      },
      onOk: function() {
        return this.options.onOk
      },
      onCancel: function() {
        return this.options.onCancel
      }
    },
    methods: {
      ok() {
        if (this.type === 'confirm' && !this.$data.options.onOk()) {
          return
        }
        this.dismiss()
      },
      cancel() {
        // todo, onCancel
        this.dismiss()
      },
      dismiss() {
        this.$broadcast('hide::modal', 'prompt-dialog')
      }
    }
  }
</script>
