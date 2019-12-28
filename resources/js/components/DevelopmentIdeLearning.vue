<template>
  <div id="development-ide" @click="onclick">
    <development-ide-header
      :title="title"
      :url="urlReading"
      url-title="説明文"
      :container-ports="containerPorts"
      :host-ports="hostPorts"
      @show-markdown="showBlackout(); showMarkdownPreview();"
    ></development-ide-header>
    <div id="development-body">
      <file-tree id="file-tree-view" :docker-container-id="info.docker_container_id"></file-tree>
      <div id="center-view">
        <source-code-editor-learning
          id="source-code-editor-learning"
          mode="learning"
          :active-question-ids="activeQuestionIds"
          :questions="questions"
          :user-id="userId"
          :material-id="materialId"
          :lesson-id="lesson.id"
          @show-context-menu="showContextMenu"
        ></source-code-editor-learning>
        <development-ide-console :console-port="consolePort"></development-ide-console>
      </div>
    </div>
    <transition-group>
      <div
        v-if="markdownPreview.isVisible"
        class="blackout"
        key="blackout"
        @click="hideBlackout(); hideMarkdownPreview()"
      ></div>
      <MarkdownPreview
        v-if="markdownPreview.isVisible"
        :text="lesson.book"
        key="markdown-preview"
        class="markdown-preview"
        @click-question-button="clickQuestionButton"
      ></MarkdownPreview>
    </transition-group>
    <source-code-editor-learning-context-menu
      v-show="contextMenu.isShown"
      :style="contextMenu.style"
      class="context-menu"
      @show-question-list="showQuestionList"
    ></source-code-editor-learning-context-menu>
    <el-dialog :visible.sync="questionList.isShown">
      <div v-for="filePath in filePaths" :key="filePath" class="border p-2">
        <div>
          <el-button type="primary" @click="openFile(filePath)">開く</el-button>
          <span class="ml-2">{{filePath}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import DevelopmentIdeConsole from "./DevelopmentIdeConsole.vue";
import DevelopmentIdeHeader from "./DevelopmentIdeHeader.vue";
import File from "../models/file.js";
import FileTree from "./molecules/FileTree.vue";
import MarkdownPreview from "./MarkdownPreview.vue";
import SourceCodeEditorLearning from "./SourceCodeEditorLearning.vue";
import SourceCodeEditorLearningContextMenu from "./SourceCodeEditorLearningContextMenu.vue";
import store from "../stores/development.js";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "DevelopmentIde",
  store,
  props: {
    info: {
      type: Object,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    urlReading: {
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
    },
    questions: {
      type: Array,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    materialId: {
      type: Number,
      required: true
    },
    filePath: {
      type: String,
      default: ""
    }
  },
  components: {
    DevelopmentIdeConsole,
    DevelopmentIdeHeader,
    FileTree,
    MarkdownPreview,
    SourceCodeEditorLearning,
    SourceCodeEditorLearningContextMenu
  },
  data() {
    return {
      activeQuestionIds: [],
      blackout: {
        isVisible: false
      },
      contextMenu: {
        isShown: false,
        style: {
          left: 0,
          top: 0
        }
      },
      markdownPreview: {
        isVisible: false
      },
      questionList: {
        isShown: false
      }
    };
  },
  computed: {
    filePaths() {
      return this.questions.reduce((previous, current) => {
        const notFound = -1;
        const index = previous.findIndex(path => path === current.file_path);
        if (index === notFound) {
          previous.push(current.file_path);
        }
        return previous;
      }, []);
    }
  },
  mounted() {
    if (this.filePath !== "") {
      this.openFile(this.filePath);
    }
  },
  methods: {
    ...mapActions(["setEditedFile"]),
    onclick() {
      this.contextMenu.isShown = false;
    },
    clickQuestionButton(questionId) {
      const question = this.questions.find(
        question => question.id == questionId
      );
      if (!question) {
        return;
      }
      if (question.answer && question.text === question.answer.text) {
        this.$notify.warning({
          message: "この問題にはすでに解答しています",
          duration: 3000
        });
      }
      this.activeQuestionIds = [questionId];
      this.hideBlackout();
      this.hideMarkdownPreview();
      this.openFile(question.file_path);
    },
    openFile(path) {
      const parameters = {
        docker_container_id: this.info.docker_container_id,
        path
      };
      const that = this;
      File.index(parameters, response => {
        that.setEditedFile(
          new File(path, response.data.text, that.info.docker_container_id)
        );
      });
    },
    showContextMenu(x, y) {
      this.contextMenu.isShown = true;
      this.contextMenu.style.left = x + "px";
      this.contextMenu.style.top = y + "px";
    },
    showQuestionList() {
      this.questionList.isShown = true;
    },
    showBlackout() {
      this.blackout.isVisible = true;
    },
    hideBlackout() {
      this.blackout.isVisible = false;
    },
    showMarkdownPreview() {
      this.markdownPreview.isVisible = true;
    },
    hideMarkdownPreview() {
      this.markdownPreview.isVisible = false;
    }
  }
};
</script>

<style scoped>
.context-menu {
  position: absolute;
}

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

#source-code-editor-learning {
  width: 100%;
  height: 60%;
  background: black;
}

.markdown-preview {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
  z-index: 3;
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
