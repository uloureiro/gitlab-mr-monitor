<template>
  <div>
    <v-container>
      <v-row no-gutters>
      <v-text-field label="Search" append-icon="mdi-magnify" v-if="showSearch" v-model="searchValue" v-on:change="searchProjects"></v-text-field> 
      </v-row>
    </v-container>
    <ListSkeleton v-if="loadingList" />
    <v-list two-line v-if="showList">
      <template v-for="(item, index) in projects.data">
        <v-list-item :key="item.title">
          <v-list-item-action>
            <v-btn class="ma-2" text icon color="gray lighten-2" v-on:click="selectProject($event, item)">
              <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle
              v-text="item.description"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index < projects.data.length - 1" :key="index"></v-divider>
      </template>
    </v-list>
    <v-pagination v-if="showPagination" v-model="page" v-on:input="paginate($event)" :length="Number(projects.total_pages)"></v-pagination>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import gitlab from "../api/gitlab";
import localstorage from "../api/localstorage.js";
import ListSkeleton from "./ListSkeleton.vue"

export default defineComponent({
  components: {
    ListSkeleton
  },
  data() {
    return {
      projects: {},
      loadingAll: true,
      loadingList: true,
      searching: false,
      searchValue: ""
    };
  },
  methods: {
    fetchProjects: function (page) {
      this.loadingList = true
      gitlab.FetchProjects(page).then((res) => {
        this.loadingAll = false
        this.loadingList = false
        this.projects = res
      });
    },
    addItem: function(item) {
      localstorage.AddItem(item)
    },
    removeItem: function(item) {
      localstorage.RemoveItem(item)
    },
    selectProject: function(_, item) {
      this.addItem(item)
    },
    searchProjects: function(page) {
      this.searching = true
      gitlab.SearchProjects(this.searchValue, page)
      .then((res) =>{
        this.loadingList = false
        this.searching = false
        this.projects = res
      })
    },
    paginate: function(page) {
      if (this.searchValue) {
        this.searchProjects(page)
      } else {
        this.fetchProjects(page)
      }
    }
  },
  computed: {
    showSearch() {
      return !this.loadingAll && !this.loadingList
    },
    showList() {
      return !this.loadingList
    },
    page() {
      return Number(this.projects.page) || 0
    },
    showPagination() {
      return this.showList
    }
  },
  mounted() {
    this.fetchProjects();
  },
});
</script>
