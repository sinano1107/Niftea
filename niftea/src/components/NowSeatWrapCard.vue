<template lang="html">
  <v-card flat>
    <v-row :justify="'center'">
      <Indeterminate v-if="loading" />
      <v-col v-else cols="11">

        <v-row :justify="'end'">
          <v-col cols="4"><NowSeatCard v-bind:id="0" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="1" /></v-col>
        </v-row>

        <v-row :justify="'end'">
          <v-col cols="4"><NowSeatCard v-bind:id="2" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="3" /></v-col>
        </v-row>

        <v-row>
          <v-col cols="4"><NowSeatCard v-bind:id="4" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="5" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="6" /></v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col cols="4"><NowSeatCard v-bind:id="7" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="8" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="9" /></v-col>
        </v-row>

        <v-row>
          <v-col cols="4"><NowSeatCard v-bind:id="10" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="11" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="12" /></v-col>
        </v-row>

        <v-row :justify="'end'">
          <v-col cols="4"><NowSeatCard v-bind:id="13" /></v-col>
          <v-col cols="4"><NowSeatCard v-bind:id="14" /></v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Indeterminate from './Indeterminate'
import NowSeatCard from './NowSeatCard'

export default {
  data() {
    return {
      loading: true

    }
  },
  components: {
    Indeterminate,
    NowSeatCard
  },
  created() {
    setTimeout(()=> {
      this.loading = false
    }, 1000)
  }
}
</script>

<style lang="css" scoped>
</style>
