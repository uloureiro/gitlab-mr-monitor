<template>
  <v-card>
    <v-app-bar dense>
      <router-link to="/mrs" class="text-decoration-none">
        <v-toolbar-title to="/mrs">Gitlab MR Monitor</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-tabs v-model="selected" grow eager>
      <v-tab to="/mrs" key="1">Merge requests</v-tab>
      <v-tab to="/tracked" key="2">Tracked projects</v-tab>
      <v-tab to="available" key="3">Available projects</v-tab>
    </v-tabs>
    <router-view></router-view>
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import worker from '../worker.js'

export default defineComponent({
  data() {
    return {
      selected: 1
    }
  },
  mounted() {
    this.selected = 1
    worker.ActivateWorker()
  }
})
</script>

