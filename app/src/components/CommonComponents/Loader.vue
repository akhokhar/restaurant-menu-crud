<template>
  <div id="loader">
    <div class="preloader-wrapper active" :class="size">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  mounted() {
  },
  props: {
    size: {
      type: String,
      default: '',
      validator(value) {
        return ['big', '', 'small'].includes(value)
      }
    }
  },
}
</script>