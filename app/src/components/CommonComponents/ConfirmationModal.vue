<template>
  <div id="confirmationModal" class="modal confirmationModal">
    <div class="modal-content">
      <h4 v-if="heading">{{ heading }}</h4>
      <p v-if="text">{{ text }}</p>
    </div>
    <div class="modal-footer">
      <a
        v-if="actionBtn"
        @click="submitModal()"
        class="modal-close waves-effect waves-green btn-flat">
        {{ actionBtn }}
      </a>
      <a
        v-if="closeBtn"
        @click="closeModal()"
        class="modal-close waves-effect waves-green btn-flat">
        {{ closeBtn }}
      </a>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  name: "ConfirmationModal",
  mounted() {
    var elem= document.querySelector('.confirmationModal');
    this.modalInstance = M.Modal.init(elem);
  },
  props: {
    heading: String,
    text: String,
    actionBtn: String,
    closeBtn: String,
    onActionBtn: Function
  },
  data() {
    return {
      modalInstance: null,
      isModalSubmitted: false,
      parentProps: {}
    }
  },
  methods: {
    openModal(allProps) {
      this.parentProps = { ...allProps }
      this.modalInstance.open()
    },
    closeModal() {
      this.modalInstance.close()
    },
    submitModal() {
      this.closeModal()
      this.$emit('onActionBtn', this.parentProps)
      this.parentProps = {}
    }
  },
  beforeDestroy() {
    this.modalInstance.destroy()
  }
}
</script>