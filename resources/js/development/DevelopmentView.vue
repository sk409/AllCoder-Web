<template>
  <div id="development" v-on:click.capture="onclick">
    <div id="development-header" class="border-bottom border-dark">
      <div>
        {{lesson.title}}
        <a
          :href="'http://localhost:' + lesson.preview_port_number"
          target="_blank"
        >プレビュー</a>
      </div>
    </div>
    <div id="development-body">
      <ul id="file-tree-view">
        <file-tree
          id="file-tree"
          :root-folder="rootFolder"
          @show-context-menu="onShowFileTreeContextMenu"
          @set-file="onSetFile"
        ></file-tree>
      </ul>
      <div id="center-view">
        <div id="source-code-editor" ref="sourceCodeEditor"></div>
        <iframe id="console" :src="'http://localhost:' + lesson.console_port_number"></iframe>
        <!-- <source-code-editor
          :file="file"
          :questions="questions"
          :description-targets="descriptionTargets"
          v-on:show-context-menu.stop.prevent="onShowSourceCodeEditorContextMenu"
        ></source-code-editor>-->
        <!-- {{-- <description-editor v-show="file" :lesson-id="{{$lesson->id}}" :file="file" :image-urls="{
            plusButton: '{{asset("images/plus-button.png")}}',
            prevButton: '{{asset("images/prev-button.png")}}',
            nextButton: '{{asset("images/next-button.png")}}',
            crossButton: '{{asset("images/cross-button.png")}}'
            }" :selected-description="selectedDescription" :descriptions="descriptions"
        v-on:select-description="onSelectDescription"></description-editor> --}}-->
      </div>
      <!-- <div id="inspector-view"></div> -->
    </div>
    <!-- <transition name="fade">
      <file-creation-view
        v-show="fileCreationView.isShown"
        :folder="fileTree.contextMenu.item"
        v-on:hide="onHideFileCreationView"
      ></file-creation-view>
    </transition>
    <file-tree-context-menu
      v-show="fileTree.contextMenu.isShown"
      :left="fileTree.contextMenu.left"
      :top="fileTree.contextMenu.top"
      :item="fileTree.contextMenu.item"
      v-on:show-file-creation-view="onShowFileCreationView"
    ></file-tree-context-menu>
    <source-code-editor-context-menu
      v-show="sourceCodeEditor.contextMenu.isShown"
      :left="sourceCodeEditor.contextMenu.left"
      :top="sourceCodeEditor.contextMenu.top"
      :start-index="sourceCodeEditor.contextMenu.selection.startIndex"
      :end-index="sourceCodeEditor.contextMenu.selection.endIndex"
      :file="file"
      :selected-description="selectedDescription"
    ></source-code-editor-context-menu>-->
  </div>
</template>

