<template>
  <div id="development-ide" @click="onclick">
    <development-ide-header
      :title="title"
      :url="urlWriting"
      url-title="執筆"
      :container-ports="containerPorts"
      :host-ports="hostPorts"
    ></development-ide-header>
    <div id="development-body">
      <file-tree id="file-tree-view" :docker-container-id="lesson.docker_container_id"></file-tree>
      <div id="center-view">
        <source-code-editor-creating
          id="source-code-editor-creating"
          @show-context-menu="showSourceCodeEditorCreatingContextMenu"
        ></source-code-editor-creating>
        <development-ide-console :console-port="consolePort"></development-ide-console>
      </div>
    </div>
    <add-question-dialog-code
      :is-shown="addQuestionDialogCode.isShown"
      :answer="questionAnswerCode"
      :start-index="sourceCodeEditor.selectedStartIndex"
      :end-index="sourceCodeEditor.selectedEndIndex"
      :lesson-id="lesson.id"
    ></add-question-dialog-code>
    <source-code-editor-creating-context-menu
      v-show="sourceCodeEditorCreatingContextMenu.isShown"
      :start-index="sourceCodeEditor.selectedStartIndex"
      :end-index="sourceCodeEditor.selectedEndIndex"
      :lesson-id="lesson.id"
      :style="sourceCodeEditorCreatingContextMenu.style"
      @show-dialog-code="showAddQuestionDialogCode"
    ></source-code-editor-creating-context-menu>
  </div>
</template>

<script>
import AddQuestionDialogCode from "./AddQuestionDialogCode.vue";
import axios from "axios";
import DevelopmentIdeConsole from "./DevelopmentIdeConsole.vue";
import DevelopmentIdeHeader from "./DevelopmentIdeHeader.vue";
import FileTree from "./molecules/FileTree.vue";
import SourceCodeEditorCreating from "./SourceCodeEditorCreating.vue";
import SourceCodeEditorCreatingContextMenu from "./SourceCodeEditorCreatingContextMenu.vue";
import store from "../stores/development.js";
import { mapGetters } from "vuex";

export default {
  name: "DevelopmentIde",
  store,
  props: {
    lesson: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    urlWriting: {
      type: String
    },
    consolePort: {
      type: Number,
      required: true
    },
    hostPorts: {
      type: Array,
      required: true
    },
    containerPorts: {
      type: Array,
      required: true
    }
  },
  components: {
    AddQuestionDialogCode,
    DevelopmentIdeConsole,
    DevelopmentIdeHeader,
    FileTree,
    SourceCodeEditorCreating,
    SourceCodeEditorCreatingContextMenu
  },
  data() {
    return {
      addQuestionDialogCode: {
        isShown: false
      },
      sourceCodeEditor: {
        selectedStartIndex: 0,
        selectedEndIndex: 0
      },
      sourceCodeEditorCreatingContextMenu: {
        isShown: false,
        startIndex: 0,
        endIndex: 0,
        style: {
          position: "absolute",
          left: "0",
          top: "0"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["editedFileText"]),
    questionAnswerCode() {
      if (!this.editedFileText) {
        return "";
      }
      return this.editedFileText.substring(
        this.sourceCodeEditor.selectedStartIndex,
        this.sourceCodeEditor.selectedEndIndex
      );
    }
  },
  methods: {
    onclick() {
      this.sourceCodeEditorCreatingContextMenu.isShown = false;
    },
    showSourceCodeEditorCreatingContextMenu(x, y, startIndex, endIndex) {
      this.sourceCodeEditorCreatingContextMenu.isShown = true;
      this.sourceCodeEditorCreatingContextMenu.style.left = x + "px";
      this.sourceCodeEditorCreatingContextMenu.style.top = y + "px";
      this.sourceCodeEditor.selectedStartIndex = startIndex;
      this.sourceCodeEditor.selectedEndIndex = endIndex;
    },
    showAddQuestionDialogCode() {
      this.addQuestionDialogCode.isShown = true;
    }
  }
};
</script>

<style scoped>
#development-ide {
  height: 100%;
  overflow: hidden;
  color: white;
}

#development-header {
  height: 10%;
  background: rgb(30, 30, 30);
  border-bottom: solid 1.5px rgb(80, 80, 80);
}

#development-body {
  display: flex;
  height: 90%;
}

#file-tree-view {
  width: 20%;
  height: 100%;
}

#center-view {
  width: 80%;
  height: 100%;
}

#source-code-editor-creating {
  width: 100%;
  height: 60%;
}
</style>
