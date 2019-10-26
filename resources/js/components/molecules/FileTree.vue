<template>
  <div>
    <ul
      v-if="rootFolder"
      class="w-100 h-100"
      @contextmenu.stop.prevent="onShowContextMenu($event, rootFolder)"
    >
      <file-tree-item
        v-for="child in rootFolder.children"
        :item="child"
        :key="child.path"
        @show-context-menu="onShowContextMenu"
      ></file-tree-item>
    </ul>
  </div>
</template>

<script>
import File from "../../models/file.js";
import Folder from "../../models/folder.js";
import FileTreeItem from "../atoms//FileTreeItem.vue";
import Routes from "../../Routes.js";
export default {
  name: "file-tree",
  props: {
    lesson: Object
  },
  components: {
    FileTreeItem
  },
  data() {
    return {
      rootFolder: null,
      fileDictionary: {},
      fileDeltas: []
    };
  },
  mounted() {
    this.fetchFileTree();
    this.observeFiles();
  },
  methods: {
    fetchFileTree() {
      const that = this;
      Folder.index(
        {
          path: this.lesson.host_app_directory_path
        },
        response => {
          that.rootFolder = new Folder(that.lesson.host_app_directory_path);
          that.fileDictionary = {};
          that.fileDictionary[that.rootFolder.path] = that.rootFolder;
          const map = function(before, after) {
            before.childFolders.forEach(beforeChildFolder => {
              const afterChild = new Folder(beforeChildFolder.path);
              that.fileDictionary[afterChild.path] = afterChild;
              map(beforeChildFolder, afterChild);
              after.children.push(afterChild);
            });
            before.childFiles.forEach(beforeChildFile => {
              const afterChild = new File(beforeChildFile.path, "");
              that.fileDictionary[afterChild.path] = afterChild;
              after.children.push(afterChild);
            });
          };
          map(response.data, that.rootFolder);
        }
      );
    },
    observeFiles() {
      const that = this;
      setInterval(function() {
        axios.get(Routes.lessonDelta(that.lesson.id)).then(response => {
          let fileDeltas = [];
          response.data[1].forEach((path, index) => {
            path = path.slice(0, -1);
            fileDeltas.push({});
            fileDeltas[index].path = path.replace(
              that.lesson.container_app_directory_path,
              that.lesson.host_app_directory_path
            );
          });
          response.data[2].forEach((type, index) => {
            //console.log(type);
            fileDeltas[index].type = type;
          });
          response.data[3].forEach((isDir, index) => {
            fileDeltas[index].isDir = isDir;
          });
          response.data[4].forEach((target, index) => {
            fileDeltas[index].target = target;
          });
          //console.log(fileDeltas);
          fileDeltas.concat(that.fileDeltas);
          that.fileDeltas = [];
          fileDeltas.forEach(fileDelta => {
            // console.log(fileDelta.type);
            const fileTreeItem = that.fileDictionary[fileDelta.path];
            if (!fileTreeItem) {
              that.fileDeltas.push(fileDelta);
              return;
            }
            const targetPath = fileDelta.path + "/" + fileDelta.target;
            if (
              fileDelta.type === "CREATE" &&
              !that.fileDictionary[targetPath]
            ) {
              //console.log("CREATE");
              if (
                !fileTreeItem.children.find(
                  child => child.path === fileDelta.target
                )
              ) {
                const child =
                  fileDelta.isDir === ""
                    ? new File(targetPath, "")
                    : new Folder(targetPath);
                if (!that.fileDictionary[fileDelta.path]) {
                  return;
                }
                that.fileDictionary[child.path] = child;
                fileTreeItem.children.push(child);
                fileTreeItem.children.sort((a, b) => {
                  if (
                    a.baseRoute === Folder.baseRoute() &&
                    b.baseRoute === File.baseRoute()
                  ) {
                    return -1;
                  }
                  if (
                    a.baseRoute === File.baseRoute() &&
                    b.baseRoute === Folder.baseRoute()
                  ) {
                    return 1;
                  }
                  if (a.path < b.path) {
                    return -1;
                  } else if (b.path < a.path) {
                    return 1;
                  }
                  return 0;
                });
              }
            } else if (fileDelta.type === "DELETE") {
              //console.log("DELETE");
              const targetIndex = fileTreeItem.children.findIndex(
                child => child.path === targetPath
              );
              const notFound = -1;
              if (targetIndex !== notFound) {
                fileTreeItem.children.splice(targetIndex, 1);
                delete that.fileDictionary[targetPath];
              }
            } else if (fileDelta.type === "MODIFY") {
              //console.log("MODIFY");
              // if (that.editor.file && that.editor.file.path === targetPath) {
              //   File.index({ path: targetPath }, response => {
              //     if (response.data.text !== that.editor.getValue()) {
              //       that.editor.setValue(response.data.text);
              //     }
              //   });
              // }
            }
          });
        });
      }, 3000);
    },
    onShowContextMenu(e, item) {
      this.$emit("show-context-menu", e, item);
    }
  }
};
</script>