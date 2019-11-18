<template>
  <div id="development-ide">
    <div id="development-header">
      <div class="d-flex align-items-center p-3">
        <h3>{{title}}</h3>
        <div v-if="mode === 'creating'" class="ml-auto">
          <a class="btn btn-light" :href="urlWriting" target="_blank">執筆</a>
        </div>
        <div v-else>
          <a class="btn btn-light" href target="_blank">説明文</a>
        </div>
        <el-divider direction="vertical"></el-divider>
        <el-dropdown @command="handlePortDropdownCommand">
          <span class="el-dropdown-link">
            ポート
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(containerPort, index) in containerPorts"
              :key="containerPort"
              :command="hostPorts[index]"
            >{{containerPort}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div id="development-body">
      <file-tree id="file-tree-view" :lesson-id="lesson.id"></file-tree>
      <div id="center-view">
        <source-code-editor
          id="source-code-editor"
          v-on:show-source-code-editor-context-menu="showSourceCodeEditorContextMenu"
        ></source-code-editor>
        <div id="console-view" class="h-100">
          <div id="console-tool-bar" class="d-flex align-items-center p-2">
            <div class="ml-auto">
              <i class="el-icon-plus" @click="addConsole"></i>
            </div>
            <el-divider direction="vertical"></el-divider>
            <el-dropdown @command="handleConsoleDropdownCommand">
              <span class="el-dropdown-link">
                コンソール: {{activeConsoleIndex}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="consoleId in consoleCount"
                  :key="consoleId"
                  :command="consoleId - 1"
                >{{consoleId - 1}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div id="console-container" class="h-100">
            <iframe
              v-for="consoleId in consoleCount"
              :key="consoleId"
              :src="'http://localhost:'+consolePort"
              :class="{'active-console': isActiveConsole(consoleId)}"
              class="console"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    <source-code-editor-context-menu
      id="source-code-editor-context-menu"
      v-show="sourceCodeEditorContextMenu.isShown"
      :style="sourceCodeEditorContextMenu.style"
      :start-index="sourceCodeEditorContextMenu.startIndex"
      :end-index="sourceCodeEditorContextMenu.endIndex"
      :lesson-id="lesson.id"
      v-on:hide="hideSourceCodeEditorContextMenu"
    ></source-code-editor-context-menu>
  </div>
</template>

<script>
import store from "../../stores/development.js";
import FileTree from "../molecules/FileTree.vue";
import SourceCodeEditor from "./SourceCodeEditor.vue";
import SourceCodeEditorContextMenu from "./SourceCodeEditorContextMenu.vue";
import { mapMutations } from "vuex";
import axios from "axios";

export default {
  name: "DevelopmentIde",
  store,
  props: {
    lesson: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    urlWriting: {
      type: String
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
    }
  },
  components: {
    FileTree,
    SourceCodeEditor,
    SourceCodeEditorContextMenu
  },
  data() {
    return {
      activeConsoleIndex: 0,
      consoleCount: 1,
      sourceCodeEditorContextMenu: {
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
  created() {
    const that = this;
    window.onbeforeunload = function(e) {
      const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");
      $.ajax({
        url: "/development/down",
        type: "POST",
        dataType: "json",
        data: { _token: token, mode: that.mode, lesson_id: that.lesson.id },
        async: false
      });
    };
  },
  methods: {
    ...mapMutations(["setSourceCodeEditor"]),
    showSourceCodeEditorContextMenu(x, y, startIndex, endIndex) {
      this.sourceCodeEditorContextMenu.isShown = true;
      this.sourceCodeEditorContextMenu.style.left = x + "px";
      this.sourceCodeEditorContextMenu.style.top = y + "px";
      this.sourceCodeEditorContextMenu.startIndex = startIndex;
      this.sourceCodeEditorContextMenu.endIndex = endIndex;
    },
    hideSourceCodeEditorContextMenu() {
      this.sourceCodeEditorContextMenu.isShown = false;
    },
    handlePortDropdownCommand(command) {
      open(`http://localhost:${command}`);
    },
    handleConsoleDropdownCommand(command) {
      this.activeConsoleIndex = command;
    },
    addConsole() {
      ++this.consoleCount;
      this.activeConsoleIndex = this.consoleCount - 1;
    },
    isActiveConsole(consoleId) {
      return this.activeConsoleIndex === consoleId - 1;
    }
  }
};
</script>

<style scoped>
#development-ide {
  height: 100%;
  overflow: hidden;
}

#development-header {
  height: 10%;
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

#source-code-editor {
  width: 100%;
  height: 60%;
}

#console-tool-bar {
  height: 8%;
}

#console-container {
  position: relative;
}

.console {
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 32%;
}

.active-console {
  z-index: 1;
}
/* 
// #file-tree-context-menu,
// #source-code-editor-context-menu {
//   position: absolute;
// }

// .file-creation-view-button {
//   width: $file-creation-view-button-width;
//   margin-left: $file-creation-view-component-margin;
// }

// .file-creation-view-file-item {
//   width: $file-creation-view-item-width;
//   height: $file-creation-view-item-height;
// }

// #file-creation-view-header {
//   height: 8vh;
// }

// #file-creation-view-body {
//   height: 92vh;
// }

// #file-creation-view-file-name {
//   width: $file-creation-view-file-name-width;
// }

// #file-creation-view {
//   width: $file-creation-view-width;
//   height: $file-creation-view-height;
//   padding: 0 $file-creation-view-margin;
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
// }

// .source-code-editor-context-menu-button,
// .source-code-editor-context-menu-option-button {
//   display: block;
//   width: 100%;
// } */
</style>