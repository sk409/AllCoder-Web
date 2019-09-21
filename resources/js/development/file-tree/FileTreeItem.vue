<template>
  <li>
    <input
      ref="name"
      v-if="item && item.parent"
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
        :key="key(child)"
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
  mounted() {
    if (!this.$refs.name) {
      return;
    }
    this.item.input = this.$refs.name;
  },
  methods: {
    onclick() {
      if (this.isFolder) {
        this.isExpanded = !this.isExpanded;
      } else {
        this.$emit("set-file", this.item);
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
    },
    key(item) {
      return item.baseRoute + item.id;
    }
  }
};
</script>