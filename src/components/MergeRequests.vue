<template>
  <div>
    <ListSkeleton v-if="loading" />
    <v-container v-if="noReviews">No pending reviews! Woohoo! \o/</v-container>
    <v-list two-line v-else>
      <template v-for="(item, index) in mrs">
        <v-list-item :key="item.id" :href="item.web_url" target="_blank" rel="noopener noreferrer">
          <v-list-item-avatar>
            <v-img :src="item.project_avatar_url"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle v-text="item.project_name + ' | ' + item.author.name + ' | ' + Intl.DateTimeFormat(language).format(new Date(item.created_at))"> </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index < mrs.length - 1" :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import localstorage from "../api/localstorage.js"
import gitlab from "../api/gitlab.js"
import ListSkeleton from "./ListSkeleton.vue"

export default defineComponent({
    components: {
      ListSkeleton
    },
    setup() {},
    data() {
      return {
          mrs: [],
          loading: true
      }
    },
    computed: {
      noReviews() { return !this.loading && !this.mrs.length },
      language() { return navigator.language ?? "en-US" }
    },
    methods: {
      fetchMergeRequests: async function() {
        let projects = await localstorage.FetchAll()
        let projectsMrs = await gitlab.FetchMergeRequests(projects)
        for (let i = 0; i < projectsMrs.length; i++) {
          let project = localstorage.Fetch(projectsMrs[i].data[0].project_id)
          for (let ii = 0; ii < projectsMrs[i].data.length; ii++) {
            const mr = projectsMrs[i].data[ii];
            
            mr.project_name = project.name
            mr.project_avatar_url = project.avatar_url
            this.mrs.push(mr)
          }
        }
        this.loading = false
      },
    },
    mounted() {
        this.fetchMergeRequests()
    },
    activated() {
      this.fetchMergeRequests()
    }
})
</script>
