<template lang="html">
  <v-toolbar
    dense
    floating
    dark
    class="ma-4"
  >
    <h1>{{ now }}</h1>
  </v-toolbar>
</template>

<script>
export default {
  data() {
    return {
      now: ''
    }
  },
  created() {
    this.getNow()
  },
  methods: {
    getNow() {
      setInterval(function() {
        this.now = (new Date()).toLocaleString()
      }.bind(this), 1000)
    },
  }
}
</script>

<style lang="css" scoped>
</style>
