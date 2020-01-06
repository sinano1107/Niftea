<template>
  <v-card>
    <v-toolbar
      color="cyan"
      dark
      flat
      src="../assets/seat.jpg"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-toolbar-title>席どこにする？</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs
          v-model="model"
          centered
          slider-color="cyan"
          background-color="transparent"
        >
          <v-tab
            v-for="i in 5"
            :key="i-1"
            :href="`#tab-${week[i-1]}`"
            :disabled="disabled[i-1]"
          >
            Item {{ week[i-1] }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="model">
      <v-tab-item
        v-for="day in week"
        :key="day"
        :value="`tab-${day}`"
      >
        <SeatWrapCard v-bind:day="day" />
      </v-tab-item>

      <v-tab-item :value="'tab-0'">
        <h1>明日から次の週の予約ができます。</h1>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import SeatWrapCard from './SeatWrapCard';

  export default {
    data () {
      return {
        model: '',
        week: ["Mon","Tue","Wed","Thu","Fri"],
        disabled: [true,true,true,false,false]
      }
    },
    components: {
      SeatWrapCard
    },
    created() {
      this.setDisabled()
    },
    methods: {
      setDisabled() {
        let date = new Date()
        let list = [[false,false,false,false,false],
                    [true,false,false,false,false],
                    [true,true,false,false,false],
                    [true,true,true,false,false],
                    [true,true,true,true,false],
                    [true,true,true,true,true],
                    [false,false,false,false,false]]
        let dayOfWeek = date.getDay()
        this.disabled = list[dayOfWeek]
        if (dayOfWeek == 5) {
          this.model = "tab-0"
        } else if (dayOfWeek == 0 || dayOfWeek == 6) {
          this.model = "tab-Mon"
        } else {
          this.model = `tab-${this.week[dayOfWeek]}`
        }
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
