<template>
  <div>
    <!-- <input
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
    </ul>-->
    <div @click="onclick">
      <i :class="icon"></i>
      {{item.name}}
    </div>
    <div v-if="!isFile" class="file-tree-item">
      <file-tree-item
        v-show="isExpanded"
        v-for="child in item.childFolders"
        :item="child"
        :key="child.path"
        :is-file="false"
        :docker-container-id="dockerContainerId"
      ></file-tree-item>
      <file-tree-item
        v-show="isExpanded"
        v-for="child in item.childFiles"
        :item="child"
        :key="child.path"
        :is-file="true"
        :docker-container-id="dockerContainerId"
      ></file-tree-item>
    </div>
  </div>
</template>

<script>
import Folder from "../../models/folder.js";
import { mapActions } from "vuex";
import File from "../../models/file";
export default {
  name: "file-tree-item",
  props: {
    item: {
      type: Object,
      required: true
    },
    isFile: {
      type: Boolean,
      required: true
    },
    dockerContainerId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      isExpanded: false
    };
  },
  computed: {
    icon() {
      if (this.isFile) {
        return { "el-icon-tickets": true };
      }
      return this.isExpanded
        ? { "el-icon-folder-opened": true }
        : { "el-icon-folder": true };
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
      if (this.isFile) {
        const that = this;
        File.index(
          {
            path: this.item.path,
            docker_container_id: this.dockerContainerId
          },
          response => {
            if (response.data === "Permission denied") {
              that.$notify.error({
                title: "Permission denied",
                message: "このファイルへのアクセス権限がありません"
              });
            } else {
              that.setEditedFile(
                new File(
                  that.item.path,
                  response.data.text,
                  that.dockerContainerId
                )
              );
            }
          }
        );
      } else {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
          const that = this;
          const url = `/folders/children?docker_container_id=${this.dockerContainerId}&root=${this.item.path}`;
          axios.get(url).then(response => {
            if (response.data === "Permission denied") {
              that.$notify.error({
                title: "Permission denied",
                message: `このフォルダへのアクセス権限がありません`
              });
            } else {
              that.item.childFolders = [];
              that.item.childFiles = [];
              response.data.childFolders.forEach(childFolder =>
                that.item.childFolders.push(childFolder)
              );
              response.data.childFiles.forEach(childFile =>
                that.item.childFiles.push(childFile)
              );
            }
          });
        }
      }
    }
    // onInputItemName(e) {
    //   if (!e.target.value) {
    //     return;
    //   }
    //   this.item.name = e.target.value;
    //   this.item.update();
    // },
    // onShowContextMenu(e, item) {
    //   this.$emit("show-context-menu", e, item);
    // },
    // onSetFile(file) {
    //   this.$emit("set-file", file);
    // },
    // onKeyUpEnter() {
    //   if (this.item.isNameEditable) {
    //     this.item.isNameEditable = false;
    //     this.item.input.blur();
    //   } else {
    //     this.item.isNameEditable = true;
    //     this.item.input.focus();
    //   }
    // }
  }
};
</script>

<style scoped>
.file-tree-item {
  padding-left: 16px;
}
</style>