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
        <file-tree id="file-tree" :lesson="lesson" @show-context-menu="onShowFileTreeContextMenu"></file-tree>
      </ul>
      <div id="center-view">
        <source-code-editor></source-code-editor>
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
import FileTree from "./file-tree/FileTree.vue";
import SourceCodeEditor from "./source-code-editor/SourceCodeEditor.vue";
import { basename } from "path";
import { mapMutations, mapState } from "vuex";
export default {
  name: "development-view",
  props: {
    lesson: Object
  },
  components: {
    FileTree,
    SourceCodeEditor
  },
  data: function() {
    return {
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
    const that = this;
    window.onbeforeunload = function() {
      axios.post("/development/unload/" + that.lesson.id);
    };
    //this.editor.getSession().setMode("ace/mode/javascript");
    //console.log(this.rootFolder);
  },
  methods: {
    ...mapMutations(["setSourceCodeEditor"]),
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
    // onSetFile(file) {
    //   this.setEditedFile(file.path);
    //   // const that = this;
    //   // File.index({ path: file.path }, response => {
    //   //   file.text = response.data.text;
    //   //   this.editor.file = file;
    //   //   this.editor.setValue(response.data.text);
    //   //   const modes = {
    //   //     js: "javascript",
    //   //     php: "php",
    //   //     html: "html",
    //   //     css: "css",
    //   //     scss: "scss",
    //   //     vue: "vue",
    //   //     json: "json",
    //   //     xml: "xml"
    //   //   };
    //   //   const pathComponents = file.path.split(".");
    //   //   const extension = pathComponents.slice(-1)[0];
    //   //   this.editor.setReadOnly(false);
    //   //   this.editor.getSession().setMode("ace/mode/" + modes[extension]);
    //   // });
    // },
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