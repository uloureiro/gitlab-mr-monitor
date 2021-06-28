<template>
  <v-app>
    <v-main>
      <Main />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import Main from "./components/Main.vue"

export default defineComponent({
  components: {
    Main
  }
})
</script>
