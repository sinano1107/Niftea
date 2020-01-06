<template>
  <v-card>
    <v-tabs
      v-model="tab"
      background-color="cyan"
      centered
      dark
      icons-and-text
      grow
    >
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#tab-1">
        new
        <v-icon>mdi-new-box</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        popular
        <v-icon>mdi-heart</v-icon>
      </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="i in 2"
        :key="i"
        :value="'tab-' + i"
      >
        <GroupPanel/>


      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import GroupPanel from './GroupPanel'

export default {
  data () {
    return {
      tab: null,
    }
  },
  components: {
    GroupPanel
  }
}
</script>
