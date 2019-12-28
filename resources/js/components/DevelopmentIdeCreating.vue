<template>
  <div id="development-ide" @click="onclick">
    <development-ide-header
      :title="title"
      :url="urlWriting"
      url-title="執筆"
      :container-ports="containerPorts"
      :host-ports="hostPorts"
      @show-markdown="showBlackout(); showMarkdownEditor()"
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
    <transition-group>
      <div
        v-if="blackout.isVisible"
        class="blackout"
        key="blackout"
        @click="hideBlackout(); hideMarkdownEditor()"
      ></div>
      <MarkdownEditor
        v-if="markdownEditor.isVisible"
        :text="lesson.book"
        :questions="questions"
        key="markdownEditor"
        class="markdown-editor"
        @input="updateBook"
        @close="hideBlackout(); hideMarkdownEditor()"
        @click-question-button="clickQuestionButton"
      ></MarkdownEditor>
    </transition-group>
    <add-question-dialog-code
      :is-shown="addQuestionDialogCode.isShown"
      :answer="questionAnswerCode"
      :start-index="sourceCodeEditor.selectedStartIndex"
      :end-index="sourceCodeEditor.selectedEndIndex"
      :lesson-id="lesson.id"
      @added-question="pushQuestion"
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
import MarkdownEditor from "./MarkdownEditor.vue";
import SourceCodeEditorCreating from "./SourceCodeEditorCreating.vue";
import SourceCodeEditorCreatingContextMenu from "./SourceCodeEditorCreatingContextMenu.vue";
import store from "../stores/development.js";
import { mapActions, mapGetters } from "vuex";
import File from "../models/file";
import Lesson from "../models/lesson";

export default {
  name: "DevelopmentIde",
  store,
  props: {
    lesson: {
      type: Object,
      required: true
    },
    questions: {
      type: Array,
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
    MarkdownEditor,
    SourceCodeEditorCreating,
    SourceCodeEditorCreatingContextMenu
  },
  data() {
    return {
      addQuestionDialogCode: {
        isShown: false
      },
      blackout: {
        isVisible: false
      },
      delayedUpdateLesson: _.debounce(this.updateLesson, 1000),
      markdownEditor: {
        isVisible: false
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
    ...mapActions(["setEditedFile"]),
    onclick() {
      this.sourceCodeEditorCreatingContextMenu.isShown = false;
    },
    pushQuestion(question) {
      this.questions.push(question);
    },
    clickQuestionButton(questionId, button) {
      const question = this.questions.find(
        question => question.id == questionId
      );
      if (!question) {
        return;
      }
      File.index(
        {
          docker_container_id: this.lesson.docker_container_id,
          path: question.file_path
        },
        response => {
          const file = new File(
            response.data.path,
            response.data.text,
            this.lesson.docker_container_id
          );
          this.setEditedFile(file);
          this.markdownEditor.isVisible = false;
        }
      );
    },
    updateBook(text) {
      this.lesson.book = text;
      this.delayedUpdateLesson();
    },
    updateLesson() {
      const lesson = new Lesson(
        this.lesson.tite,
        this.lesson.description,
        this.lesson.book,
        this.lesson.docker_container_id,
        this.lesson.user_name,
        this.lesson.console_port,
        this.lesson.user_id
      );
      lesson.id = this.lesson.id;
      lesson.update();
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
    },
    showBlackout() {
      this.blackout.isVisible = true;
    },
    hideBlackout() {
      this.blackout.isVisible = false;
    },
    showMarkdownEditor() {
      this.markdownEditor.isVisible = true;
    },
    hideMarkdownEditor() {
      this.markdownEditor.isVisible = false;
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

.markdown-editor {
  position: absolute;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
