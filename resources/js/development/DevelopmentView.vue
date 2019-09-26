<template>
  <div id="development" v-on:click.capture="onclick" v-on:keydown.meta.90.stop.prevent="onundo">
    <div id="development-header" class="border-bottom border-dark">
      <div>
        {{lesson.title}}
        <a :href="'localhost:' + lesson.console_port_number" target="_blank">コンソール</a>
        <a :href="'localhost:' + lesson.preview_port_number" target="_blank">プレビュー</a>
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
      <div id="editing-view">
        <textarea class="w-100 h-100" v-model="text"></textarea>
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
      <div id="inspector-view"></div>
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
import File from "../models/File.js";
import FileTree from "./file-tree/FileTree.vue";
import Folder from "../models/Folder.js";
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
      text: "",
      rootFolder: new Folder("")
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
    // const map = function(current, currentProp) {
    //   currentProp.children.forEach(childProp => {
    //     if (childProp.hasOwnProperty("children")) {
    //       const childFolder = new Folder(childProp.path);
    //       map(childFolder, childProp);
    //       current.children.push(childFolder);
    //     } else {
    //       current.children.push(new File(childProp.path, childProp.text));
    //     }
    //   });
    // };
    // this.rootFolder = new Folder(this.rootFolderProp.path);
    // map(this.rootFolder, this.rootFolderProp);
    const that = this;
    console.log(Folder.baseRoute());
    Folder.index({ path: this.lesson.app_directory_path }, response => {
      const map = function(before, after) {
        after.path = before.path;
        before.children.forEach(beforeChild => {
          if (beforeChild.hasOwnProperty("text")) {
            after.children.push(new File(beforeChild.path, ""));
          } else {
            const afterChild = new Folder(beforeChild.path);
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
    onOpenConsoleTab(portNumber) {
      open("localhost:" + portNumber);
      //window.focus();
      //window.location.reload();
      //open("https://google.com");
    },
    onOpenPreviewTab(portNumber) {
      open("localhost:" + portNumber);
    },
    onundo() {
      alert("ごめんなさい!UNDO機能はまだ実装していません。");
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
      console.log(file.path);
      const that = this;
      File.index({ path: file.path }, response => {
        that.text = response.data.text;
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