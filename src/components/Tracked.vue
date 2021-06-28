<template>
  <div>
    <ListSkeleton v-if="loading" />
    <v-list two-line v-else>
      <template v-for="(item, index) in projects">
        <v-list-item :key="item.title">
          <v-list-item-action>
            <v-btn class="ma-2" text icon color="gray lighten-2" v-on:click="removeProject($event, item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle
              v-text="item.description"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index < projects.length - 1" :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import localstorage from "../api/localstorage.js"
import ListSkeleton from "./ListSkeleton.vue"

export default defineComponent({
    components: {
      ListSkeleton
    },
    setup() {},
    data() {
        return {
            projects: [],
            loading: true
        }
    },
    methods: {
        fetchProjects: function() {
            localstorage.FetchAll().then((result) => {
              this.loading = false
              this.projects = result
            })
        },
        removeProject: function(_, item) {
          localstorage.RemoveItem(item.id)
          .then(() => { 
            this.loading = true
            this.fetchProjects()
          })
        }
    },
    mounted() {
        this.fetchProjects()
    },
    activated() {
      this.fetchProjects()
    }
})
</script>
