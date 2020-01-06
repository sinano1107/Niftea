<template lang="html">
  <v-card flat>
    <v-row :justify="'center'">
      <Indeterminate v-if="loading" />
      <v-col v-else cols="11">

        <v-row :justify="'end'">
          <v-col cols="4"><SeatCard v-bind:id="0" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="1" v-bind:day="day" /></v-col>
        </v-row>

        <v-row :justify="'end'">
          <v-col cols="4"><SeatCard v-bind:id="2" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="3" v-bind:day="day" /></v-col>
        </v-row>

        <v-row>
          <v-col cols="4"><SeatCard v-bind:id="4" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="5" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="6" v-bind:day="day" /></v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col cols="4"><SeatCard v-bind:id="7" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="8" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="9" v-bind:day="day" /></v-col>
        </v-row>

        <v-row>
          <v-col cols="4"><SeatCard v-bind:id="10" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="11" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="12" v-bind:day="day" /></v-col>
        </v-row>

        <v-row :justify="'end'">
          <v-col cols="4"><SeatCard v-bind:id="13" v-bind:day="day" /></v-col>
          <v-col cols="4"><SeatCard v-bind:id="14" v-bind:day="day" /></v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SeatCard from './SeatCard'
import Indeterminate from './Indeterminate'

export default {
  data() {
    return {
      loading: true
    }
  },
  props: ['day'],
  components: {
    SeatCard,
    Indeterminate
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