<script>
import { basename } from "path";
import File from "../models/File.js";
import FileTree from "./file-tree/FileTree.vue";
import Folder from "../models/Folder.js";
import Routes from "../Routes.js";
export default {
  name: "development-view",
  props: {
    lesson: Object
  },
  components: {
    FileTree
  },
  data: function() {
    return {
      editor: null,
      rootFolder: null,
      fileDictionary: {}
      // file: null,
      // descriptions: null,
      // fileCreationView: {
      //   isShown: false
      // },
      // fileTree: {
      //   contextMenu: {
      //     isShown: false,
      //     left: 0,
      //     top: 0,
      //     item: null
      //   }
      // },
      // sourceCodeEditor: {
      //   disabled: true,
      //   contextMenu: {
      //     isShown: false,
      //     left: 0,
      //     top: 0,
      //     selection: {}
      //   }
      // }
    };
  },
  // computed: {
  //   questions() {
  //     return this.descriptions
  //       ? this.descriptions.map(description => description.questions).flat()
  //       : [];
  //   },
  //   descriptionTargets() {
  //     return this.descriptions
  //       ? this.descriptions.map(description => description.targets).flat()
  //       : [];
  //   },
  //   selectedDescription() {
  //     return this.descriptions
  //       ? this.descriptions.find(description => description.isSelected)
  //       : null;
  //   }
  // },
  mounted() {
    this.rootFolder = new Folder(this.lesson.host_app_directory_path);
    this.fileDictionary[this.rootFolder.path] = this.rootFolder;
    const that = this;
    Folder.index({ path: this.lesson.host_app_directory_path }, response => {
      const map = function(before, after) {
        before.children.forEach(beforeChild => {
          if (beforeChild.hasOwnProperty("text")) {
            after.children.push(new File(beforeChild.path, ""));
          } else {
            const afterChild = new Folder(beforeChild.path);
            afterChild.path = beforeChild.path;
            that.fileDictionary[afterChild.path] = afterChild;
            map(beforeChild, afterChild);
            after.children.push(afterChild);
          }
        });
      };
      map(response.data, that.rootFolder);
    });
    window.onbeforeunload = function() {
      axios.post("/development/unload/" + that.lesson.id);
    };
    this.editor = ace.edit("source-code-editor");
    this.editor.$blockScrolling = Infinity;
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    this.editor.setTheme("ace/theme/monokai");
    this.editor.session.on("change", delta => {
      if (
        delta.action === "insert" &&
        that.editor.file.txt !== that.editor.getValue()
      ) {
        that.editor.file.text = that.editor.getValue();
        //that.editor.file.update();
      }
    });
    this.editor.setReadOnly(true);
    setInterval(function() {
      axios.get(Routes.lessonDelta(that.lesson.id)).then(response => {
        let deltas = Array(response.data[0].length);
        deltas.fill({});
        response.data[1].forEach((path, index) => {
          //console.log(deltas[index]);
          path = path.slice(0, -1);
          deltas[index].path = path.replace(
            that.lesson.container_app_directory_path,
            that.lesson.host_app_directory_path
          );
        });
        response.data[2].forEach((type, index) => {
          deltas[index].type = type;
        });
        response.data[3].forEach((isDir, index) => {
          deltas[index].isDir = isDir;
        });
        response.data[4].forEach((target, index) => {
          deltas[index].target = target;
        });
        deltas.forEach(delta => {
          const fileTreeItem = that.fileDictionary[delta.path];
          const targetPath = delta.path + "/" + delta.target;
          if (delta.type === "CREATE") {
            if (
              !fileTreeItem.children.find(child => child.path === delta.target)
            ) {
              if (delta.isDir === "") {
                fileTreeItem.children.push(new File(targetPath, ""));
              } else {
                fileTreeItem.children.push(new Folder(targetPath));
              }
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
          } else if (delta.type === "DELETE") {
            const targetIndex = fileTreeItem.children.findIndex(
              child => child.path === targetPath
            );
            const notFound = -1;
            if (targetIndex !== notFound) {
              fileTreeItem.children.splice(targetIndex, 1);
            }
          } else if (delta.type === "MODIFY") {
            console.log("MODIFY");
            if (that.editor.file.path === targetPath) {
              File.index({ path: targetPath }, response => {
                if (response.data.text !== that.editor.getValue()) {
                  that.editor.setValue(response.data.text);
                }
              });
            }
          }
        });
      });
    }, 1000);
    //this.editor.getSession().setMode("ace/mode/javascript");
    //console.log(this.rootFolder);
  },
  methods: {
    onclick() {
      // this.fileTree.contextMenu.isShown = false;
      // if (
      //   this.fileTree.contextMenu.item &&
      //   this.fileTree.contextMenu.item.isNameEditable
      // ) {
      //   this.fileTree.contextMenu.item.isNameEditable = false;
      //   this.fileTree.contextMenu.item.input.blur();
      // }
      // this.sourceCodeEditor.contextMenu.isShown = false;
      // this.sourceCodeEditor.isClicked = true;
    },
    onSelectDescription(id) {
      // const that = this;
      // const unselectDescriptions = function() {
      //   that.descriptions.forEach(description => {
      //     description.isSelected = false;
      //   });
      // };
      // if (id === null) {
      //   unselectDescriptions();
      //   return;
      // }
      // const description = this.descriptions.find(
      //   description => description.id === id
      // );
      // if (!description) {
      //   return;
      // }
      // unselectDescriptions();
      // description.isSelected = true;
    },
    onSetFile(file) {
      const that = this;
      File.index({ path: file.path }, response => {
        file.text = response.data.text;
        this.editor.file = file;
        this.editor.setValue(response.data.text);
        const modes = {
          js: "javascript",
          php: "php",
          html: "html",
          css: "css",
          scss: "scss",
          vue: "vue",
          json: "json",
          xml: "xml"
        };
        const pathComponents = file.path.split(".");
        const extension = pathComponents.slice(-1)[0];
        this.editor.setReadOnly(false);
        this.editor.getSession().setMode("ace/mode/" + modes[extension]);
        // if (
        //   extension === "php" &&
        //   2 <= pathComponents.length &&
        //   pathComponents.slice(-2)[0] === "blade"
        // ) {
        //   this.editor.getSession().setMode("ace/mode/php_laravel_blade");
        // } else {
        //   this.editor.getSession().setMode("ace/mode/" + modes[extension]);
        // }
        //this.editor.getSession().setMode("ace/mode/javascript");
        //that.text = response.data.text;
        //that.$refs.editor.textContent = "";
        //that.$refs.sourceCodeEditor.textContent = response.data.text;
        // that.$refs.editor.textContent += response.data.text.substring(0, 10);
        // document.execCommand("italic", false);
        // that.$refs.editor.textContent += response.data.text.substring(10);
      });
      // axios.get("/files/fetch_text?path=" + file.path).then(response => {
      //   console.log(response.data);
      //   that.text = response.data;
      // });

      // this.file = file;
      // const that = this;
      // Description.index(
      //   {
      //     file_id: file.id
      //   },
      //   response => {
      //     that.descriptions = response.data.map(data => {
      //       const description = new Description(
      //         data.id,
      //         data.index,
      //         data.text,
      //         data.file_id
      //       );
      //       DescriptionTarget.index(
      //         {
      //           description_id: description.id
      //         },
      //         response => {
      //           description.targets.push(
      //             ...response.data.map(descriptionTarget => {
      //               return new DescriptionTarget(
      //                 descriptionTarget.id,
      //                 descriptionTarget.start_index,
      //                 descriptionTarget.end_index,
      //                 description.id,
      //                 file.text.substring(
      //                   descriptionTarget.start_index,
      //                   descriptionTarget.end_index
      //                 )
      //               );
      //             })
      //           );
      //           Question.index(
      //             {
      //               description_id: description.id
      //             },
      //             response => {
      //               response.data.forEach(question => {
      //                 InputButton.index(
      //                   {
      //                     question_id: question.id
      //                   },
      //                   response => {
      //                     const inputButtons = response.data.map(
      //                       inputButton => {
      //                         return new InputButton(
      //                           inputButton.id,
      //                           inputButton.index,
      //                           inputButton.start_index,
      //                           inputButton.end_index,
      //                           inputButton.line_number,
      //                           inputButton.question_id,
      //                           file.text.substring(
      //                             inputButton.start_index,
      //                             inputButton.end_index
      //                           )
      //                         );
      //                       }
      //                     );
      //                     description.questions.push(
      //                       new Question(
      //                         question.id,
      //                         question.index,
      //                         question.description_id,
      //                         inputButtons
      //                       )
      //                     );
      //                   }
      //                 );
      //               });
      //               // return new Question(
      //               //   question.id,
      //               //   question.start_index,
      //               //   question.end_index,
      //               //   question.description_id,
      //               //   that.file.text.substring(
      //               //     question.start_index,
      //               //     question.end_index
      //               //   )
      //               // );
      //             }
      //           );
      //         }
      //       );
      //       return description;
      //     });
      //   }
      // );
      // this.sourceCodeEditor.disabled = false;
    },
    onShowFileTreeContextMenu(e, item) {
      // this.fileTree.contextMenu.isShown = true;
      // this.fileTree.contextMenu.left = e.pageX;
      // this.fileTree.contextMenu.top = e.pageY;
      // this.fileTree.contextMenu.item = item;
    },
    onShowFileCreationView() {
      //this.fileCreationView.isShown = true;
    },
    onHideFileCreationView() {
      //this.fileCreationView.isShown = false;
    },
    onShowSourceCodeEditorContextMenu(e) {
      // this.sourceCodeEditor.contextMenu.isShown = true;
      // this.sourceCodeEditor.contextMenu.left = e.pageX;
      // this.sourceCodeEditor.contextMenu.top = e.pageY;
      // this.sourceCodeEditor.contextMenu.selection.startIndex =
      //   e.target.selectionStart;
      // this.sourceCodeEditor.contextMenu.selection.endIndex =
      //   e.target.selectionEnd;
    }
  }
};
</script>