<template>
  <div>
    <ul class="w-100 h-100" @contextmenu.stop.prevent="onShowContextMenu($event, rootItem)">
      <file-tree-item :item="rootItem" @show-context-menu="onShowContextMenu" @set-file="setFile"></file-tree-item>
    </ul>
  </div>
</template>

<script>
import File from "../../models/File.js";
import Folder from "../../models/Folder.js";
import FileTreeItem from "./FileTreeItem.vue";
export default {
  name: "file-tree",
  props: {
    items: Array,
    lessonId: Number
  },
  components: {
    FileTreeItem
  },
  data: function() {
    return {
      rootItem: new Folder(null, null, null, this.lessonId)
    };
  },
  created() {
    const fileTreeBuilder = function(current, items, isFile) {
      const children = items.filter(
        item => item.parent_folder_id === current.id
      );
      current.children.push(
        ...children.map(item => {
          if (isFile) {
            const child = new File(
              item.id,
              item.name,
              item.text,
              current,
              item.lesson_id
            );
            return child;
          } else {
            const child = new Folder(
              item.id,
              item.name,
              current,
              item.lesson_id
            );
            return child;
          }
        })
      );
      children.forEach(child => {
        delete items[items.indexOf(child)];
      });
      if (items.length) {
        current.children.forEach(child => {
          if (child instanceof File) {
            return;
          }
          fileTreeBuilder(child, items, isFile);
        });
      }
    };
    const that = this;
    Folder.index({ lesson_id: this.lessonId }, response => {
      fileTreeBuilder(that.rootItem, response.data, false);
      File.index({ lesson_id: this.lessonId }, response => {
        fileTreeBuilder(that.rootItem, response.data, true);
      });
    });
  },
  methods: {
    onShowContextMenu(e, item) {
      this.$emit("show-context-menu", e, item);
    },
    setFile(file) {
      this.$emit("set-file", file);
    }
  }
};
</script>