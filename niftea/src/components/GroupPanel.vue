<template>
  <v-row >
    <v-expansion-panels focusable popout>
      <v-expansion-panel
        v-for="(item,i) in items"
        :key="i"
      >
        <v-expansion-panel-header>

          <v-row>
            <v-avatar size="40px">
              <img
                :src="item.img"
              >
            </v-avatar>
            <v-col>
              <span>{{ item.name }}</span>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
          <v-col>{{ item.message }}</v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
export default {
  props: ['items']
}
</script>
