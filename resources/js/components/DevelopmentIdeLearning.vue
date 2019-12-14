<template>
  <div id="development-ide">
    <development-ide-header
      :title="title"
      :url="urlReading"
      url-title="説明文"
      :container-ports="containerPorts"
      :host-ports="hostPorts"
    ></development-ide-header>
    <div id="development-body">
      <file-tree id="file-tree-view" :docker-container-id="info.docker_container_id"></file-tree>
      <div id="center-view">
        <source-code-editor-learning
          id="source-code-editor-learning"
          mode="learning"
          :questions="questions"
        ></source-code-editor-learning>
        <development-ide-console :console-port="consolePort"></development-ide-console>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DevelopmentIdeConsole from "./DevelopmentIdeConsole.vue";
import DevelopmentIdeHeader from "./DevelopmentIdeHeader.vue";
import FileTree from "./molecules/FileTree.vue";
import SourceCodeEditorLearning from "./atoms/SourceCodeEditorLearning.vue";
import store from "../stores/development.js";
import { mapMutations } from "vuex";

export default {
  name: "DevelopmentIde",
  store,
  props: {
    info: {
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
    }
  },
  components: {
    DevelopmentIdeConsole,
    DevelopmentIdeHeader,
    FileTree,
    SourceCodeEditorLearning
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

#source-code-editor-learning {
  width: 100%;
  height: 60%;
  background: black;
}
</style>
