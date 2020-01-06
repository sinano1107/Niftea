<template>
  <div>
    <NavigationDrawer/>
    <v-content>
      <v-row :justify="'center'">
        <v-col cols="11">
          <SeatDayTab/>
        </v-col>
      </v-row>


    </v-content>
  </div>
</template>

<script>
import NavigationDrawer from './NavigationDrawer';
import SeatDayTab from './SeatDayTab';

export default {
  components: {
    NavigationDrawer,
    SeatDayTab
  }
}
</script>

<style lang="css" scoped>
</style>
