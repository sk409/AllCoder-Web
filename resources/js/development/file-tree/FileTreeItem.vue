<template>
  <li>
    <div @click="onclick" @contextmenu.stop.prevent="onShowContextMenu($event, item)">{{item.name}}</div>
    <ul v-if="isFolder" class="file-tree-item">
      <file-tree-item
        v-show="isExpanded"
        v-for="child in item.children"
        :item="child"
        :key="child.name"
        @show-context-menu="onShowContextMenu"
        @set-file="onSetFile"
      ></file-tree-item>
    </ul>
  </li>
</template>

<script>
import Folder from "../../models/Folder.js";
export default {
  name: "file-tree-item",
  props: {
    item: Object
  },
  data: function() {
    return {
      isExpanded: true
    };
  },
  computed: {
    isFolder() {
      return this.item instanceof Folder;
    }
  },
  methods: {
    onclick() {
      if (this.isFolder) {
        this.isExpanded = !this.isExpanded;
      } else {
        this.$emit("set-file", this.item);
      }
    },
    onShowContextMenu(e, item) {
      this.$emit("show-context-menu", e, item);
    },
    onSetFile(file) {
      this.$emit("set-file", file);
    }
  }
};
</script>