<template>
  <div>
    <NavigationDrawer/>
    <MakePost/>

    <v-content>
      <v-row :justify="'center'">
        <v-col cols="7">
          <Timeline/>
        </v-col>
        <v-col cols="4"><GroupTab id="right-col"/></v-col>
      </v-row>

    </v-content>
  </div>

</template>

<script>
import NavigationDrawer from './NavigationDrawer';
import Timeline from './Timeline';
import GroupTab from './GroupTab';
import MakePost from './MakePost';


export default {
  components: {
    NavigationDrawer,
    Timeline,
    GroupTab,
    MakePost
  }
}
</script>

<style lang="css" scoped>
#right-col {
  position: fixed;
  width: 30%
}
</style>
