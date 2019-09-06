<template>
  <div id="file-tree-context-menu" class="btn-group-vertical border bg-white" :style="style">
    <button type="button" class="btn btn-light" v-show="isFolder" @click="onStoreFolder">フォルダを追加</button>
    <button
      type="button"
      class="btn btn-light"
      v-show="isFolder"
      @click="onShowFileCreationView"
    >ファイルを追加</button>
    <button type="button" class="btn btn-light" v-show="item && item.id">名前を変更</button>
    <button type="button" class="btn btn-light" v-show="item && item.id" @click="onDestoryItems">削除</button>
  </div>
</template>

<script>
import Folder from "../../folder/ Folder.js";
export default {
  name: "file-tree-context-menu",
  props: {
    left: Number,
    top: Number,
    item: Object
  },
  methods: {
    onStoreFolder() {
      const isUniqueFolderName = function(children, itemName) {
        return !children.find(child => child.name === itemName);
      };
      let itemName = "New Folder";
      if (!isUniqueFolderName(this.item.children, itemName)) {
        let suffix = 2;
        while (!isUniqueFolderName(this.item.children, itemName + suffix)) {
          ++suffix;
        }
        itemName += suffix;
      }
      const folder = new Folder(null, itemName, this.item, this.item.lessonId);
      folder.store();
      this.item.children.push(folder);
    },
    onShowFileCreationView() {
      this.$emit("show-file-creation-view");
    },
    onDestoryItems() {
      const destroyer = function(item) {
        item.destroy();
        if (item.children) {
          item.children.forEach(child => destroyer(child));
        }
      };
      destroyer(this.item);
      Vue.delete(
        this.item.parent.children,
        this.item.parent.children.findIndex(child => child.id === this.item.id)
      );
    }
  },
  computed: {
    style() {
      return {
        left: this.left + "px",
        top: this.top + "px"
      };
    },
    isFolder() {
      return this.item instanceof Folder;
    }
  }
};
</script>