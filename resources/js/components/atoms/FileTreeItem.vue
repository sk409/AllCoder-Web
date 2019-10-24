<template>
  <li>
    <input
      ref="name"
      v-if="item"
      :value="item.name"
      :readonly="!item.isNameEditable"
      @click="onclick"
      @input="onInputItemName"
      @keyup.enter="onKeyUpEnter"
      @contextmenu.stop.prevent="onShowContextMenu($event, item)"
    />
    <ul v-if="isFolder" class="file-tree-item">
      <file-tree-item
        v-show="isExpanded"
        v-for="child in item.children"
        :item="child"
        :key="child.path"
        @show-context-menu="onShowContextMenu"
        @set-file="onSetFile"
      ></file-tree-item>
    </ul>
  </li>
</template>

<script>
import Folder from "../../models/folder.js";
import { mapActions } from "vuex";
export default {
  name: "file-tree-item",
  props: {
    item: Object
  },
  data: function() {
    return {
      isExpanded: false
    };
  },
  computed: {
    isFolder() {
      return this.item.baseRoute === Folder.baseRoute();
    }
  },
  mounted() {
    if (!this.$refs.name) {
      return;
    }
    this.item.input = this.$refs.name;
  },
  methods: {
    ...mapActions(["setEditedFile"]),
    onclick() {
      if (this.isFolder) {
        this.isExpanded = !this.isExpanded;
      } else {
        this.setEditedFile(this.item.path);
      }
    },
    onInputItemName(e) {
      if (!e.target.value) {
        return;
      }
      this.item.name = e.target.value;
      this.item.update();
    },
    onShowContextMenu(e, item) {
      this.$emit("show-context-menu", e, item);
    },
    onSetFile(file) {
      this.$emit("set-file", file);
    },
    onKeyUpEnter() {
      if (this.item.isNameEditable) {
        this.item.isNameEditable = false;
        this.item.input.blur();
      } else {
        this.item.isNameEditable = true;
        this.item.input.focus();
      }
    }
  }
};
</script>